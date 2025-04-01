// DOM Elements
let elements;

// State
let state = {
  repoPath: null,
  output: null,
  processing: false,
  activeSection: 'ai-packer-section'
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    
    // Initialize elements
    elements = {
      // Navigation
      navLinks: document.querySelectorAll('.sidebar .nav-link'),
      contentSections: document.querySelectorAll('.content-section'),
      
      // Tab navigation
      optionsTabs: document.querySelectorAll('#options-tabs .nav-link'),
      
      // Repository
      repoPath: document.getElementById('repo-path'),
      selectRepoBtn: document.getElementById('select-repo-btn'),
      repoInfo: document.getElementById('repo-info'),
      repoName: document.getElementById('repo-name'),
      repoPathDisplay: document.getElementById('repo-path-display'),
      fileTypes: document.getElementById('file-types'),
      skippedFiles: document.getElementById('skipped-files'),

      // Options
      maxFileSize: document.getElementById('max-file-size'),
      excludePatterns: document.getElementById('exclude-patterns'),
      removeComments: document.getElementById('remove-comments'),
      removeEmptyLines: document.getElementById('remove-empty-lines'),
      securityCheck: document.getElementById('security-check'),
      customHeader: document.getElementById('custom-header'),
      llmTarget: document.getElementById('llm-target'),
      minifyCode: document.getElementById('minify-code'),
      minifyHTML: document.getElementById('minify-html'),
      minifyCSS: document.getElementById('minify-css'),
      showDefaultPatterns: document.getElementById('show-default-patterns'),
      defaultPatterns: document.getElementById('default-patterns'),
      
      // Process and Output
      processBtn: document.getElementById('process-btn'),
      progressCard: document.getElementById('progress-card'),
      progressMessage: document.getElementById('progress-message'),
      progressBar: document.getElementById('progress-bar'),
      progressDetails: document.getElementById('progress-details'),
      outputCard: document.getElementById('output-card'),
      outputStats: document.getElementById('output-stats'),
      outputPreview: document.getElementById('output-preview'),
      copyBtn: document.getElementById('copy-btn'),
      saveBtn: document.getElementById('save-btn'),
      clearBtn: document.getElementById('clear-btn'),

      // Notifications
      toast: document.getElementById('toast'),
      toastTitle: document.getElementById('toast-title'),
      toastMessage: document.getElementById('toast-message'),

      // Navigation links
      navRepoLink: document.getElementById('nav-repo-link'),
      navOptionsLink: document.getElementById('nav-options-link'),
      navOutputLink: document.getElementById('nav-output-link'),
    };
    
    // Check if all required elements are found
    
    // Check navigation elements
    if (elements.navLinks.length === 0) {
      console.error('Navigation links not found!');
    } else {
      elements.navLinks.forEach((link, index) => {
      });
    }
    
    // Check content sections
    if (elements.contentSections.length === 0) {
      console.error('Content sections not found!');
    } else {
      elements.contentSections.forEach((section, index) => {
      });
    }
    
    // Initialize toast to be hidden by default
    elements.toast.style.display = 'none';
    
    // Set initial active section
    elements.contentSections.forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById('ai-packer-section').classList.add('active');
    
    // Register event listeners
    registerEventListeners();
    
    // Register progress update listener
    window.electronAPI.onProgressUpdate(handleProgressUpdate);
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

// Register event listeners
function registerEventListeners() {
  // Navigation links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      handleNavigation(e);
    });
  });
  
  // Initialize tabs
  // Initialize default patterns
  const defaultExcludePatterns = [
    '# Binary files',
    '*.jpg', '*.jpeg', '*.png', '*.gif', '*.ico', '*.webp',
    '*.mp3', '*.wav', '*.mp4', '*.webm', '*.avi',
    '*.zip', '*.rar', '*.7z', '*.tar', '*.gz',
    '*.pdf', '*.doc', '*.docx', '*.xls', '*.xlsx',
    '*.exe', '*.dll', '*.so', '*.dylib',
    '*.ttf', '*.otf', '*.woff', '*.woff2',
    '*.pyc', '*.class', '*.o', '*.obj',
    '*.db', '*.sqlite',
    '',
    '# Common directories',
    'node_modules/**/*',
    'dist/**/*',
    'build/**/*',
    'coverage/**/*',
    '.git/**/*',
    '.idea/**/*',
    '.vscode/**/*'
  ].join('\n');

  elements.defaultPatterns.value = defaultExcludePatterns;

  // Add event listener for showing/hiding default patterns
  elements.showDefaultPatterns.addEventListener('change', (e) => {
    elements.defaultPatterns.classList.toggle('d-none', !e.target.checked);
  });

  if (document.querySelector('#options-tabs')) {
    const tabElements = document.querySelectorAll('#options-tabs .nav-link');
    tabElements.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('href').substring(1);
        
        // Hide all tab contents
        document.querySelectorAll('.tab-pane').forEach(pane => {
          pane.classList.remove('show', 'active');
        });
        
        // Show selected tab content
        document.getElementById(tabId).classList.add('show', 'active');
        
        // Update active tab
        tabElements.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
  
  // Select repository button (only add listener once)
  if (!elements.selectRepoBtn._hasListener) {
    elements.selectRepoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectRepository();
    });
    elements.selectRepoBtn._hasListener = true;
  }
  
  // Process button
  elements.processBtn.addEventListener('click', processRepository);
  
  // Copy button
  elements.copyBtn.addEventListener('click', copyOutputToClipboard);
  
  // Save button (only add listener once)
  if (!elements.saveBtn._hasListener) {
    elements.saveBtn.addEventListener('click', saveOutputToFile);
    elements.saveBtn._hasListener = true;
  }
  
  // Add clear button functionality
  if (!elements.clearBtn._hasListener) {
    elements.clearBtn.addEventListener('click', clearOutput);
    elements.clearBtn._hasListener = true;
  }
}

// Simple section switcher
function switchSection(sectionId) {
  
  // Update active nav link
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');
  
  // Show target section, hide others
  elements.contentSections.forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
  
  // Update state
  state.activeSection = sectionId;
}

// Handle navigation
function handleNavigation(event) {
  event.preventDefault();
  
  // Get the clicked element
  let target = event.target;
  
  // If the clicked element is not the link itself but a child (like an icon or text),
  // traverse up to find the parent link
  while (target && !target.classList.contains('nav-link')) {
    target = target.parentElement;
  }
  
  if (!target) return; // Exit if no valid target found
  
  const targetSection = target.getAttribute('data-section');
  if (!targetSection) return; // Exit if no section found
  
  // Update active nav link
  elements.navLinks.forEach(link => {
    link.classList.remove('active');
  });
  target.classList.add('active');
  
  // Show target section, hide others
  elements.contentSections.forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(targetSection).classList.add('active');
  
  // Update state
  state.activeSection = targetSection;
  
}

// Select repository
async function selectRepository() {
  try {
    const path = await window.electronAPI.selectDirectory();
    
    if (path) {
      state.repoPath = path;
      elements.repoPath.value = path;
      
      // Extract repository name from path
      const repoName = path.split(/[\\/]/).pop();
      elements.repoName.textContent = repoName;
      elements.repoPathDisplay.textContent = path;
      
      // Show repository info
      elements.repoInfo.classList.remove('d-none');
      
      try {
        // Get basic stats
        const stats = await window.electronAPI.getBasicStats(path);
        
        // Update file count
        document.getElementById('files-count').textContent = stats.fileCount ?
          `${stats.fileCount.toLocaleString()} files` : 'Unknown';
        
        // Update total size
        document.getElementById('total-size').textContent = stats.totalSize ?
          `${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB` : 'Unknown';

        // Update file types with better formatting
        const fileTypeText = stats.fileTypes ?
          Object.entries(stats.fileTypes)
            .sort((a, b) => b[1] - a[1]) // Sort by count
            .slice(0, 3) // Take top 3
            .map(([ext, count]) => `${count.toLocaleString()}${ext}`)
            .join(', ') + (Object.keys(stats.fileTypes).length > 3 ? '...' : '') : 'N/A';
        elements.fileTypes.textContent = fileTypeText;

        // Update skipped files with better formatting
        const skippedCount = stats.skippedFiles || 0;
        elements.skippedFiles.textContent = skippedCount > 0 ?
          `${skippedCount.toLocaleString()} files` : 'None';

        // Update largest files list
        if (stats.largestFiles && stats.largestFiles.length > 0) {
          const largestFilesText = stats.largestFiles
            .slice(0, 3)
            .map(f => `${f.name} (${f.size})`)
            .join('<br>');
          document.getElementById('largest-files').innerHTML = largestFilesText;
        } else {
          document.getElementById('largest-files').textContent = 'N/A';
        }
      } catch (statsError) {
        console.warn('Could not get stats:', statsError);
        document.getElementById('files-count').textContent = 'Unknown';
        document.getElementById('total-size').textContent = 'Unknown';
        elements.fileTypes.textContent = 'N/A';
        elements.skippedFiles.textContent = 'N/A';
      }

      // Enable process button
      elements.processBtn.disabled = false;
      
      showToast('Repository Selected', `Selected repository: ${repoName}`);
    }
  } catch (error) {
    console.error('Error selecting repository:', error);
    showToast('Error', 'Failed to select repository', true);
    elements.processBtn.disabled = true;
  }
}

// Process repository
async function processRepository() {
  if (!state.repoPath || state.processing) {
    return;
  }
  
  try {
    state.processing = true;
    elements.processBtn.disabled = true;
    
    // Navigate to output section
    navigateToSection('output-section');
    
    // Show progress card and hide output card
    elements.progressCard.classList.remove('d-none');
    elements.outputCard.classList.add('d-none');
    
    // Get options
    const options = {
      maxFileSize: parseFloat(elements.maxFileSize.value),
      excludePatterns: elements.excludePatterns.value
        .split('\n')
        .map(pattern => pattern.trim())
        .filter(pattern => pattern.length > 0),
      llmTarget: elements.llmTarget.value,
      removeComments: elements.removeComments.checked,
      removeEmptyLines: elements.removeEmptyLines.checked,
      securityCheck: elements.securityCheck.checked,
      minifyCode: elements.minifyCode.checked,
      minifyHTML: elements.minifyHTML.checked,
      minifyCSS: elements.minifyCSS.checked,
      customHeader: elements.customHeader.value.trim(),
      repoPath: state.repoPath,
      repositoryName: elements.repoName.textContent
    };
    
    
    // Process repository
    const output = await window.electronAPI.processRepository(options);
    
    state.output = output;
    
    // Update output preview
    if (output) {
      elements.outputPreview.textContent = output;
      elements.outputPreview.scrollTop = 0; // Reset scroll to top
    } else {
      elements.outputPreview.textContent = 'No output generated. Please check the repository and options.';
    }
    
    // Calculate stats
    const lines = output.split('\n').length;
    const chars = output.length;
    elements.outputStats.textContent = `${lines} lines, ${chars.toLocaleString()} characters`;
    
    // Show output card and hide progress card
    elements.outputCard.classList.remove('d-none');
    elements.progressCard.classList.add('d-none');
    
    console.log('Showing completion toast');
    showToast('Processing Complete', 'Repository has been successfully processed');
  } catch (error) {
    console.error('Error processing repository:', error);
    showToast('Error', `Failed to process repository: ${error.message}`, true);
  } finally {
    state.processing = false;
    elements.processBtn.disabled = false;
  }
}

// Navigate to a specific section
function navigateToSection(sectionId) {
  // Find the nav link for this section
  const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
  
  if (navLink) {
    // Update active nav link
    elements.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    navLink.classList.add('active');
    
    // Show target section, hide others
    elements.contentSections.forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    // Update state
    state.activeSection = sectionId;
  }
}

// Handle progress updates
function handleProgressUpdate(data) {
  elements.progressMessage.textContent = data.message;
  elements.progressBar.style.width = `${data.progress}%`;
  elements.progressBar.setAttribute('aria-valuenow', data.progress);
  
  if (data.details) {
    elements.progressDetails.textContent = data.details;
  }
  
  // Update progress bar color based on status
  elements.progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated';
  
  if (data.status === 'error') {
    elements.progressBar.classList.add('bg-danger');
  } else if (data.status === 'complete') {
    elements.progressBar.classList.add('bg-success');
    elements.progressBar.classList.remove('progress-bar-animated');
  } else {
    elements.progressBar.classList.add('bg-primary');
  }
}

// Copy output to clipboard
async function copyOutputToClipboard() {
  if (!state.output) {
    return;
  }
  
  try {
    const success = await window.electronAPI.copyToClipboard(state.output);
    
    if (success) {
      showToast('Copied', 'Output copied to clipboard');
    } else {
      throw new Error('Failed to copy to clipboard');
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    showToast('Error', 'Failed to copy to clipboard', true);
  }
}

// Save output to file
async function saveOutputToFile() {
  if (!state.output) {
    showToast('Error', 'No output to save', true);
    return;
  }
  
  try {
    const result = await window.electronAPI.saveOutput(state.output);
    
    if (!result) {
      return; // Dialog was closed without selection
    }
    
    if (result.canceled) {
      return; // User explicitly canceled
    }
    
    if (result.success) {
      showToast('Saved', `Output saved to ${result.filePath}`);
    } else {
      throw new Error(result.error || 'Failed to save file');
    }
  } catch (error) {
    console.error('Error saving file:', error);
    showToast('Error', `Failed to save file: ${error.message}`, true);
  }
}

// Show toast notification
function showToast(title, message, isError = false) {
  // Update toast content
  elements.toastTitle.textContent = title;
  elements.toastMessage.textContent = message;
  
  // Set toast color based on error status
  elements.toast.style.backgroundColor = isError ? '#dc3545' : '#28a745';
  elements.toast.style.color = '#fff';
  
  // Show toast
  elements.toast.style.display = 'block';
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    elements.toast.style.display = 'none';
  }, 3000);
}

// Define the clearOutput function
function clearOutput() {
  // Reset state
  state.output = null;
  state.processing = false;

  // Clear repository info
  elements.repoPath.value = '';
  elements.repoName.textContent = '';
  elements.repoPathDisplay.textContent = '';
  elements.repoInfo.classList.add('d-none');

  // Clear output preview and stats
  elements.outputPreview.textContent = '';
  elements.outputStats.textContent = '';

  // Reset progress indicators
  elements.progressBar.style.width = '0%';
  elements.progressBar.setAttribute('aria-valuenow', 0);
  elements.progressMessage.textContent = '';
  elements.progressDetails.textContent = '';
  elements.progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated bg-primary';

  // Hide progress card and show output card
  elements.progressCard.classList.add('d-none');
  elements.outputCard.classList.remove('d-none');

  // Reset process button
  elements.processBtn.disabled = true;

  // Navigate back to repository section
  navigateToSection('repo-section');

  // Show toast notification
  showToast('Cleared', 'Output and repository selection have been reset');
}
