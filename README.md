# 🏭 IndustryHub - ERP Solutions Platform

A comprehensive Enterprise Resource Planning (ERP) platform with AI-powered assistance, supporting multiple industries with tailored modules and intelligent chat capabilities.

## 🌟 Features

### 🏢 **Multi-Industry Support**
- **Manufacturing** - Production planning, quality control, inventory management
- **Healthcare** - Patient records, appointment scheduling, compliance tracking
- **Retail** - Order management, inventory control, supply chain
- **Education** - Student management, course planning, workforce tracking
- **Food & Beverage** - Safety compliance, quality control, supply chain
- **Textile** - Production planning, workforce management, supply chain

### 🤖 **AI-Powered Chat Assistant**
- **Instant Responses** - Cached responses for common questions (< 100ms)
- **Structured Formatting** - Consistent, professional response format
- **Website-Aware** - AI has access to all platform content and data
- **Multi-Interface** - Chat widget + standalone chat pages
- **Speed Optimized** - 15-second max response time with fallbacks

### 📊 **ERP Modules (30+ Available)**
- Production Planning & Control
- Inventory Management
- Quality Control & Assurance
- Supply Chain Management
- Workforce Management
- Compliance Tracking
- Cost Analysis & Reporting
- Equipment Maintenance
- Order Management
- Patient Records (Healthcare)
- Appointment Scheduling (Healthcare)

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (for AI backend)
- **Node.js 16+** (for authentication)
- **Modern Web Browser**

### 1. Clone Repository
```bash
git clone <repository-url>
cd user-authentification
```

### 2. Setup AI Chat Backend
```bash
# Create virtual environment
python -m venv chat_env
source chat_env/bin/activate  # On Windows: chat_env\Scripts\activate

# Install Python dependencies
cd chat_backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys:
# DEEPSEEK_API_KEY=your_deepseek_api_key
# TAVILY_API_KEY=your_tavily_api_key (optional)
```

### 3. Setup Authentication Backend
```bash
cd login-backend
npm install
```

### 4. Start Services
```bash
# Terminal 1: Start AI Chat Backend
cd chat_backend
python app.py
# Server runs on http://127.0.0.1:8000

# Terminal 2: Start Auth Backend (optional)
cd login-backend
npm start
# Server runs on http://localhost:3000
```

### 5. Open Platform
Open `home/home.html` in your web browser to start using the platform.

## 📁 Project Structure

```
user-authentification/
├── 📂 home/                    # Landing page & industry selection
├── 📂 industries/              # Industry-specific ERP modules
├── 📂 chat_backend/            # AI chat backend (FastAPI)
├── 📂 chat_frontend/           # Standalone chat interface
├── 📂 login-backend/           # Authentication backend (Node.js)
├── 📂 static_front/            # Static frontend assets
├── 📄 chat-widget.js           # Embeddable chat widget
├── 📄 website_knowledge_base.json  # AI knowledge base
└── 📄 README.md               # This file
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Required for AI functionality
DEEPSEEK_API_KEY=your_deepseek_api_key

# Optional for web search
TAVILY_API_KEY=your_tavily_api_key

# Performance tuning (optional)
DEEPSEEK_TIMEOUT=15
DEEPSEEK_MAX_RETRIES=1
```

### AI Response Customization
Edit `chat_backend/app.py` to modify:
- Response cache for instant answers
- Formatting templates
- Timeout settings
- Token limits

## 🎯 Usage

### Industry Selection
1. Open the platform homepage
2. Select your industry from 6 available options
3. Click "Continue" to access industry-specific modules

### ERP Modules
- Each industry has 4-6 specialized modules
- Modules include interactive dashboards, data tables, and forms
- Data persists in localStorage for demo purposes

### AI Chat Assistant
- **Chat Widget**: Available on all ERP module pages (bottom-right)
- **Standalone Chat**: Access via chat frontend
- **Quick Questions**: Try "hello", "help", or "what industries do you support"

## 🚀 Performance Optimizations

### Speed Features
- **Instant Cache**: Common questions respond in < 100ms
- **Reduced Timeouts**: 15-second max API calls
- **Optimized Tokens**: 500 token limit for faster responses
- **Smart Fallbacks**: Quick responses when AI is slow

### Response Format
All AI responses follow this structure:
```
Hello! 👋

**Quick Answer:**
• Direct response to the question

**Available Options:**
• Option 1 - Description
• Option 2 - Description

**Popular Questions:**
• "Example question 1"
• "Example question 2"

Just ask - I'm here to help! 🚀
```

## 🛠️ Development

### Adding New Industries
1. Create HTML file in `industries/` folder
2. Update `home/home.js` with industry data
3. Add modules to `website_knowledge_base.json`
4. Run `python extract_website_content.py` to update AI knowledge

### Customizing AI Responses
1. Edit response cache in `chat_backend/app.py`
2. Modify formatting templates
3. Update knowledge base content
4. Test with `python test_formatting.py`

### Adding ERP Modules
1. Create module HTML page
2. Implement interactive features (tables, forms, charts)
3. Add localStorage persistence
4. Update navigation and knowledge base

## 📊 API Endpoints

### Chat Backend (Port 8000)
- `POST /chat` - Main chat endpoint
- `POST /chat/stream` - Streaming chat responses
- `GET /dashboard/{module_type}` - Module dashboard data
- `POST /upload` - Document upload for analysis

### Auth Backend (Port 3000)
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth

## 🔍 Troubleshooting

### Common Issues
1. **AI not responding**: Check DEEPSEEK_API_KEY in .env
2. **Slow responses**: Verify internet connection and API limits
3. **Module not loading**: Check browser console for JavaScript errors
4. **Chat widget missing**: Ensure chat-widget.js is loaded

### Performance Tips
- Use cached responses for common questions
- Keep prompts under 6000 characters
- Monitor API rate limits
- Enable browser caching for static assets

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Check the AI chat assistant first
- Review this README
- Check browser console for errors
- Verify API keys and environment setup

---

**Built with ❤️ for modern ERP solutions**
