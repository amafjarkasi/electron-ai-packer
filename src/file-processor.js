/**
 * File processing utilities for AI Repository Packer
 */

const fs = require('fs-extra');
const path = require('path');
const { encode } = require('gpt-3-encoder'); // Add this dependency for token counting

/**
 * Process a list of files and generate output
 * @param {Array} files - List of files to process
 * @param {Object} options - Processing options
 * @param {Function} progressCallback - Callback for progress updates
 * @returns {Object} Processed output
 */
async function processFiles(files, options, progressCallback = null) {
  const output = {
    metadata: {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      timestamp: new Date().toISOString(),
      repositoryName: options.repositoryName || path.basename(options.repoPath || ''),
      repositoryPath: options.repoPath || '',
      processingOptions: {
        removeComments: options.removeComments || false,
        removeEmptyLines: options.removeEmptyLines || false,
        securityCheck: options.securityCheck || false,
        maxFileSize: options.maxFileSize || 1
      },
      customHeader: options.customHeader || '',
      metrics: {
        totalTokens: 0,
        totalChars: 0,
        fileTokenCounts: {},
        fileCharCounts: {}
      }
    },
    directoryStructure: options.directoryStructure || [],
    files: []
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Update progress
      if (progressCallback) {
        progressCallback({
          status: 'processing',
          progress: 30 + Math.floor(50 * (i / files.length)),
          message: `Processing file ${i + 1}/${files.length}`,
          details: file.relativePath
        });
      }

      // Check if file should be processed based on extension
      if (shouldSkipFile(file.extension, options)) {
        output.files.push({
          path: file.relativePath,
          size: file.size,
          extension: file.extension,
          content: `[Skipped: ${file.extension} file]`
        });
        continue;
      }

      // Read file content
      let content = await readFileContent(file.path, options);
      
      // Process content based on options
      if (options.removeComments) {
        content = removeComments(content, file.extension);
      }
      
      if (options.removeEmptyLines) {
        content = removeEmptyLines(content);
      }
      
      if (options.securityCheck) {
        content = performSecurityCheck(content, file.extension);
      }
      
      // Count tokens and characters
      const tokenCount = countTokens(content);
      const charCount = content.length;
      
      // Update metrics
      output.metadata.metrics.totalTokens += tokenCount;
      output.metadata.metrics.totalChars += charCount;
      output.metadata.metrics.fileTokenCounts[file.relativePath] = tokenCount;
      output.metadata.metrics.fileCharCounts[file.relativePath] = charCount;
      
      output.files.push({
        path: file.relativePath,
        size: file.size,
        extension: file.extension,
        content,
        tokenCount,
        charCount
      });
    } catch (error) {
      console.warn(`Error reading file ${file.path}: ${error.message}`);
      // For binary files or files that can't be read as UTF-8
      output.files.push({
        path: file.relativePath,
        size: file.size,
        extension: file.extension,
        content: `[Binary file or encoding error: ${error.message}]`
      });
    }
  }

  return output;
}

/**
 * Read file content with appropriate handling based on file type
 * @param {string} filePath - Path to the file
 * @param {Object} options - Processing options
 * @returns {string} File content
 */
async function readFileContent(filePath, options) {
  const extension = path.extname(filePath).toLowerCase();
  
  // Check if file is likely binary
  if (isBinaryExtension(extension)) {
    return `[Binary file: ${path.basename(filePath)}]`;
  }
  
  // Read file content
  const content = await fs.readFile(filePath, 'utf8');
  
  // Check for null bytes which indicate binary content
  if (content.includes('\0')) {
    return `[Binary content detected in file: ${path.basename(filePath)}]`;
  }
  
  return content;
}

/**
 * Check if file should be skipped based on extension
 * @param {string} extension - File extension
 * @param {Object} options - Processing options
 * @returns {boolean} Whether to skip the file
 */
function shouldSkipFile(extension, options) {
  // Skip binary files if specified in options
  if (options.skipBinary && isBinaryExtension(extension)) {
    return true;
  }
  
  // Skip files with specific extensions if specified in options
  if (options.skipExtensions && options.skipExtensions.includes(extension)) {
    return true;
  }
  
  return false;
}

/**
 * Check if file extension is likely binary
 * @param {string} extension - File extension
 * @returns {boolean} Whether the extension is likely binary
 */
function isBinaryExtension(extension) {
  const binaryExtensions = [
    // Images
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.webp', '.tiff', '.svg',
    // Audio
    '.mp3', '.wav', '.ogg', '.flac', '.aac',
    // Video
    '.mp4', '.webm', '.avi', '.mov', '.wmv', '.flv', '.mkv',
    // Archives
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
    // Documents
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    // Executables
    '.exe', '.dll', '.so', '.dylib',
    // Other
    '.ttf', '.otf', '.woff', '.woff2', '.eot',
    '.pyc', '.class', '.o', '.obj',
    '.db', '.sqlite', '.mdb'
  ];
  
  return binaryExtensions.includes(extension);
}

/**
 * Truncate file content if it's too large
 * @param {string} content - File content
 * @param {number} maxSize - Maximum size in characters
 * @returns {string} Truncated content
 */
function truncateContent(content, maxSize = 100000) {
  if (content.length <= maxSize) {
    return content;
  }
  
  const halfSize = Math.floor(maxSize / 2);
  return content.substring(0, halfSize) + 
    `\n\n... [Content truncated, ${content.length - maxSize} characters omitted] ...\n\n` +
    content.substring(content.length - halfSize);
}

/**
 * Remove comments from code based on file extension
 * @param {string} content - File content
 * @param {string} extension - File extension
 * @returns {string} Content with comments removed
 */
function removeComments(content, extension) {
  // Skip if content is empty or already marked as binary/skipped
  if (!content || content.startsWith('[Binary') || content.startsWith('[Skipped')) {
    return content;
  }

  try {
    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
      case '.java':
      case '.c':
      case '.cpp':
      case '.cs':
      case '.go':
      case '.swift':
      case '.kt':
      case '.php':
        // Remove single line comments
        content = content.replace(/\/\/.*$/gm, '');
        // Remove multi-line comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      
      case '.py':
      case '.rb':
        // Remove single line comments
        content = content.replace(/#.*$/gm, '');
        // Remove multi-line docstrings (Python)
        content = content.replace(/'''[\s\S]*?'''/g, '');
        content = content.replace(/"""[\s\S]*?"""/g, '');
        break;
      
      case '.html':
      case '.xml':
      case '.svg':
        // Remove HTML comments
        content = content.replace(/<!--[\s\S]*?-->/g, '');
        break;
      
      case '.css':
      case '.scss':
      case '.less':
        // Remove CSS comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      
      case '.sql':
        // Remove SQL single line comments
        content = content.replace(/--.*$/gm, '');
        // Remove SQL multi-line comments
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        break;
      
      case '.sh':
      case '.bash':
        // Remove shell script comments
        content = content.replace(/#.*$/gm, '');
        break;
      
      // Add more file types as needed
    }
    
    return content;
  } catch (error) {
    console.warn(`Error removing comments: ${error.message}`);
    return content;
  }
}

/**
 * Remove empty lines from content
 * @param {string} content - File content
 * @returns {string} Content with empty lines removed
 */
function removeEmptyLines(content) {
  // Skip if content is empty or already marked as binary/skipped
  if (!content || content.startsWith('[Binary') || content.startsWith('[Skipped')) {
    return content;
  }

  try {
    // Replace multiple empty lines with a single empty line
    content = content.replace(/\n\s*\n/g, '\n');
    // Remove leading and trailing empty lines
    content = content.replace(/^\s*\n/, '').replace(/\n\s*$/, '');
    
    return content;
  } catch (error) {
    console.warn(`Error removing empty lines: ${error.message}`);
    return content;
  }
}

/**
 * Perform security check on content to identify and handle sensitive information
 * @param {string} content - File content
 * @param {string} extension - File extension
 * @returns {string} Content with sensitive information handled
 */
function performSecurityCheck(content, extension) {
  // Skip if content is empty or already marked as binary/skipped
  if (!content || content.startsWith('[Binary') || content.startsWith('[Skipped')) {
    return content;
  }

  try {
    // Check for potential API keys and tokens
    content = content.replace(
      /(api[_-]?key|api[_-]?token|access[_-]?token|secret[_-]?key|password|passwd|credentials)['":\s]*['"]([a-zA-Z0-9_\-\.]{20,})['"]/gi,
      '$1: "[REDACTED]"'
    );
    
    // Check for potential AWS keys
    content = content.replace(
      /(AKIA[0-9A-Z]{16})/g,
      '[REDACTED_AWS_KEY]'
    );
    
    // Check for potential private keys
    if (content.includes('-----BEGIN PRIVATE KEY-----') || 
        content.includes('-----BEGIN RSA PRIVATE KEY-----') ||
        content.includes('-----BEGIN DSA PRIVATE KEY-----') ||
        content.includes('-----BEGIN EC PRIVATE KEY-----')) {
      content = '[REDACTED: File contains private key]';
    }
    
    // Check for potential IP addresses
    content = content.replace(
      /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
      '[REDACTED_IP]'
    );
    
    return content;
  } catch (error) {
    console.warn(`Error performing security check: ${error.message}`);
    return content;
  }
}

/**
 * Count tokens in a string using GPT-3 tokenizer
 * @param {string} text - Text to count tokens for
 * @returns {number} Number of tokens
 */
function countTokens(text) {
  if (!text || text.startsWith('[Binary') || text.startsWith('[Skipped')) {
    return 0;
  }
  
  try {
    const tokens = encode(text);
    return tokens.length;
  } catch (error) {
    console.warn(`Error counting tokens: ${error.message}`);
    return 0;
  }
}

module.exports = {
  processFiles,
  readFileContent,
  shouldSkipFile,
  isBinaryExtension,
  truncateContent,
  removeComments,
  removeEmptyLines,
  performSecurityCheck,
  countTokens
};
