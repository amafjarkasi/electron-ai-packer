# 📦 AI Repository Packer

> 🤖 Transform your codebase into AI-friendly formats with ease

A powerful desktop application that intelligently packs your entire repository into a single, AI-friendly file. Perfect for feeding your codebase to Large Language Models (LLMs) like Claude, ChatGPT, DeepSeek, Perplexity, Gemini, Gemma, Llama, Grok, and more.

## 📸 Application Screenshots

### 🏠 Home Screen
<div align="center">
  <img src="assets/home_screen.png" alt="AI Repository Packer Home Screen" width="800"/>
  <p><em>Welcome screen with key features and getting started guide</em></p>
</div>

### 📂 Repository Selection
<div align="center">
  <img src="assets/repo_selection.png" alt="Repository Selection Screen" width="800"/>
  <p><em>Select your repository and view basic statistics</em></p>
</div>

### ⚙️ Options Configuration
<div align="center">
  <img src="assets/options_area.png" alt="Options Configuration Screen" width="800"/>
  <p><em>Configure processing options, filters, and LLM settings</em></p>
</div>

### 📤 Output Processing
<div align="center">
  <img src="assets/output_process.png" alt="Output Processing Screen" width="800"/>
  <p><em>View processed output and export options</em></p>
</div>

## ✨ Features

### 🎯 Core Features
- **🖥️ Intuitive Interface**: Clean, modern UI for effortless repository management
- **🔍 Smart Filtering**: Intelligent .gitignore pattern recognition and custom exclusions
- **📏 Size Control**: Flexible file size limits with automatic optimization
- **🤖 LLM Optimization**: Tailored output formats for various AI models:
  - Claude
  - ChatGPT
  - Perplexity
  - Gemini
  - And more...

### 🛠️ Processing Options
- **🧹 Code Cleanup**
  - Remove comments
  - Strip empty lines
  - Optimize whitespace
- **🔒 Security Features**
  - Sensitive information detection
  - Credential redaction
  - Security scanning

### 📊 Enhanced Metadata
- **🌳 Directory Visualization**: Clear repository structure representation
- **📝 File Summaries**: Comprehensive file and directory insights
- **📘 Custom Documentation**: Support for repository descriptions and context

## 🚀 Getting Started

### 📥 Installation

#### Pre-built Binaries
Download the latest release for your platform from our [Releases](https://github.com/yourusername/electron-ai-packer/releases) page.

#### Build from Source
```bash
# Clone the repository
git clone https://github.com/yourusername/electron-ai-packer.git
cd electron-ai-packer

# Install dependencies
npm install

# Start the application
npm start

# Build the application
npm run dist
```

### 📝 Usage Guide

1. **🏠 Home Screen**: 
   - Review features and capabilities
   - Access quick start guide

2. **📂 Repository Selection**:
   - Click "Select" to choose repository
   - View repository statistics
   - Check file count and size

3. **⚙️ Options Configuration**:
   - Set maximum file size (MB)
   - Add exclude patterns
   - Configure processing options:
     - Comment removal
     - Empty line removal
     - Security scanning
   - Choose target LLM format

4. **📤 Output Processing**: 
   - Process repository
   - Review formatted output
   - Export or copy results

## 🔧 Development

### 📁 Project Structure
```
electron-ai-packer/
├── 🔷 main.js             # Electron main process
├── 🔷 preload.js          # Preload script
├── 📂 renderer/           # Frontend code
│   ├── 📄 index.html      # Main window
│   ├── 📄 styles.css      # Styles
│   └── 📄 renderer.js     # Frontend logic
└── 📂 src/                # Core logic
    ├── 📄 file-processor.js  # Processing
    ├── 📄 repo-scanner.js    # Scanning
    └── 📄 formatter.js       # Formatting
```

### 📜 Available Scripts
- `npm start`: Development mode
- `npm run pack`: Package without installers
- `npm run dist`: Create installers

## 💡 Why Use AI Repository Packer?

Working with AI coding assistants requires providing context about your codebase. Manual file copying and summarization is tedious and error-prone.

### 🎯 Key Benefits

1. **🚀 Automation**: One-click repository packing
2. **🎯 AI Optimization**: LLM-specific formatting
3. **🌳 Context Preservation**: Maintains file structure
4. **🔍 Smart Filtering**: Excludes non-essential files
5. **🧹 Noise Reduction**: Removes unnecessary content
6. **🔒 Security**: Protects sensitive data
7. **📊 Structure**: Includes visual aids and summaries

## 📄 License

MIT

---
<div align="center">
  <p>Made with ❤️ for the AI development community</p>
</div>
