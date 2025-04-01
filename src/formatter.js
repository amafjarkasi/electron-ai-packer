/**
 * Output formatting for different LLMs
 */

/**
 * Format output based on LLM target
 * @param {Object} output - Processed output
 * @param {string} llmTarget - Target LLM
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatOutput(output, llmTarget = 'generic', options = {}) {
  switch (llmTarget.toLowerCase()) {
    case 'claude':
      return formatForClaude(output);
    case 'chatgpt':
      return formatForChatGPT(output);
    case 'perplexity':
      return formatForPerplexity(output);
    case 'gemini':
      return formatForGemini(output);
    default:
      return formatGeneric(output);
  }
}

/**
 * Format output for Claude
 * @param {Object} output - Processed output
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatForClaude(output, options = {}) {
  let formattedOutput = '';
  
  // Add file summary
  formattedOutput += `# Repository Pack for Claude\n\n`;
  formattedOutput += generateFileSummary(output);
  
  // Add token count information
  formattedOutput += `## Token Count Information\n\n`;
  formattedOutput += `Total Tokens: ${output.metadata.metrics.totalTokens.toLocaleString()}\n`;
  formattedOutput += `Total Characters: ${output.metadata.metrics.totalChars.toLocaleString()}\n\n`;
  
  // Add custom header if provided
  if (output.metadata.customHeader) {
    formattedOutput += `## Repository Description\n\n${output.metadata.customHeader}\n\n`;
  }
  
  // Add repository instructions if provided
  if (options.repositoryInstructions) {
    formattedOutput += `## Repository Instructions\n\n${options.repositoryInstructions}\n\n`;
  }
  
  // Add directory structure
  if (output.directoryStructure) {
    formattedOutput += `## Directory Structure\n\n`;
    formattedOutput += formatDirectoryStructure(output.directoryStructure);
    formattedOutput += `\n`;
  }
  
  // Add table of contents
  formattedOutput += `## Table of Contents\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `${i + 1}. \`${file.path}\` (${formatBytes(file.size)})\n`;
  }
  
  // Add file contents
  formattedOutput += `\n## Files\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `### ${i + 1}. \`${file.path}\`\n\n`;
    formattedOutput += `Size: ${formatBytes(file.size)}\n\n`;
    
    // Format code with triple backticks and language
    const language = getLanguageFromExtension(file.extension);
    formattedOutput += `\`\`\`${language}\n${file.content}\n\`\`\`\n\n`;
  }
  
  // Add footer with instructions for Claude
  formattedOutput += `---\n\n`;
  formattedOutput += `# Instructions for Claude\n\n`;
  formattedOutput += `This repository pack contains the complete codebase. You can reference files by their path or number from the table of contents.\n`;
  formattedOutput += `When discussing code, please cite the relevant file paths to maintain context.\n`;
  
  return formattedOutput;
}

/**
 * Format output for ChatGPT
 * @param {Object} output - Processed output
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatForChatGPT(output, options = {}) {
  let formattedOutput = '';
  
  // Add file summary
  formattedOutput += `# Repository Pack for ChatGPT\n\n`;
  formattedOutput += generateFileSummary(output);
  
  // Add token count information
  formattedOutput += `## Token Count Information\n\n`;
  formattedOutput += `Total Tokens: ${output.metadata.metrics.totalTokens.toLocaleString()}\n`;
  formattedOutput += `Total Characters: ${output.metadata.metrics.totalChars.toLocaleString()}\n\n`;
  
  // Add custom header if provided
  if (output.metadata.customHeader) {
    formattedOutput += `## Repository Description\n\n${output.metadata.customHeader}\n\n`;
  }
  
  // Add repository instructions if provided
  if (options.repositoryInstructions) {
    formattedOutput += `## Repository Instructions\n\n${options.repositoryInstructions}\n\n`;
  }
  
  // Add directory structure
  if (output.directoryStructure) {
    formattedOutput += `## Directory Structure\n\n`;
    formattedOutput += formatDirectoryStructure(output.directoryStructure);
    formattedOutput += `\n`;
  }
  
  // Add table of contents with links
  formattedOutput += `## Table of Contents\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    const anchor = `file-${i + 1}`;
    formattedOutput += `${i + 1}. [${file.path}](#${anchor}) (${formatBytes(file.size)})\n`;
  }
  
  // Add file contents with anchors
  formattedOutput += `\n## Files\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    const anchor = `file-${i + 1}`;
    formattedOutput += `<a id="${anchor}"></a>\n`;
    formattedOutput += `### ${i + 1}. \`${file.path}\`\n\n`;
    formattedOutput += `Size: ${formatBytes(file.size)}\n\n`;
    
    // Format code with triple backticks and language
    const language = getLanguageFromExtension(file.extension);
    formattedOutput += `\`\`\`${language}\n${file.content}\n\`\`\`\n\n`;
  }
  
  // Add footer with instructions for ChatGPT
  formattedOutput += `---\n\n`;
  formattedOutput += `# Instructions for ChatGPT\n\n`;
  formattedOutput += `This repository pack contains the complete codebase. You can navigate using the table of contents links.\n`;
  formattedOutput += `When discussing code, please cite the relevant file paths to maintain context.\n`;
  
  return formattedOutput;
}

/**
 * Format output for Perplexity
 * @param {Object} output - Processed output
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatForPerplexity(output, options = {}) {
  // Perplexity works well with a format similar to the generic one
  // but with some specific optimizations
  let formattedOutput = '';
  
  // Add file summary
  formattedOutput += `# Repository Pack for Perplexity\n\n`;
  formattedOutput += generateFileSummary(output);
  
  // Add token count information
  formattedOutput += `## Token Count Information\n\n`;
  formattedOutput += `Total Tokens: ${output.metadata.metrics.totalTokens.toLocaleString()}\n`;
  formattedOutput += `Total Characters: ${output.metadata.metrics.totalChars.toLocaleString()}\n\n`;
  
  // Add custom header if provided
  if (output.metadata.customHeader) {
    formattedOutput += `## Repository Description\n\n${output.metadata.customHeader}\n\n`;
  }
  
  // Add repository instructions if provided
  if (options.repositoryInstructions) {
    formattedOutput += `## Repository Instructions\n\n${options.repositoryInstructions}\n\n`;
  }
  
  // Add directory structure
  if (output.directoryStructure) {
    formattedOutput += `## Directory Structure\n\n`;
    formattedOutput += formatDirectoryStructure(output.directoryStructure);
    formattedOutput += `\n`;
  }
  
  // Add table of contents
  formattedOutput += `## Table of Contents\n\n`;
  formattedOutput += `| # | File | Size |\n`;
  formattedOutput += `|---|------|------|\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `| ${i + 1} | \`${file.path}\` | ${formatBytes(file.size)} |\n`;
  }
  
  // Add file contents
  formattedOutput += `\n## Files\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `### ${i + 1}. \`${file.path}\`\n\n`;
    formattedOutput += `Size: ${formatBytes(file.size)}\n\n`;
    
    // Format code with triple backticks and language
    const language = getLanguageFromExtension(file.extension);
    formattedOutput += `\`\`\`${language}\n${file.content}\n\`\`\`\n\n`;
  }
  
  return formattedOutput;
}

/**
 * Format output for Gemini
 * @param {Object} output - Processed output
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatForGemini(output, options = {}) {
  let formattedOutput = '';
  
  // Add file summary
  formattedOutput += `# Repository Pack for Gemini\n\n`;
  formattedOutput += generateFileSummary(output);
  
  // Add token count information
  formattedOutput += `## Token Count Information\n\n`;
  formattedOutput += `Total Tokens: ${output.metadata.metrics.totalTokens.toLocaleString()}\n`;
  formattedOutput += `Total Characters: ${output.metadata.metrics.totalChars.toLocaleString()}\n\n`;
  
  // Add custom header if provided
  if (output.metadata.customHeader) {
    formattedOutput += `## Repository Description\n\n${output.metadata.customHeader}\n\n`;
  }
  
  // Add repository instructions if provided
  if (options.repositoryInstructions) {
    formattedOutput += `## Repository Instructions\n\n${options.repositoryInstructions}\n\n`;
  }
  
  // Add directory structure
  if (output.directoryStructure) {
    formattedOutput += `## Directory Structure\n\n`;
    formattedOutput += formatDirectoryStructure(output.directoryStructure);
    formattedOutput += `\n`;
  }
  
  // Add table of contents
  formattedOutput += `## Table of Contents\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `${i + 1}. \`${file.path}\` (${formatBytes(file.size)})\n`;
  }
  
  // Add file contents
  formattedOutput += `\n## Files\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `### ${i + 1}. \`${file.path}\`\n\n`;
    formattedOutput += `Size: ${formatBytes(file.size)}\n\n`;
    
    // Format code with triple backticks and language
    const language = getLanguageFromExtension(file.extension);
    formattedOutput += `\`\`\`${language}\n${file.content}\n\`\`\`\n\n`;
    
    // Add separator between files for better readability
    if (i < output.files.length - 1) {
      formattedOutput += `---\n\n`;
    }
  }
  
  return formattedOutput;
}

/**
 * Format output in generic markdown format
 * @param {Object} output - Processed output
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted output
 */
function formatGeneric(output, options = {}) {
  let formattedOutput = '';
  
  // Add file summary
  formattedOutput += `# Repository Pack\n\n`;
  formattedOutput += generateFileSummary(output);
  
  // Add token count information
  formattedOutput += `## Token Count Information\n\n`;
  formattedOutput += `Total Tokens: ${output.metadata.metrics.totalTokens.toLocaleString()}\n`;
  formattedOutput += `Total Characters: ${output.metadata.metrics.totalChars.toLocaleString()}\n\n`;
  
  // Add custom header if provided
  if (output.metadata.customHeader) {
    formattedOutput += `## Repository Description\n\n${output.metadata.customHeader}\n\n`;
  }
  
  // Add repository instructions if provided
  if (options.repositoryInstructions) {
    formattedOutput += `## Repository Instructions\n\n${options.repositoryInstructions}\n\n`;
  }
  
  // Add directory structure
  if (output.directoryStructure) {
    formattedOutput += `## Directory Structure\n\n`;
    formattedOutput += formatDirectoryStructure(output.directoryStructure);
    formattedOutput += `\n`;
  }
  
  // Add table of contents
  formattedOutput += `## Table of Contents\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `${i + 1}. \`${file.path}\` (${formatBytes(file.size)})\n`;
  }
  
  // Add file contents
  formattedOutput += `\n## Files\n\n`;
  for (let i = 0; i < output.files.length; i++) {
    const file = output.files[i];
    formattedOutput += `### ${i + 1}. \`${file.path}\`\n\n`;
    formattedOutput += `Size: ${formatBytes(file.size)}\n\n`;
    
    // Format code with triple backticks and language
    const language = getLanguageFromExtension(file.extension);
    formattedOutput += `\`\`\`${language}\n${file.content}\n\`\`\`\n\n`;
  }
  
  return formattedOutput;
}

/**
 * Helper function to format bytes
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
 * Helper function to get language from file extension
 * @param {string} extension - File extension
 * @returns {string} Language identifier
 */
function getLanguageFromExtension(extension) {
  const languageMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less',
    '.json': 'json',
    '.md': 'markdown',
    '.py': 'python',
    '.rb': 'ruby',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.rs': 'rust',
    '.sh': 'bash',
    '.bat': 'batch',
    '.ps1': 'powershell',
    '.sql': 'sql',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.xml': 'xml',
    '.vue': 'vue',
    '.svelte': 'svelte',
    '.graphql': 'graphql',
    '.gql': 'graphql',
    '.dart': 'dart',
    '.elm': 'elm',
    '.ex': 'elixir',
    '.exs': 'elixir',
    '.erl': 'erlang',
    '.hrl': 'erlang',
    '.fs': 'fsharp',
    '.fsx': 'fsharp',
    '.hs': 'haskell',
    '.lhs': 'haskell',
    '.lua': 'lua',
    '.pl': 'perl',
    '.r': 'r',
    '.scala': 'scala',
    '.clj': 'clojure',
    '.toml': 'toml',
    '.ini': 'ini',
    '.tf': 'terraform',
    '.dockerfile': 'dockerfile',
    '.gitignore': 'gitignore'
  };
  
  return languageMap[extension] || '';
}

/**
 * Generate a file summary section
 * @param {Object} output - Processed output
 * @returns {string} Formatted file summary
 */
function generateFileSummary(output) {
  let summary = '';
  
  // Basic information
  summary += `Generated: ${output.metadata.timestamp}\n`;
  summary += `Repository: ${output.metadata.repositoryName}\n`;
  summary += `Total Files: ${output.metadata.totalFiles}\n`;
  summary += `Total Size: ${formatBytes(output.metadata.totalSize)}\n\n`;
  
  // Processing options
  summary += `## Processing Options\n\n`;
  summary += `- Comments Removed: ${output.metadata.processingOptions.removeComments ? 'Yes' : 'No'}\n`;
  summary += `- Empty Lines Removed: ${output.metadata.processingOptions.removeEmptyLines ? 'Yes' : 'No'}\n`;
  summary += `- Security Check: ${output.metadata.processingOptions.securityCheck ? 'Yes' : 'No'}\n`;
  summary += `- Max File Size: ${output.metadata.processingOptions.maxFileSize} MB\n\n`;
  
  // Usage guidelines
  summary += `## Usage Guidelines\n\n`;
  summary += `- This file contains a packed representation of the entire repository's contents.\n`;
  summary += `- It is designed to be easily consumable by AI systems for analysis, code review, or other automated processes.\n`;
  summary += `- When processing this file, use the file path to distinguish between different files in the repository.\n`;
  summary += `- This file should be treated as read-only. Any changes should be made to the original repository files.\n`;
  
  if (output.metadata.processingOptions.securityCheck) {
    summary += `- Sensitive information has been redacted for security purposes.\n`;
  } else {
    summary += `- Be aware that this file may contain sensitive information. Handle it with appropriate security.\n`;
  }
  
  summary += `\n`;
  
  return summary;
}

/**
 * Format directory structure as a tree
 * @param {Object} structure - Directory structure object
 * @param {string} prefix - Prefix for indentation
 * @returns {string} Formatted directory structure
 */
function formatDirectoryStructure(structure, prefix = '') {
  let result = '';
  
  if (!structure) {
    return result;
  }
  
  // Format root directory
  if (prefix === '') {
    result += `${structure.name}/\n`;
    prefix = '  ';
  }
  
  // Format children
  if (structure.children && structure.children.length > 0) {
    for (let i = 0; i < structure.children.length; i++) {
      const child = structure.children[i];
      const isLast = i === structure.children.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const childPrefix = isLast ? prefix + '    ' : prefix + '│   ';
      
      if (child.type === 'directory') {
        result += `${prefix}${connector}${child.name}/\n`;
        result += formatDirectoryStructure(child, childPrefix);
      } else {
        result += `${prefix}${connector}${child.name}\n`;
      }
    }
  }
  
  return result;
}

module.exports = {
  formatOutput,
  formatForClaude,
  formatForChatGPT,
  formatForPerplexity,
  formatForGemini,
  formatGeneric,
  formatBytes,
  getLanguageFromExtension,
  generateFileSummary,
  formatDirectoryStructure
};
