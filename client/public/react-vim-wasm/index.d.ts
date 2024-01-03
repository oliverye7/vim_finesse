import * as React from 'react';
import { VimWasm, ScreenDrawer } from 'vim-wasm';
export { checkBrowserCompatibility as checkVimWasmIsAvailable } from 'vim-wasm';
export interface VimProps {
    worker: string;
    drawer?: ScreenDrawer;
    debug?: boolean;
    perf?: boolean;
    clipboard?: boolean;
    onVimExit?: (status: number) => void;
    onVimInit?: () => void;
    onFileExport?: (fullpath: string, contents: ArrayBuffer) => void;
    readClipboard?: () => Promise<string>;
    onWriteClipboard?: (text: string) => Promise<void>;
    onError?: (err: Error) => void;
    onTitleUpdate?: (title: string) => void;
    files?: {
        [path: string]: string;
    };
    fetchFiles?: {
        [path: string]: string;
    };
    dirs?: string[];
    persistentDirs?: string[];
    cmdArgs?: string[];
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    onVimCreated?: (vim: VimWasm) => void;
}
export declare function useVim({ worker, drawer, debug, perf, clipboard, onVimExit, onVimInit, onFileExport, readClipboard, onWriteClipboard, onError, onTitleUpdate, files, fetchFiles, dirs, persistentDirs, cmdArgs, onVimCreated, }: VimProps): [React.MutableRefObject<HTMLCanvasElement | null> | null, React.MutableRefObject<HTMLInputElement | null> | null, VimWasm | null];
export declare const Vim: React.SFC<VimProps>;
