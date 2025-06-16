const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
 
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });


  mainWindow.loadURL('http://localhost:3000');


  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }


  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Fecha a aplicação quando todas as janelas são fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
});
