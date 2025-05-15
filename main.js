const { app, BrowserWindow } = require('electron');
const path = require('path');


let mainWindow;

function createWindow() {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true, 
      enableRemoteModule: false, 
      nodeIntegration: false, 
    },
  });

 
  win.loadURL('http://localhost:3000');


  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }


  win.on('closed', () => {
    mainWindow = null;
  });

  return win;
}


app.whenReady().then(() => {
  mainWindow = createWindow();


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('error', (error) => {
  console.error('Erro na aplicação:', error);
});