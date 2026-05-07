import { log, error } from './themeLog';
import { del_webm_buttons, create_webm_buttons } from '../theme/customUI/customHomepage';

export class FileSystem {
    isContextFSExist = true;
    private currentWallpaperList: string[] = [];
    private currentAudioList: string[] = []
    private currentBannerList: string[] = [];
    private currentFontList: string[] = [];

    read = async (context: any, path: string): Promise<string | undefined> => {
        return await context.fs.read(path);
    }

    write = async (context: any, path: string, content: string, enableAppendMode: boolean): Promise<boolean> => {
        return await context.fs.write(path, content, { append: enableAppendMode });
    }

    mkdir = async (context: any, path: string): Promise<boolean> => {
        return await context.fs.mkdir(path);
    }

    stat = async (context: any, path: string): Promise<FileStat | undefined> => {
        return await context.fs.stat(path);
    }

    ls = async (context: any, path: string): Promise<string[] | undefined> => {
        return await context.fs.ls(path);
    }

    init = async (context: any) => {
        if (!context.fs) {
            error('context.fs is missing')
            this.isContextFSExist = false;
            window.refreshLists = async () => { }
            return
        }

        await this.mkdir(context, './data')

        // For debugging purposes only
        const readFile = (path: string) => this.read(context, path);
        // @ts-ignore
        window.elainaReadFile = readFile;

        const writeFile = (path: string, content: string, enableAppendMode: boolean) => this.write(context, path, content, enableAppendMode);
        // @ts-ignore
        window.elainaWriteFile = writeFile;

        const mkdir = (path: string) => this.mkdir(context, path);
        // @ts-ignore
        window.elainaMkdir = mkdir;

        const stat = (path: string) => this.stat(context, path);
        // @ts-ignore
        window.elainaStat = stat;

        const ls = (path: string) => this.ls(context, path);
        // @ts-ignore
        window.elainaLs = ls;

        const globalRefreshLists = () => this.refreshLists(context);
        window.refreshLists = globalRefreshLists;

        window.isContextFSExist = this.isContextFSExist;
    }

    refreshLists = async (context: any) => {
        const wallpaper = await this.ls(context, './assets/backgrounds/wallpapers') ?? [];
        const audio = await this.ls(context, './assets/backgrounds/audio') ?? [];
        const banner = await this.ls(context, './assets/icon/regalia-banners') ?? [];
        const font = await this.ls(context, './assets/fonts') ?? [];

        const FILE_REGEX = {
            Wallpaper: /\.(png|jpg|jpeg|gif|bmp|webp|ico|mp4|webm|mkv|mov|avi|wmv|3gp|m4v)$/,
            Audio: /\.(mp3|flac|ogg|wav|aac)$/,
            Font: /\.(ttf|otf|woff|woff2)$/,
            Banner: /\.(png|jpg|jpeg|gif|bmp|webp|ico)$/,
        };

        const dataLists = {
            Wallpaper: wallpaper,
            Audio: audio,
            Banner: banner,
            Font: font,
        };

        const filteredLists = Object.keys(FILE_REGEX).reduce((acc, key) => {
            acc[key] = dataLists[key].filter(file => FILE_REGEX[key].test(file));
            return acc;
        }, {} as Record<string, string[]>);

        Object.entries(filteredLists).forEach(([key, list]) => {
            const prevList = key === 'Wallpaper' ? this.currentWallpaperList
                : key === 'Audio' ? this.currentAudioList
                    : key === 'Banner' ? this.currentBannerList
                        : key === 'Font' ? this.currentFontList
                            : [];

            if (ElainaData && JSON.stringify(prevList) !== JSON.stringify(list)) {
                log(`List changed for ${key}`);
                ElainaData.set(`${key}-list`, list);
                del_webm_buttons();
                create_webm_buttons();
            }

            if (key === 'Audio') this.currentAudioList = list;
            else if (key === 'Wallpaper') this.currentWallpaperList = list;
            else if (key === 'Banner') this.currentBannerList = list;
            else if (key === 'Font') this.currentFontList = list;
        });
    }
}
