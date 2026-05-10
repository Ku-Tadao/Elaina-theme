import { getThemeName } from "../otherThings"
import { log, warn, error } from '../utils/themeLog';
import { customAvatar } from "../theme/customUI/customIcon";
import { fileSystem } from "../utils/fileSystem";

const icdata = (await import(`//plugins/${getThemeName()}/config/icons.js`)).default;

const datapath = `//plugins/${getThemeName()}/`
const iconFolder = `${datapath}assets/icon/`

const ICON_TYPES = ["avatar", "border", "banner", "emblem", "hoverCardBackdrop"] as const;
type IconType = typeof ICON_TYPES[number];

const ICONS_DIR = './data/icons';
const HASHES_FILE = './data/icons/hashes.json';

/** Dual-mode storage: 'fs' caches icons locally, 'memory' uses in-memory blob URLs */
let storageMode: 'fs' | 'memory' = 'memory';
let hashCache: Record<string, string> = {};

let friendIconList: FriendIconEntry[] = [];
let friendsList: { summonerId: number; puuid: string }[] = [];



class SyncUserIcons {
    getIconFolder() { return iconFolder; }
    getIconData() { return icdata; }

    private getOwnIconMap(): OwnIconEntry[] {
        const currentBanner = ElainaData.get("CurrentBanner");
        return [
            { url: `${iconFolder}${icdata["Avatar"]}`, type: "avatar" },
            { url: `${iconFolder}${icdata["Border"]}`, type: "border" },
            { url: `${iconFolder}Regalia-Banners/${currentBanner}`, type: "banner" },
            { url: `${iconFolder}${icdata["Hover-card"]}`, type: "hoverCardBackdrop" },
            { url: `${iconFolder}${icdata["Honor"]}`, type: "emblem" }
        ];
    }

    private async computeFileHash(url: string): Promise<string | null> {
        try {
            const res = await fetch(url);
            if (!res.ok) return null;
            const buf = await res.arrayBuffer();
            const hash = await crypto.subtle.digest('SHA-256', buf);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (err: any) {
            error("Failed to compute file hash:", err);
            return null;
        }
    }

    private async runLimited(tasks: (() => Promise<void>)[], limit = 16): Promise<void> {
        let index = 0;
        const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
            while (index < tasks.length) {
                const task = tasks[index++];
                await task();
            }
        });
        await Promise.all(workers);
    }

    private async saveHashes(): Promise<void> {
        if (storageMode !== 'fs') return;
        try {
            await fileSystem.write(HASHES_FILE, JSON.stringify(hashCache, null, 2), false);
        } catch (err: any) {
            error('Failed to save icon hashes:', err);
        }
    }

    private async saveIconToFs(summonerId: number, type: string, dataUri: string): Promise<void> {
        if (storageMode !== 'fs') return;
        try {
            const dir = `${ICONS_DIR}/${summonerId}`;
            await fileSystem.mkdir(dir);
            await fileSystem.write(`${dir}/${type}`, dataUri, false);
        } catch (err: any) {
            error(`Failed to save icon ${type} for ${summonerId}:`, err);
        }
    }

    private async loadIconFromFs(summonerId: number, type: string): Promise<string | null> {
        if (storageMode !== 'fs') return null;
        try {
            const content = await fileSystem.read(`${ICONS_DIR}/${summonerId}/${type}`);
            return content || null;
        } catch { return null; }
    }

    private async deleteIconFromFs(summonerId: number, type: string): Promise<void> {
        if (storageMode !== 'fs') return;
        try {
            await fileSystem.rm(`${ICONS_DIR}/${summonerId}/${type}`, { recursive: false });
        } catch { }
    }

    private pruneHashCacheForCurrentFriends(): boolean {
        const activeKeys = new Set<string>();
        for (const friend of friendsList) {
            for (const type of ICON_TYPES) {
                activeKeys.add(`${friend.summonerId}:${type}`);
            }
        }

        let changed = false;
        for (const key of Object.keys(hashCache)) {
            if (!activeKeys.has(key)) {
                delete hashCache[key];
                changed = true;
            }
        }

        return changed;
    }

    /** Initialize icon storage after FileSystem.init(context) has resolved window.isContextFSExist. */
    async init(): Promise<void> {
        if (window.isContextFSExist) {
            storageMode = 'fs';

            await fileSystem.mkdir(ICONS_DIR);

            const raw = await fileSystem.read(HASHES_FILE);
            if (raw && raw.trim().length > 0) {
                try { hashCache = JSON.parse(raw); }
                catch { hashCache = {}; }
            }
            log('SyncUserIcons initialized in fs mode');
        } else {
            storageMode = 'memory';
            log('SyncUserIcons initialized in memory mode (filesystem unavailable)');
        }
    }

    async uploadIcon(icon: string, iconType: string): Promise<void> {
        const response = await fetch(icon);
        if (!response.ok) error(`Failed to fetch icon: ${icon}`);

        const blob = await response.blob();
        const mimeToExt: Record<string, string> = {
            "image/png": ".png", "image/jpeg": ".jpg",
            "image/webp": ".webp", "image/gif": ".gif"
        };
        log("Uploading " + icon);
        const ext = mimeToExt[blob.type] || ".png";
        const file = new File([blob], iconType + ext, { type: blob.type });

        try {
            await window.elainathemeApi.uploadImage(
                ElainaData.get("ElainaTheme-Token"),
                ElainaData.get("Summoner-ID"), iconType, file
            );
        } catch (err: any) {
            error(`Failed to upload icon of type ${iconType}: `, err);
        }
    }

    private async syncOwnIcons(summonerID: number): Promise<void> {
        const iconMap = this.getOwnIconMap();

        if (typeof window.elainathemeApi.getImageHashes !== 'function') {
            warn("getImageHashes not available, uploading own icons without hash check");
            await Promise.all(iconMap.map(({ url, type }) => this.uploadIcon(url, type)));
            return;
        }

        const [localHashes, serverHashes] = await Promise.all([
            Promise.all(iconMap.map(async ({ type, url }) => ({
                type,
                hash: await this.computeFileHash(url)
            }))),
            window.elainathemeApi.getImageHashes(summonerID, iconMap.map(icon => icon.type))
        ]);

        if (!serverHashes) {
            warn("getImageHashes failed, uploading own icons without hash check");
            await Promise.all(iconMap.map(({ url, type }) => this.uploadIcon(url, type)));
            return;
        }

        await Promise.all(iconMap.map(async ({ url, type }) => {
            const localHash = localHashes.find(item => item.type === type)?.hash || null;
            const serverHash = serverHashes[type] || null;

            if (!localHash || !serverHash || localHash !== serverHash) {
                log(`Icon "${type}" changed, uploading...`);
                await this.uploadIcon(url, type);
            } else {
                log(`Icon "${type}" unchanged, skipping upload`);
            }
        }));
    }

    async getFriendList(): Promise<void> {
        const friends = await fetch('/lol-chat/v1/friends').then(r => r.json());
        friendsList = [];
        for (const f of friends) {
            if (f.summonerId) {
                friendsList.push({ summonerId: f.summonerId, puuid: f.puuid });
            }
        }
    }

    /** memory mode: batch endpoint, in-memory blob URLs (old Pengu fallback) */
    private async syncFriendsIconsMemory(): Promise<void> {
        friendIconList = await window.elainathemeApi.getFriendsImage(friendsList);
    }

    /** fs mode: one batch diff request, then read unchanged icons from local cache */
    private async syncFriendsIconsFs(): Promise<FriendIconSyncStats> {
        const stats: FriendIconSyncStats = {
            serverMs: 0,
            cacheMs: 0,
            saveMs: 0,
            patches: 0,
            cacheReads: 0,
            updatedIcons: 0,
            deletedIcons: 0
        };

        if (!window.elainathemeApi) {
            warn("elainathemeApi not available, skipping friend icon sync");
            return stats;
        }

        if (typeof window.elainathemeApi.syncFriendsIcons !== 'function') {
            warn("syncFriendsIcons not available, falling back to getFriendsImage");
            const serverStart = performance.now();
            await this.syncFriendsIconsMemory();
            stats.serverMs = Math.round(performance.now() - serverStart);
            return stats;
        }

        const prunedHashes = this.pruneHashCacheForCurrentFriends();
        const serverStart = performance.now();
        const serverPatches = await window.elainathemeApi.syncFriendsIcons(friendsList, hashCache);
        stats.serverMs = Math.round(performance.now() - serverStart);
        if (!serverPatches) {
            warn("syncFriendsIcons failed, falling back to getFriendsImage");
            if (prunedHashes) {
                const saveStart = performance.now();
                await this.saveHashes();
                stats.saveMs += Math.round(performance.now() - saveStart);
            }
            const fallbackStart = performance.now();
            await this.syncFriendsIconsMemory();
            stats.serverMs += Math.round(performance.now() - fallbackStart);
            return stats;
        }

        const patchBySummonerId = new Map<string, SyncFriendIconPatch>();
        for (const patch of serverPatches as SyncFriendIconPatch[]) {
            patchBySummonerId.set(String(patch.summonerID), patch);
        }
        stats.patches = patchBySummonerId.size;

        friendIconList = [];
        let hashesChanged = prunedHashes;
        const cacheReadTasks: (() => Promise<void>)[] = [];
        const writeTasks: (() => Promise<void>)[] = [];

        for (const friend of friendsList) {
            const icons: Record<IconType, string | null> = {} as Record<IconType, string | null>;
            const patch = patchBySummonerId.get(String(friend.summonerId));
            const changedIcons = patch?.icons || {};

            for (const type of ICON_TYPES) {
                const key = `${friend.summonerId}:${type}`;

                if (Object.prototype.hasOwnProperty.call(changedIcons, type)) {
                    const update = changedIcons[type];

                    if (update?.data && update.hash) {
                        hashCache[key] = update.hash;
                        icons[type] = update.data;
                        stats.updatedIcons++;
                        writeTasks.push(() => this.saveIconToFs(friend.summonerId, type, update.data));
                    } else {
                        delete hashCache[key];
                        icons[type] = null;
                        stats.deletedIcons++;
                        writeTasks.push(() => this.deleteIconFromFs(friend.summonerId, type));
                    }

                    hashesChanged = true;
                    continue;
                }

                if (hashCache[key]) {
                    stats.cacheReads++;
                    cacheReadTasks.push(async () => {
                        const cached = await this.loadIconFromFs(friend.summonerId, type);
                        if (cached) {
                            icons[type] = cached;
                        } else {
                            delete hashCache[key];
                            icons[type] = null;
                            hashesChanged = true;
                        }
                    });
                } else {
                    icons[type] = null;
                }
            }

            friendIconList.push({
                summonerID: friend.summonerId,
                puuid: friend.puuid,
                icon: icons
            });
        }

        const cacheStart = performance.now();
        await this.runLimited(cacheReadTasks);
        stats.cacheMs = Math.round(performance.now() - cacheStart);

        const saveStart = performance.now();
        await this.runLimited(writeTasks, 8);
        if (hashesChanged) await this.saveHashes();
        stats.saveMs = Math.round(performance.now() - saveStart);

        return stats;
    }

    async getFriendsIcons(): Promise<void> {
        const totalStart = performance.now();
        const friendListStart = performance.now();
        await this.getFriendList();
        const friendListMs = Math.round(performance.now() - friendListStart);

        if (friendsList.length === 0) {
            log("No friends found, skipping icon sync");
            return;
        }

        let stats: FriendIconSyncStats | null = null;

        if (storageMode === 'fs') {
            stats = await this.syncFriendsIconsFs();
        } else {
            await this.syncFriendsIconsMemory();
        }

        const totalMs = Math.round(performance.now() - totalStart);
        if (stats) {
            log(
                `Friend icon sync finished in ${totalMs}ms (${friendsList.length} friends, ${storageMode} mode)\n` +
                `(friends=${friendListMs}ms, server=${stats.serverMs}ms, cache=${stats.cacheMs}ms, save=${stats.saveMs}ms, ` +
                `patches=${stats.patches}, reads=${stats.cacheReads}, updated=${stats.updatedIcons}, deleted=${stats.deletedIcons})`
            );
        } else {
            log(`Friend icon sync finished in ${totalMs}ms (${friendsList.length} friends, ${storageMode} mode; friends=${friendListMs}ms)`);
        }

        if (ElainaData.get("Dev-mode")) log("Friend icons: ", friendIconList);
    }

    /**
     * Download friend icons and upload own icons with hash comparison.
     */
    async syncIconsWithHashCheck(): Promise<void> {
        if (!ElainaData.get("sync-user-icons")) return;

        const summonerID = ElainaData.get("Summoner-ID");
        const token = ElainaData.get("ElainaTheme-Token");

        if (!summonerID || !token) {
            error("Missing summonerID or token, skipping icon sync");
            return;
        }

        // Sync friends icons
        await window.Toast.promise(this.getFriendsIcons(), {
            loading: 'Syncing friends icons...',
            success: 'Sync complete!',
            error: 'Error while syncing friends icons, check console for more info!'
        });

        await this.syncOwnIcons(summonerID);

        // Update avatar on conversations
        const conversationChat = document.querySelectorAll(".conversation.chat");
        for (let i = 0; i < conversationChat.length; i++) {
            customAvatar.changeConversationChatAvatar(conversationChat[i]);
        }
    }

    async main(): Promise<void> {
        await this.syncIconsWithHashCheck();
    }
}

const syncUserIcons = new SyncUserIcons();
window.syncUserIcons = syncUserIcons;

export { friendIconList, syncUserIcons }
