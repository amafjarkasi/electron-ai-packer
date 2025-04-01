const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI',
  {
    // Repository operations
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    processRepository: (repoPath, options) => ipcRenderer.invoke('process-repository', repoPath, options),
    saveOutput: (content) => ipcRenderer.invoke('save-output', content),
    getBasicStats: (dirPath) => ipcRenderer.invoke('get-basic-stats', dirPath),

    // Progress updates
    onProgressUpdate: (callback) => {
      ipcRenderer.on('progress-update', (event, data) => callback(data));
    },

    // Clipboard operations
    copyToClipboard: (text) => {
      return navigator.clipboard.writeText(text)
        .then(() => true)
        .catch((error) => {
          console.error('Failed to copy text:', error);
          return false;
        });
    }
  }
);
