# Electron AI Packer 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/amafjarkasi/electron-ai-packer/actions/workflows/ci.yml/badge.svg)](https://github.com/amafjarkasi/electron-ai-packer/actions)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub Stars](https://img.shields.io/github/stars/amafjarkasi/electron-ai-packer?style=social)](https://github.com/amafjarkasi/electron-ai-packer/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/amafjarkasi/electron-ai-packer)](https://github.com/amafjarkasi/electron-ai-packer/issues)

**Electron AI Packer** is a cutting-edge desktop application that revolutionizes code repository management through AI-powered analysis and optimization. Built with Electron for seamless cross-platform compatibility, it offers developers an intuitive interface for handling complex codebases with ease.

## ✨ Key Highlights

- 🧠 **AI-Powered Code Analysis**: Leverage state-of-the-art AI models for deep code understanding
- 🖥️ **Cross-Platform Support**: Native experience on Windows, macOS, and Linux
- ⚙️ **Customizable Workflows**: Tailor the processing pipeline to your specific needs
- 🔍 **Comprehensive Code Insights**: Get detailed metrics and optimization suggestions
- 📦 **Efficient Packaging**: Create optimized code packages for deployment

## 🚀 Quick Start

Get up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/amafjarkasi/electron-ai-packer.git

# Install dependencies
cd electron-ai-packer
npm install

# Start the application
npm start
```

## 🛠️ Core Features

### AI-Powered Analysis
- Code structure analysis
- Dependency mapping
- Code quality assessment
- Security vulnerability detection

### Repository Management
- Multi-repository support
- Version control integration
- Custom exclusion patterns
- File type recognition

### Output Generation
- Customizable templates
- Documentation generation
- Code summarization
- Export options (Markdown, HTML, PDF)

## 📊 System Architecture

```mermaid
graph TD
    A[Main Process] --> B[Renderer Process]
    B --> C[AI Engine]
    C --> D[Code Analyzer]
    C --> E[Security Scanner]
    C --> F[Optimizer]
    D --> G[Output Generator]
    E --> G
    F --> G
```

## 🧩 Technology Stack

- **Frontend**: Electron, React
- **Backend**: Node.js
- **AI Engine**: TensorFlow.js, Natural Language Processing
- **Database**: SQLite (local storage)
- **Build Tools**: Webpack, Babel

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📸 Screenshots

### Main Interface
![Home Screen](assets/home_screen.png)
*The main interface showing repository selection and basic controls*

### Processing Options
![Options Area](assets/options_area.png)
*Configuration panel with various processing options*

### Output Preview
![Output Process](assets/output_process.png)
*Real-time output preview during code processing*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Key Features
- Repository scanning and analysis
- AI-powered code processing
- Customizable packing options
- Interactive GUI for easy use
- Cross-platform support (Windows, macOS, Linux)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amafjarkasi/electron-ai-packer.git
   ```
2. Install dependencies:
   ```bash
   cd electron-ai-packer
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## Usage

### Basic Usage
1. Launch the application
2. Click "Select Repository" to choose your code directory
3. Adjust processing options in the settings panel
4. Click "Process Repository" to begin analysis
5. Review the processed output in the preview pane
6. Save or copy the final packaged output

### Advanced Features
- Custom file exclusions using .gitignore syntax
- AI-powered code summarization
- Context-aware code restructuring
- Multi-language support (JavaScript, Python, Java, etc.)

## Configuration

### Processing Options
- **Max File Size**: Set maximum file size to process (default: 1MB)
- **Exclude Patterns**: List of file patterns to exclude
- **Remove Comments**: Strip comments from processed code
- **Security Checks**: Enable security vulnerability scanning
- **Custom Header**: Add custom documentation header

### AI Settings
- **Model Selection**: Choose between different AI models
- **Context Window**: Adjust AI context memory size
- **Temperature**: Control AI creativity level

## Troubleshooting

### Common Issues
**Slow Processing:**
- Reduce max file size
- Exclude large binary files
- Close other resource-intensive applications

**AI Output Quality:**
- Increase context window size
- Adjust temperature setting
- Provide more specific instructions

**Application Crashes:**
- Ensure you have the latest version
- Check system requirements
- Verify sufficient disk space

## Screenshots

![Home Screen](assets/home_screen.png)
![Options Area](assets/options_area.png)
![Output Process](assets/output_process.png)

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
