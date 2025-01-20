const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      // Habilita content scripts y permisos para file://
      allowRunningInsecureContent: false,
      // Deshabilita el aislamiento de origen si es necesario
      webviewTag: false,
    }
  });

  // Registra el protocolo file: para manejar assets locales
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(8);
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Asegúrate de que la ruta sea relativa al directorio actual
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    console.log('Loading from:', indexPath);
    win.loadFile(indexPath);
  }

  // Abre DevTools para debug
  win.webContents.openDevTools();
}

// Configuración adicional para el manejo de protocolos
app.whenReady().then(() => {
  createWindow();

  // Registra el protocolo personalizado si es necesario
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6);
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});