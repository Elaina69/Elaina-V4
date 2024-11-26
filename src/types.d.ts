// internal types
declare module 'https://elainatheme.xyz/index.js';

declare module 'https://cdn.skypack.dev/axios';

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
    write: (path: string, content: string, enableAppendMode: boolean) => Promise<boolean>
    mkdir: (path: string) => Promise<boolean>
    stat: (path: string) => Promise<FileStat | undefined>
    ls: (path: string) => Promise<string[] | undefined>
    rm: (path: string, recursively: boolean) => Promise<number>
}
  
// globals

declare interface Window {
    DataStore: DataStore;
    CommandBar: CommandBar;
    Toast: Toast;
    Effect: Effect;
    PluginFS: PluginFS
  
    Pengu: {
        version: string
        superPotato: boolean
        plugins: string[]
        isMac: boolean
        fs: PluginFS
    };
  
    os: {
        name: 'win' | 'mac'
        version: string
        build: string
    };
  
    openDevTools                : () => void;
    openPluginsFolder           : (subdir?: string) => void;
    reloadClient                : () => void;
    restartClient               : () => void;
    getScriptPath               : () => string | undefined;
    getThemeName                : () => void;
    cdnImport                   : (url: string, errorMsg: any) => Promise<any>;
    autoAcceptQueueButtonSelect : () => void;
    del_webm_buttons            : () => void;
    create_webm_buttons         : () => void;
    applyHideAndShowtab         : () => void;
    applyHideAndShowTFTtab      : () => void;
    exitClient                  : () => void;
    dodgeQueue                  : () => void;
    switch_between_status       : () => void;
    log                         : (message: string, ...args: string[]) => void;
    warn                        : (message: string, ...args: string[]) => void;
    error                       : (message: string, ...args: string[]) => void;
    setAudio                    : () => void;
    
    storeObserver               : any;
    __llver                     : string;
}

declare function getString(param: string)   : Promise<string>;
declare function writeBackupData()          : void;