/**
 * Repository scanning logic for AI Repository Packer
 */

const fs = require('fs-extra');
const path = require('path');
const fg = require('fast-glob');
const ignore = require('ignore');

/**
 * Scan a repository for files
 * @param {string} repoPath - Path to the repository
 * @param {Object} options - Scanning options
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Object} Scan result with files and directory structure
 */
async function scanRepository(repoPath, options, progressCallback = null) {
  if (progressCallback) {
    progressCallback({
      status: 'scanning',
      progress: 0,
      message: 'Scanning repository...',
      details: 'Checking for .gitignore patterns'
    });
  }

  // Check for .gitignore file
  let ig = ignore();
  const gitignorePath = path.join(repoPath, '.gitignore');
  
  if (await fs.pathExists(gitignorePath)) {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    ig = ignore().add(gitignoreContent);
  }
  
  // Add common patterns to ignore
  ig.add([
    'node_modules',
    '.git',
    'dist',
    'build',
    '*.log',
    '*.lock'
  ]);
  
  // Add user-defined patterns to ignore
  if (options.excludePatterns && options.excludePatterns.length > 0) {
    ig.add(options.excludePatterns);
  }

  if (progressCallback) {
    progressCallback({
      status: 'scanning',
      progress: 10,
      message: 'Scanning repository...',
      details: 'Finding all files'
    });
  }

  // Get all files in the repository using fast-glob
  const files = await fg('**/*', {
    cwd: repoPath,
    dot: true,
    onlyFiles: true,
    absolute: true
  });

  if (progressCallback) {
    progressCallback({
      status: 'scanning',
      progress: 20,
      message: 'Scanning repository...',
      details: `Found ${files.length} files, filtering...`
    });
  }

  // Filter files based on ignore patterns and max size
  const filteredFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const relativePath = path.relative(repoPath, file);
    
    // Skip if file matches ignore patterns
    if (ig.ignores(relativePath)) {
      continue;
    }
    
    // Get file stats
    const stats = await fs.lstat(file);
    
    // Skip if file is too large
    if (options.maxFileSize && stats.size > options.maxFileSize * 1024 * 1024) {
      continue;
    }
    
    filteredFiles.push({
      path: file,
      relativePath,
      size: stats.size,
      extension: path.extname(file).toLowerCase()
    });

    // Update progress periodically
    if (progressCallback && i % 50 === 0) {
      progressCallback({
        status: 'scanning',
        progress: 20 + Math.floor(10 * (i / files.length)),
        message: 'Filtering files...',
        details: `Processed ${i}/${files.length} files`
      });
    }
  }

  // Generate directory structure
  if (progressCallback) {
    progressCallback({
      status: 'scanning',
      progress: 25,
      message: 'Generating directory structure...',
      details: 'Mapping repository structure'
    });
  }
  
  const directoryStructure = await generateDirectoryStructure(repoPath);
  
  // Group files by type for statistics
  const fileStats = getFileStatistics(filteredFiles);

  if (progressCallback) {
    progressCallback({
      status: 'scanning',
      progress: 30,
      message: 'Repository scan complete',
      details: `Found ${filteredFiles.length} files to process`
    });
  }

  return {
    files: filteredFiles,
    stats: fileStats,
    directoryStructure
  };
}

/**
 * Get statistics about the files in the repository
 * @param {Array} files - List of files
 * @returns {Object} File statistics
 */
function getFileStatistics(files) {
  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, file) => sum + file.size, 0),
    byExtension: {},
    largestFiles: [...files].sort((a, b) => b.size - a.size).slice(0, 10)
  };

  // Count files by extension
  files.forEach(file => {
    const ext = file.extension || 'no-extension';
    if (!stats.byExtension[ext]) {
      stats.byExtension[ext] = {
        count: 0,
        size: 0
      };
    }
    stats.byExtension[ext].count++;
    stats.byExtension[ext].size += file.size;
  });

  return stats;
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a directory structure representation of the repository
 * @param {string} rootPath - Path to the repository root
 * @returns {Array} Directory structure as a nested array
 */
async function generateDirectoryStructure(rootPath) {
  try {
    const structure = [];
    const rootName = path.basename(rootPath);
    
    // Helper function to recursively build directory structure
    async function buildStructure(dirPath, parentPath = '') {
      const relativePath = path.join(parentPath, path.basename(dirPath));
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      const result = {
        name: path.basename(dirPath),
        path: relativePath,
        type: 'directory',
        children: []
      };
      
      // Sort items: directories first, then files
      const sortedItems = items.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });
      
      for (const item of sortedItems) {
        const itemPath = path.join(dirPath, item.name);
        
        // Skip node_modules, .git, and other common directories to ignore
        if (item.isDirectory() && 
            (item.name === 'node_modules' || 
             item.name === '.git' || 
             item.name === 'dist' || 
             item.name === 'build')) {
          continue;
        }
        
        if (item.isDirectory()) {
          const childStructure = await buildStructure(itemPath, relativePath);
          result.children.push(childStructure);
        } else {
          result.children.push({
            name: item.name,
            path: path.join(relativePath, item.name),
            type: 'file'
          });
        }
      }
      
      return result;
    }
    
    // Start building from root
    const rootStructure = await buildStructure(rootPath);
    return rootStructure;
  } catch (error) {
    console.error('Error generating directory structure:', error);
    return { name: path.basename(rootPath), type: 'directory', children: [] };
  }
}

module.exports = {
  scanRepository,
  getFileStatistics,
  formatBytes,
  generateDirectoryStructure
};
