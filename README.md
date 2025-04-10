# NeuroSync - AI Mental Health Companion

NeuroSync is an advanced AI-powered mental health platform that provides personalized support, emotional analysis, and crisis intervention. Built with Next.js, TailwindCSS, and integrated with advanced AI technologies.

## Features

- 🤖 AI Therapy Chat powered by LLaMA 3
- 📊 Real-time Emotion Analysis
- 🆘 24/7 Crisis Support
- 🎯 Personalized Mental Health Guidance
- 📱 Responsive Design with Dark Mode
- 🔒 Secure User Authentication
- 📈 Progress Tracking

## AI Integration

NeuroSync uses SingularityNET AI services for intelligent conversation and emotional analysis:

- **NLP Processing Pipeline**: User messages are processed through a multi-step pipeline:
  1. Sentiment analysis to detect emotional state
  2. Context-aware AI response generation
  3. Personalized recommendations based on emotional state

- **Recommendation Engine**: The AI suggests relevant:
  - Mindfulness exercises
  - Mental health resources
  - Check-in activities

- **Real-time Emotional Tracking**: Analysis of user messages to identify emotional patterns and provide targeted support.

To use the AI features, you need to:
1. Sign up for a SingularityNET API key
2. Add your API key to the `.env.local` file
3. Restart the application

## SingularityNET API Key

To use the real AI features in NeuroSync, you need to obtain a SingularityNET API key:

1. **Register on SingularityNET Platform**:
   - Visit [SingularityNET](https://singularitynet.io/) and create an account
   - Navigate to the Developer Portal and register as a developer

2. **Create a New API Key**:
   - Once logged in, go to your developer dashboard
   - Click on "Create New API Key"
   - Name your key (e.g., "NeuroSync Integration")
   - Select the services you need (chat, sentiment analysis, recommendation engine)

3. **Configure the Application**:
   - Copy your API key from the dashboard
   - Create a `.env.local` file based on the `.env.local.example` template
   - Paste your API key as the value for `NEXT_PUBLIC_SINGULARITYNET_API_KEY`

4. **Restart Your Application**:
   ```bash
   npm run dev
   ```

**Note for Development**: If you don't have an API key yet, NeuroSync will use a fallback demo mode with simulated AI responses when running in development mode.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher)
- MongoDB (v4.0.0 or higher)

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
NEXT_PUBLIC_SINGULARITYNET_API_KEY=your_singularitynet_api_key
NEXT_PUBLIC_SINGULARITYNET_API_URL=https://api.singularitynet.io/v1
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
├── pages/             # Next.js pages and API routes
├── public/            # Static assets
├── styles/           # Global styles and Tailwind config
├── lib/              # Utility functions and database connection
└── package.json      # Project dependencies and scripts
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
  - LLaMA 3 for conversational AI
  - Custom emotion analysis algorithms
  - Real-time mood detection

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in:
- localStorage for "Remember Me" functionality
- sessionStorage for regular sessions

## Database Configuration

The application uses MongoDB for data storage. Ensure your MongoDB connection string is properly configured in the `.env.local` file.

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

## Support

For support, email support@neurosync.ai or open an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- MongoDB team for the robust database solution
- All contributors who have helped shape NeuroSync

---

Made with ❤️ by the NeuroSync Team 
