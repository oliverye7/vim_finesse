var _a;
import { VimWasm, checkBrowserCompatibility, VIM_VERSION } from "./vimwasm.js";
const queryParams = new URLSearchParams(window.location.search);
const debugging = queryParams.has("debug");
const perf = queryParams.has("perf");
const feature =
  ((_a = queryParams.get("feature")),
  _a !== null && _a !== void 0 ? _a : "normal");
const clipboardAvailable = navigator.clipboard !== undefined;
const dirs = queryParams.getAll("dir");
const cmdArgs = queryParams.getAll("arg");
if (cmdArgs.length === 0 && feature === "normal") {
  cmdArgs.push("/home/web_user/tryit.js");
}
const fetchFiles = (function () {
  const ret = {};
  for (const mapping of queryParams.getAll("file")) {
    const i = mapping.indexOf("=");
    if (i <= 0) {
      continue;
    }
    const path = mapping.slice(0, i);
    const remote = mapping.slice(i + 1);
    ret[path] = remote;
  }
  return ret;
})();
let vimIsRunning = false;

function fatal(err) {
  if (typeof err === "string") {
    err = new Error(err);
  }
  alert("FATAL: " + err.message);
  throw err;
}
{
  const compatMessage = checkBrowserCompatibility();
  if (compatMessage !== undefined) {
    fatal(compatMessage);
  }
}
const screenCanvasElement = document.getElementById("vim-screen");
const workerScriptPath =
  feature === "normal" ? "./vim.js" : `./${feature}/vim.js`;
const vim = new VimWasm({
  canvas: screenCanvasElement,
  input: document.getElementById("vim-input"),
  workerScriptPath: workerScriptPath,
});
screenCanvasElement.addEventListener(
  "dragover",
  (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  },
  false
);
screenCanvasElement.addEventListener(
  "drop",
  (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer === null) {
      return;
    }
    vim.dropFiles(e.dataTransfer.files).catch(fatal);
  },
  false
);
vim.onVimInit = () => {
  vimIsRunning = true;
};
if (!perf) {
  vim.onVimExit = (status) => {
    vimIsRunning = false;
    alert(`Vim exited with status ${status}`);
  };
}
if (!perf && !debugging) {
  window.addEventListener("beforeunload", (e) => {
    if (vimIsRunning) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}
vim.onFileExport = (fullpath, contents) => {
  const slashIdx = fullpath.lastIndexOf("/");
  const filename = slashIdx !== -1 ? fullpath.slice(slashIdx + 1) : fullpath;
  const blob = new Blob([contents], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.rel = "noopener";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function clipboardSupported() {
  if (clipboardAvailable) {
    return undefined;
  }
  alert(
    "Clipboard API is not supported by this browser. Clipboard register is not available"
  );
  return Promise.reject();
}
vim.readClipboard = () => {
  var _a;
  return (
    (_a = clipboardSupported()),
    _a !== null && _a !== void 0 ? _a : navigator.clipboard.readText()
  );
};
vim.onWriteClipboard = (text) => {
  var _a;
  return (
    (_a = clipboardSupported()),
    _a !== null && _a !== void 0 ? _a : navigator.clipboard.writeText(text)
  );
};
vim.onTitleUpdate = (title) => {
  document.title = title;
};
vim.onError = fatal;
vim.start({
  debug: debugging,
  perf: perf,
  clipboard: clipboardAvailable,
  persistentDirs: ["/home/web_user/.vim"],
  dirs: dirs,
  fetchFiles: fetchFiles,
  cmdArgs: cmdArgs,
});
if (debugging) {
  window.vim = vim;
  console.log("main: Vim version:", VIM_VERSION);
}

function Pane(props) {
  return <div>Hello from Pane component!</div>;
}

export default Pane;
