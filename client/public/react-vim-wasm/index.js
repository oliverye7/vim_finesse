import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { VimWasm } from 'vim-wasm';
export { checkBrowserCompatibility as checkVimWasmIsAvailable } from 'vim-wasm';
export function useVim({ worker, drawer, debug, perf, clipboard, onVimExit, onVimInit, onFileExport, readClipboard, onWriteClipboard, onError, onTitleUpdate, files, fetchFiles, dirs, persistentDirs, cmdArgs, onVimCreated, }) {
    const canvas = useRef(null);
    const input = useRef(null);
    const [vim, setVim] = useState(null);
    useEffect(() => {
        // componentDidMount
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const opts = drawer !== undefined
            ? {
                workerScriptPath: worker,
                screen: drawer,
            }
            : {
                workerScriptPath: worker,
                canvas: canvas.current,
                input: input.current,
            };
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        const v = new VimWasm(opts);
        v.onVimInit = onVimInit;
        v.onVimExit = onVimExit;
        v.onFileExport = onFileExport;
        v.readClipboard = readClipboard;
        v.onWriteClipboard = onWriteClipboard;
        v.onTitleUpdate = onTitleUpdate;
        v.onError = onError;
        if (canvas.current !== null) {
            canvas.current.addEventListener('dragover', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.dataTransfer) {
                    e.dataTransfer.dropEffect = 'copy';
                }
            }, false);
            canvas.current.addEventListener('drop', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (e.dataTransfer) {
                    v.dropFiles(e.dataTransfer.files).catch(onError);
                }
            }, false);
        }
        if (onVimCreated !== undefined) {
            onVimCreated(v);
        }
        v.start({ debug, perf, clipboard, files, fetchFiles, dirs, persistentDirs, cmdArgs });
        setVim(v);
        return () => {
            // componentWillUnmount
            if (v.isRunning()) {
                v.cmdline('qall!');
            }
        };
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [worker, debug, perf, clipboard, files, dirs, persistentDirs, cmdArgs]);
    // Note: Vim worker should be started once at componentDidMount
    // `worker`, `debug`, `perf` and `clipboard` are startup configuration. So when they are changed,
    // new Vim instance must be created with the new configuration.
    /* eslint-enable react-hooks/exhaustive-deps */
    if (drawer !== undefined) {
        return [null, null, vim];
    }
    return [canvas, input, vim];
}
const INPUT_STYLE = {
    width: '1px',
    color: 'transparent',
    backgroundColor: 'transparent',
    padding: '0px',
    border: '0px',
    outline: 'none',
    position: 'relative',
    top: '0px',
    left: '0px',
};
export const Vim = props => {
    const [canvasRef, inputRef, vim] = useVim(props);
    if (canvasRef === null || inputRef === null) {
        // When drawer prop is set, it has responsibility to render screen.
        // This component does not render screen and handle inputs.
        return null;
    }
    const { style, className, id, onVimExit, onVimInit, onFileExport, onWriteClipboard, onError, readClipboard, } = props;
    if (vim !== null) {
        vim.onVimExit = onVimExit;
        vim.onVimInit = onVimInit;
        vim.onFileExport = onFileExport;
        vim.onWriteClipboard = onWriteClipboard;
        vim.onError = onError;
        vim.readClipboard = readClipboard;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("canvas", { ref: canvasRef, style: style, className: className, id: id }),
        React.createElement("input", { ref: inputRef, style: INPUT_STYLE, autoComplete: "off", autoFocus: true })));
};
//# sourceMappingURL=index.js.map