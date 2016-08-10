const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// storage.js in libs folder
const storage = require('./libs/storage')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let lastWindowState = storage.get('lastWindowState');
if (lastWindowState === null) {
  lastWindowState = {
    width: 400,
    height: 600,
    maximized: false
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width, 
    height: lastWindowState.height,
    // titleBarStyle: 'hidden', 
    backgroundColor: '#fff'
  })

  // if (lastWindowState.maximized) {
  //   mainWindow.maximize();
  // }

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // After mainWindow is created
  mainWindow.on('close', function () {
    var bounds = mainWindow.getBounds(); 
    storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: mainWindow.isMaximized()
    });
  });

}

// Add the Chromium command line switches --disable-renderer-backgrounding
// it basically tells Chromium to not reduce performances 
// (and save CPU cycles) when the window is in background.
app.commandLine.appendSwitch('disable-renderer-backgrounding')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.