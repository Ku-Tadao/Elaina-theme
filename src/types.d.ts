interface Plugin {
    init?: (context: any) => any
    load?: () => any
    default?: Function | any
}

interface RcpAnnouceEvent extends CustomEvent {
    errorHandler: () => any
    registrationHandler: (registrar: (e) => Promise<any>) => Promise<any> | void
}

// built-in types
interface Action {
    id?: string
    name: string | (() => string)
    legend?: string | (() => string)
    tags?: string[]
    icon?: string
    group?: string | (() => string)
    hidden?: boolean
    perform?: (id?: string) => any
}

interface CommandBar {
    addAction: (action: Action) => void
    show: () => void
    update: () => void
}

interface Toast {
    success: (message: string) => void
    error: (message: string) => void
    promise: <T>(
        promise: Promise<T>,
        msg: { loading: string, success: string, error: string }
    ) => Promise<T>
}

interface DataStore {
    has: (key: string) => boolean
    get: <T>(key: string, fallback?: T) => T | any
    set: (key: string, value: any) => boolean
    remove: (key: string) => boolean
}

interface ApplyEffectFn {
    (type: 'transparent' | 'blurbehind' | 'acrylic' | 'unified', options?: { color: string }): void
    (type: 'mica', options?: { material?: 'auto' | 'mica' | 'acrylic' | 'tabbed' }): void
    (type: 'vibrancy', options: { material: string, alwaysOn?: boolean }): void
}

interface Effect {
    apply: ApplyEffectFn
    clear: () => void
    setTheme: (theme: 'light' | 'dark') => void
}

interface FileStat {
    fileName: string
    length: number
    isDir: boolean
}

interface PluginFS {
    read: (path: string) => Promise<string | undefined>
    write: (path: string, content: string, options?: { append?: boolean }) => Promise<boolean>
    mkdir: (path: string) => Promise<boolean>
    stat: (path: string) => Promise<FileStat | undefined>
    ls: (path: string) => Promise<string[] | undefined>
    rm: (path: string, options?: { recursive?: boolean }) => Promise<number>
}

interface elainaData {
    init: (context: any) => Promise<void>;
    get: (key: string, fallback?: any) => any;
    set: (key: string, value: any) => boolean;
    has: (key: string) => boolean;
    remove: (key: string) => boolean;
    restoreDefaults: () => void;
    getAll: () => Record<string, any>;
    setAll: (data: Record<string, any>) => void;
    getStorageMode: () => 'fs' | 'datastore';
    flush: () => Promise<void>;
}

interface elainathemeApi {
    login: (userId: number, username: string) => Promise<{ token: string }>;
    writeBackup: (token: string, userId: number, data: Object) => Promise<void>;
    readBackup: (token: string, userId: number) => Promise<void>;
    deleteBackup: (token: string, userId: number) => Promise<void>;
    uploadImage: (token: string, userId: number, type: string, file: File) => Promise<void>;
    getImage: (userId: number, type: string) => Promise<string>;
    getImageHash: (userId: number, type: string) => Promise<string | null>;
    deleteImage: (token: string, userId: number, type: string) => Promise<void>;
    getFriendsImage: (friendList: { summonerId: number, puuid: string }[]) => Promise<{ summonerID: number, puuid: string, icon: { avatar: string, border: string, banner: string, emblem: string, hoverCardBackdrop: string } }[]>;
}

interface syncUserIcons {
    uploadIcon: (icon: string, iconType: string) => Promise<void>
    getIcon: (summonerID: number, iconType: string) => Promise<string | null>
    getIconFolder: () => string
    getIconData: () => Record<string, string>
    getFriendsIcons: () => Promise<void>
    main: () => Promise<void>
}

// globals
declare interface Window {
    DataStore: DataStore;
    CommandBar: CommandBar;
    Toast: Toast;
    Effect: Effect;
    PluginFS: PluginFS;
    Pengu: {
        version: string;
        superPotato: boolean;
        plugins: string[];
        isMac: boolean;
        fs: PluginFS;
    };
    os: {
        name: 'win' | 'mac';
        version: string;
        build: string;
    };

    upl: any;
    openDevTools: () => void;
    openPluginsFolder: (subdir?: string) => void;
    reloadClient: () => void;
    restartClient: () => void;
    getScriptPath: () => string | undefined;
    storeObserver: any;
    __llver: string;

    ElainaData: elainaData;
    elainathemeApi: elainathemeApi;
    syncUserIcons: syncUserIcons;
    getThemeName: () => string | null;
    cdnImport: (url: string, errorMsg: any) => Promise<any>;
    log: (message: string, ...args: string[]) => void;
    warn: (message: string, ...args: string[]) => void;
    error: (message: string, ...args: string[]) => void;
    switch_between_status: () => void;
    autoAcceptQueueButtonSelect: () => void;
    exitClient: () => void;
    dodgeQueue: () => void;
    friendIconList: any;
    customRank: () => void;
    refreshLists: () => Promise<void>;
    isContextFSExist: boolean;
};

declare function getString(param: string): Promise<string>;
declare function writeBackupData(): void;
declare const ElainaData: elainaData;
declare const Pengu: Window['Pengu'];
