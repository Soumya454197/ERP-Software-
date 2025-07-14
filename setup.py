#!/usr/bin/env python3
"""
IndustryHub ERP Platform Setup Script
Automated setup for Python dependencies and environment configuration
"""

import os
import sys
import subprocess
import platform

def print_header(title):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"🚀 {title}")
    print("=" * 60)

def print_step(step, description):
    """Print a formatted step"""
    print(f"\n{step}. {description}")
    print("-" * 40)

def run_command(command, description=""):
    """Run a command and handle errors"""
    try:
        print(f"📦 {description}")
        print(f"💻 Running: {command}")
        
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        
        if result.stdout:
            print(f"✅ Output: {result.stdout.strip()}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        if e.stderr:
            print(f"📄 Details: {e.stderr.strip()}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        print(f"📄 Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def setup_virtual_environment():
    """Create and setup virtual environment"""
    venv_path = "chat_env"
    
    if os.path.exists(venv_path):
        print(f"✅ Virtual environment already exists at {venv_path}")
        return True
    
    # Create virtual environment
    if not run_command(f"python -m venv {venv_path}", 
                      "Creating virtual environment"):
        return False
    
    print(f"✅ Virtual environment created at {venv_path}")
    return True

def install_python_dependencies():
    """Install Python dependencies"""
    # Determine activation command based on OS
    if platform.system() == "Windows":
        activate_cmd = "chat_env\\Scripts\\activate"
        pip_cmd = "chat_env\\Scripts\\pip"
    else:
        activate_cmd = "source chat_env/bin/activate"
        pip_cmd = "chat_env/bin/pip"
    
    # Install dependencies
    requirements_file = os.path.join("chat_backend", "requirements.txt")
    
    if not os.path.exists(requirements_file):
        print(f"❌ Requirements file not found: {requirements_file}")
        return False
    
    command = f"{pip_cmd} install -r {requirements_file}"
    return run_command(command, "Installing Python dependencies")

def create_env_file():
    """Create .env file template"""
    env_path = os.path.join("chat_backend", ".env")
    
    if os.path.exists(env_path):
        print(f"✅ Environment file already exists at {env_path}")
        return True
    
    env_template = """# IndustryHub ERP Platform - Environment Variables
# Copy this file and add your actual API keys

# Required: DeepSeek AI API Key
# Get your key from: https://platform.deepseek.com/
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Optional: Tavily Web Search API Key
# Get your key from: https://tavily.com/
TAVILY_API_KEY=your_tavily_api_key_here

# Performance Settings (optional)
DEEPSEEK_TIMEOUT=15
DEEPSEEK_MAX_RETRIES=1
DEEPSEEK_RETRY_TIMEOUT=20
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_template)
        print(f"✅ Environment template created at {env_path}")
        print("📝 Please edit this file and add your actual API keys")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def check_node_js():
    """Check if Node.js is available for auth backend"""
    try:
        result = subprocess.run(["node", "--version"], 
                              capture_output=True, text=True, check=True)
        version = result.stdout.strip()
        print(f"✅ Node.js {version} detected")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️  Node.js not found - authentication backend will not be available")
        print("💡 Install Node.js from https://nodejs.org/ if you need authentication")
        return False

def main():
    """Main setup function"""
    print_header("IndustryHub ERP Platform Setup")
    
    print("🎯 This script will set up the Python AI chat backend")
    print("📋 Requirements: Python 3.8+, internet connection")
    
    # Step 1: Check Python version
    print_step(1, "Checking Python Version")
    if not check_python_version():
        sys.exit(1)
    
    # Step 2: Setup virtual environment
    print_step(2, "Setting Up Virtual Environment")
    if not setup_virtual_environment():
        print("❌ Failed to create virtual environment")
        sys.exit(1)
    
    # Step 3: Install Python dependencies
    print_step(3, "Installing Python Dependencies")
    if not install_python_dependencies():
        print("❌ Failed to install Python dependencies")
        print("💡 Try running manually:")
        print("   cd chat_backend")
        print("   pip install -r requirements.txt")
        sys.exit(1)
    
    # Step 4: Create environment file
    print_step(4, "Creating Environment Configuration")
    create_env_file()
    
    # Step 5: Check Node.js (optional)
    print_step(5, "Checking Node.js (Optional)")
    check_node_js()
    
    # Final instructions
    print_header("Setup Complete! 🎉")
    print("\n📋 Next Steps:")
    print("1. Edit chat_backend/.env and add your DeepSeek API key")
    print("2. Start the AI backend:")
    
    if platform.system() == "Windows":
        print("   chat_env\\Scripts\\activate")
    else:
        print("   source chat_env/bin/activate")
    
    print("   cd chat_backend")
    print("   python app.py")
    print("\n3. Open home/home.html in your browser")
    print("\n💡 For authentication backend:")
    print("   cd login-backend")
    print("   npm install")
    print("   npm start")
    
    print("\n🎯 Platform will be available at:")
    print("   - Frontend: home/home.html")
    print("   - AI Backend: http://127.0.0.1:8000")
    print("   - Auth Backend: http://localhost:3000 (if enabled)")

if __name__ == "__main__":
    main()
