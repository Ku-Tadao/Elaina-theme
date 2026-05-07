import { log, error } from './themeLog';

const DATA_FILE_PATH = './data/ElainaData.json';

/** Mode of storage backend: 'fs' uses context.fs file, 'datastore' uses Pengu DataStore */
type StorageMode = 'fs' | 'datastore';

/** In-memory cache and persistence state for fs mode */
let cache: Record<string, any> = {};
let storageMode: StorageMode = 'datastore';
let fsContext: any = null;
let initPromiseResolve: (() => void) | null = null;

/**
 * A promise that resolves once ElainaData has been fully initialized.
 * Modules that need to guarantee initialization can `await elainaDataReady`.
 */
const elainaDataReady: Promise<void> = new Promise((resolve) => {
    initPromiseResolve = resolve;
});

/**
 * Persist the in-memory cache to ./data/ElainaData.json via context.fs.
 * Writes synchronously (awaited) to guarantee data is saved.
 */
async function persistToFile(): Promise<boolean> {
    if (storageMode !== 'fs' || !fsContext) return false;
    try {
        const json = JSON.stringify(cache, null, 2);
        const success = await fsContext.fs.write(DATA_FILE_PATH, json, false);
        if (!success) {
            error('context.fs.write returned false — data may not be persisted');
        }
        return success;
    } catch (err: any) {
        error('Failed to persist ElainaData to file', err);
        return false;
    }
}

// ---------------------------------------------------------------------------
// DataStore-mode helpers (legacy fallback)
// ---------------------------------------------------------------------------

function datastoreGet(key: string, fallback: any = null): any {
    const data: Record<string, any> = window.DataStore.get("ElainaTheme", {});
    return data.hasOwnProperty(key) ? data[key] : fallback;
}

function datastoreSet(key: string, value: any): boolean {
    const data: Record<string, any> = window.DataStore.get("ElainaTheme", {});
    data[key] = value;
    window.DataStore.set("ElainaTheme", data);
    return data.hasOwnProperty(key);
}

function datastoreHas(key: string): boolean {
    const data: Record<string, any> = window.DataStore.get("ElainaTheme", {});
    return data.hasOwnProperty(key);
}

function datastoreRemove(key: string): boolean {
    const data: Record<string, any> = window.DataStore.get("ElainaTheme", {});
    if (data.hasOwnProperty(key)) {
        delete data[key];
        window.DataStore.set("ElainaTheme", data);
        return true;
    }
    return false;
}

// ---------------------------------------------------------------------------
// ElainaData — unified API
// ---------------------------------------------------------------------------

const ElainaData = {
    /**
     * Initialize ElainaData.
     * If context.fs is available, migrate or load data from ./data/ElainaData.json.
     * Otherwise fall back to Pengu DataStore.
     *
     * **Must be called (and awaited) before any other code uses ElainaData.**
     */
    async init(context: any): Promise<void> {
        // Check if context.fs is available
        if (!context || !context.fs) {
            log('context.fs not available — using DataStore mode');
            storageMode = 'datastore';
            initPromiseResolve?.();
            return;
        }

        fsContext = context;

        try {
            // Ensure ./data/ directory exists
            await context.fs.mkdir('./data');

            // Try to read existing file
            const raw = await context.fs.read(DATA_FILE_PATH);

            if (raw && raw.trim().length > 0) {
                // File exists and has content — parse and use as cache
                try {
                    cache = JSON.parse(raw);
                    log('ElainaData loaded from file (fs mode)');
                } catch (parseErr: any) {
                    error('Failed to parse ElainaData.json, migrating from DataStore', parseErr);
                    // File is corrupted — re-migrate from DataStore
                    cache = { ...window.DataStore.get("ElainaTheme", {}) };
                }
            } else {
                // File does not exist — migrate from DataStore
                const datastoreData: Record<string, any> = window.DataStore.get("ElainaTheme", {});

                if (Object.keys(datastoreData).length > 0) {
                    cache = { ...datastoreData };
                    log('Migrated ElainaData from DataStore to file (fs mode)');
                } else {
                    cache = {};
                    log('Created new ElainaData file (fs mode)');
                }
            }

            // Merge any keys that backupAndRestoreDatastore set into DataStore
            // BEFORE init() was called (top-level await runs first).
            // This ensures defaults and pre-init writes are not lost.
            const currentDatastore: Record<string, any> = window.DataStore.get("ElainaTheme", {});
            let merged = false;
            for (const [key, value] of Object.entries(currentDatastore)) {
                if (!cache.hasOwnProperty(key)) {
                    cache[key] = value;
                    merged = true;
                }
            }
            if (merged) {
                log('Merged missing keys from DataStore into fs cache');
            }

            storageMode = 'fs';

            // Persist immediately to ensure file is up-to-date
            await persistToFile();

        } catch (err: any) {
            error('Failed to init ElainaData in fs mode, falling back to DataStore', err);
            storageMode = 'datastore';
        }

        initPromiseResolve?.();
    },

    /**
     * Gets a value from the datastore.
     * @param key The key to retrieve.
     * @param fallback The fallback value if the key doesn't exist.
     * @returns The value associated with the key or the fallback.
     */
    get(key: string, fallback: any = null): any {
        if (storageMode === 'fs') {
            return cache.hasOwnProperty(key) ? cache[key] : fallback;
        }
        return datastoreGet(key, fallback);
    },

    /**
     * Sets a value in the datastore.
     * In fs mode, updates in-memory cache and persists to file immediately.
     * @param key The key to set.
     * @param value The value to associate with the key.
     * @returns True if the key was set successfully, false otherwise.
     */
    set(key: string, value: any): boolean {
        if (storageMode === 'fs') {
            cache[key] = value;
            // Fire-and-forget but no debounce — persist every write
            persistToFile();
            return true;
        }
        return datastoreSet(key, value);
    },

    /**
     * Checks if a key exists in the datastore.
     * @param key The key to check for existence.
     * @returns True if the key exists, false otherwise.
     */
    has(key: string): boolean {
        if (storageMode === 'fs') {
            return cache.hasOwnProperty(key);
        }
        return datastoreHas(key);
    },

    /**
     * Removes a key from the datastore.
     * @param key The key to remove.
     * @returns True if the key was removed, false otherwise.
     */
    remove(key: string): boolean {
        if (storageMode === 'fs') {
            if (cache.hasOwnProperty(key)) {
                delete cache[key];
                persistToFile();
                return true;
            }
            return false;
        }
        return datastoreRemove(key);
    },

    /**
     * Restores the default values of the theme in the datastore.
     */
    restoreDefaults(): void {
        if (storageMode === 'fs') {
            cache = {};
            // Flush immediately — user is about to reload
            persistToFile();
        } else {
            window.DataStore.set("ElainaTheme", {});
        }
        window.reloadClient();
    },

    /**
     * Returns the full data object (useful for backup/restore).
     */
    getAll(): Record<string, any> {
        if (storageMode === 'fs') {
            return { ...cache };
        }
        return window.DataStore.get("ElainaTheme", {});
    },

    /**
     * Replaces all data at once (useful for restore from backup).
     * @param data The full data object to set.
     */
    setAll(data: Record<string, any>): void {
        if (storageMode === 'fs') {
            cache = { ...data };
            persistToFile();
        } else {
            window.DataStore.set("ElainaTheme", data);
        }
    },

    /** Returns the current storage mode. */
    getStorageMode(): StorageMode {
        return storageMode;
    },

    /** Force an immediate flush of cache to file (fs mode only). */
    async flush(): Promise<void> {
        await persistToFile();
    }
};

window.ElainaData = ElainaData;

export { ElainaData, elainaDataReady };