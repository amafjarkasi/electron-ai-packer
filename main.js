const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

// Import custom modules
const repoScanner = require('./src/repo-scanner');
const fileProcessor = require('./src/file-processor');
const formatter = require('./src/formatter');

// Enable hot reload in development
try {
  if (process.env.NODE_ENV !== 'production') {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  }
} catch (err) {
  console.error('Error enabling hot reload:', err);
}

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    height: 700, // Increased height
    width: 1200,
    autoHideMenuBar: true, // Hide menu bar but keep window frame
    icon: path.join(__dirname, 'src', 'app-icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for communication with renderer process

// Handle repository folder selection
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths[0];
});

// Get basic stats about the repository
ipcMain.handle('get-basic-stats', async (event, dirPath) => {
  try {
    let fileCount = 0;
    let totalSize = 0;

    // Recursively get all files
    const getFiles = async (dir) => {
      const items = await fs.readdir(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await getFiles(fullPath);
        } else {
          fileCount++;
          totalSize += stat.size;
        }
      }
    };

    await getFiles(dirPath);
    return { fileCount, totalSize };
  } catch (error) {
    console.error('Error getting basic stats:', error);
    throw error;
  }
});

// Process repository and generate output
ipcMain.handle('process-repository', async (event, options) => {
  const repoPath = options.repoPath;
  try {
    // Progress update callback
    const progressCallback = (data) => {
      mainWindow.webContents.send('progress-update', data);
    };

    // Send initial progress update
    progressCallback({
      status: 'scanning',
      progress: 0,
      message: 'Scanning repository...'
    });

    // Get all files in the repository
    const scanResult = await repoScanner.scanRepository(repoPath, options, progressCallback);

    // Send progress update
    progressCallback({
      status: 'processing',
      progress: 30,
      message: 'Reading file contents...'
    });

    // Add directory structure to options
    options.directoryStructure = scanResult.directoryStructure;

    // Process files and generate output
    const output = await fileProcessor.processFiles(scanResult.files, options, progressCallback);

    // Send progress update
    progressCallback({
      status: 'formatting',
      progress: 80,
      message: 'Formatting output...'
    });

    // Format output based on selected LLM
    const formattedOutput = formatter.formatOutput(output, options.llmTarget);

    // Send completion update
    progressCallback({
      status: 'complete',
      progress: 100,
      message: 'Processing complete!'
    });

    return formattedOutput;
  } catch (error) {
    console.error('Error processing repository:', error);
    mainWindow.webContents.send('progress-update', {
      status: 'error',
      progress: 0,
      message: `Error: ${error.message}`
    });
    throw error;
  }
});

// Save output to file

// Listen for content height from renderer
ipcMain.on('send-content-height', (event, height) => {
  if (mainWindow) {
    mainWindow.setSize(mainWindow.getBounds().width, height);
  }
});
ipcMain.handle('save-output', async (event, content) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format timestamp
  const repoName = content.match(/Repository: (.+)/)?.[1] || 'repository'; // Extract repository name from content
  const defaultFilename = `${repoName}-packed-${timestamp}.txt`;

  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save Packed Repository',
    defaultPath: defaultFilename,
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) {
    return { success: false };
  }

  try {
    await fs.writeFile(result.filePath, content, 'utf8');
    return { success: true, filePath: result.filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
});
