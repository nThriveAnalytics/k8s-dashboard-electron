const electron = require('electron');
const path = require('path');
const url = require('url');
const child_process = require('child_process');
let win;
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const kubectl = child_process.execFile(
  'kubectl',
  ['proxy'],
  { windowsHide: false },
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log(stdout);
    console.error(stderr);
  }
);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: false
    },
    icon: './images/k8s.png'
  });
  // and load the index.html of the app.
  win.loadURL(
    'http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/#!/cluster?namespace=_all'
  );

  win.maximize();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  kubectl.kill('SIGTERM');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
