const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  console.log('Creating window...');
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Only for debugging, remove in production
    }
  });

  // In development, load from the dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Loading from dev server:', process.env.VITE_DEV_SERVER_URL);
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const htmlPath = path.join(__dirname, 'dist', 'index.html');
    console.log('Loading from file:', htmlPath);
    win.loadFile(htmlPath);
  }

  // Always open DevTools for debugging
  win.webContents.openDevTools();

  // Debug events
  win.webContents.on('did-start-loading', () => {
    console.log('Started loading content');
  });

  win.webContents.on('did-finish-loading', () => {
    console.log('Finished loading content');
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  win.webContents.on('dom-ready', () => {
    console.log('DOM is ready');
    console.log('Window URL:', win.webContents.getURL());
    
    // Log the content of the body
    win.webContents.executeJavaScript(`
      console.log('Body content:', document.body.innerHTML);
      console.log('Root element:', document.getElementById('root'));
    `);
  });

  win.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer Console:', message);
  });

  // Additional window state logging
  win.on('ready-to-show', () => {
    console.log('Window ready to show');
  });

  win.on('show', () => {
    console.log('Window shown');
  });
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();

  app.on('activate', () => {
    console.log('App activated');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});