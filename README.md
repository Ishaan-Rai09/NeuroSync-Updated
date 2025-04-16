# NeuroSync - AI Mental Health Companion

NeuroSync is an advanced AI-powered mental health platform that provides personalized support, emotional analysis, and crisis intervention. Built with Next.js, TailwindCSS, and integrated with advanced AI technologies.

## Features

- 🤖 AI Therapy Chat powered by LLaMA 3.2
- 📊 Real-time Emotion Analysis
- 🆘 24/7 Crisis Support with Emergency Contact Integration
- 🎯 Personalized Mental Health Guidance
- 📱 Responsive Design with Dark/Light Mode
- 🔒 Enterprise-Grade Security & Privacy
- 📈 Progress Tracking and Emotional Analytics
- 🎬 Integrated Demo Video
- 💻 Comprehensive Help Center
- 🔐 Thorough Security Documentation

## Latest Updates

- **YouTube Demo Integration**: Watch Demo button on homepage links directly to our YouTube tutorial
- **Help Center**: Comprehensive support resources at `/help`
- **Security Page**: Detailed security documentation at `/security`
- **Footer Removed from Chat**: Enhanced UI experience in the chat interface
- **Improved Navigation**: Fixed NeuroSync logo to properly navigate to the home page
- **Dark/Light Mode Support**: Complete theme support across all pages
- **Pattern Matching Fallback**: Graceful degradation when AI model times out

## AI Integration

NeuroSync uses a local LLaMA 3.2 model for intelligent conversation and emotional analysis:

- **NLP Processing Pipeline**: User messages are processed through a multi-step pipeline:
  1. Sentiment analysis to detect emotional state
  2. Context-aware AI response generation
  3. Personalized recommendations based on emotional state

- **Recommendation Engine**: The AI suggests relevant:
  - Mindfulness exercises
  - Mental health resources
  - Check-in activities

- **Real-time Emotional Tracking**: Analysis of user messages to identify emotional patterns and provide targeted support.

- **Crisis Detection**: Automatic detection of crisis situations with emergency contact integration

To use the AI features, you need to:
1. Set up the local LLaMA 3.2 instance
2. Configure the connection in the `.env.local` file
3. Restart the application

## Local LLaMA Configuration

To use the AI features in NeuroSync, you need to set up a local LLaMA instance:

1. **Install Ollama**:
   - Visit [Ollama](https://ollama.ai/) and download the installer
   - Follow the installation instructions for your platform

2. **Pull the LLaMA Model**:
   - Open a terminal and run:
   ```bash
   ollama pull llama3.2
   ```

3. **Configure the Application**:
   - Create a `.env.local` file based on the `.env.local.example` template
   - Set the value for `NEXT_PUBLIC_LLAMA_API_URL` to your local Ollama instance (default: http://127.0.0.1:11434)
   - Set the value for `NEXT_PUBLIC_LLAMA_MODEL_NAME` to the model name (default: llama3.2:latest)

4. **Restart Your Application**:
   ```bash
   npm run dev
   ```

**Note for Development**: 
- NeuroSync includes fallback functionality with simulated AI responses when the LLaMA model is not available.
- Timeout thresholds can be adjusted in `local-ai-middleware.js` if you experience timeout issues on slower hardware.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- Ollama (for local LLaMA model)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/neurosync.git
cd neurosync
```

2. Install dependencies:
```bash
cd NeuroSync-AI-Frontend
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the NeuroSync-AI-Frontend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_LLAMA_API_URL=http://127.0.0.1:11434
NEXT_PUBLIC_LLAMA_MODEL_NAME=llama3.2:latest
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
NeuroSync-AI-Frontend/
├── components/         # Reusable React components
│   ├── Layout.jsx      # Standard layout with footer
│   ├── ChatLayout.jsx  # Special layout for chat (no footer)
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── pages/              # Next.js pages and API routes
│   ├── index.js        # Home page
│   ├── chat.js         # AI Chat interface
│   ├── help.js         # Help Center
│   ├── security.js     # Security information
│   └── api/            # Backend API endpoints
├── public/             # Static assets
├── styles/             # Global styles and Tailwind config
├── lib/                # Utility functions and database connection
└── package.json        # Project dependencies and scripts
```

## Key Technologies

- **Frontend:**
  - Next.js
  - React
  - TailwindCSS
  - Next.js Image Optimization

- **Backend:**
  - MongoDB
  - JWT Authentication
  - bcrypt for password hashing

- **AI Integration:**
  - LLaMA 3.2 for conversational AI
  - Custom emotion analysis algorithms
  - Real-time mood detection
  - Crisis detection system

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in:
- localStorage for "Remember Me" functionality
- sessionStorage for regular sessions

## Data Storage

This project uses Pinata IPFS for conversation storage. No MongoDB required.

- Conversations are stored directly on IPFS via Pinata
- User profile data can be stored in local storage or on Pinata
- No database setup required

## Special Pages

- **Home Page (`/`)**: Landing page with YouTube demo video integration
- **Chat Interface (`/chat`)**: AI conversation interface with emergency support
- **Help Center (`/help`)**: Comprehensive support resources
- **Security Page (`/security`)**: Detailed information about our security practices
- **Crisis Support (`/crisis`)**: Emergency resources and support contacts

## Performance Considerations

- **AI Model Performance**: The LLaMA 3.2 model can be resource-intensive. For optimal performance:
  - Use a machine with at least 16GB RAM
  - Consider a system with GPU acceleration
  - Adjust timeout thresholds in code if running on slower hardware
  - Use the built-in model switching to toggle between local LLaMA and cloud-based AI

## Deployment

To deploy the application:

1. Build the production bundle:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

For production deployment, consider:
- Using a managed service like Vercel or Netlify
- Setting up a dedicated Ollama server on a powerful instance
- Implementing a CDN for static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for session management
- Environment variables are used for sensitive data
- API routes are protected with authentication middleware
- End-to-end encryption for sensitive communications
- HIPAA and GDPR compliance measures
- Regular security audits

For full details on our security practices, visit the Security page at `/security`.

## Support

For help with NeuroSync:
- Visit our Help Center at `/help`
- Email support@neurosync.ai
- Open an issue in the repository

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- LLaMA team for the powerful AI model
- All contributors who have helped shape NeuroSync

---

Made with ❤️ by the NeuroSync Team 
