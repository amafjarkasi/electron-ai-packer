# Electron AI Packer

An Electron-based application for analyzing and packaging code repositories with AI assistance.

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
