# StudyMate AI - Frontend

AI-powered interactive study tool built with React, TypeScript, and Tailwind CSS.

## About

This is the frontend for StudyMate AI, an educational tool that helps students learn through:
- **Interactive Chat**: Q&A with AI teacher
- **Audio Dialogue**: Teacher-student conversations
- **Video Summaries**: Exam-oriented content summaries

## Tech Stack

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + shadcn/ui
- React Router
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```sh
# Step 1: Navigate to the project directory
cd study-buddy-ai-00-main

# Step 2: Install dependencies
npm install

# Step 3: Start the development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Backend Connection

This frontend connects to the Django backend API running on `http://127.0.0.1:8000`

Make sure the backend server is running before starting the frontend.

## Technologies Used

- **Vite** - Fast build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first styling
- **React Router** - Navigation
- **Lucide React** - Icons

## Features

- 💬 Interactive Chat Interface
- 🎭 Audio Dialogue Generation
- 📹 Video Summaries for Exam Prep
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive Design

## Project Structure

```
src/
├── components/        # React components
│   ├── ChatInterface.tsx
│   ├── AudioDialogue.tsx
│   ├── VideoSummaries.tsx
│   └── ui/           # shadcn/ui components
├── lib/
│   ├── api.ts        # Backend API calls
│   └── utils.ts      # Utilities
├── pages/
│   └── Index.tsx     # Main page
└── main.tsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Author
