# ViddyScribe - AI Video Accessibility

ViddyScribe is a premium web application that automatically generates contextual audio descriptions for visual scenes in videos, making digital media natively accessible to blind and visually impaired audiences.

This project was built to showcase the power of AI in solving real-world accessibility issues, drawing inspiration from award-winning accessibility solutions while leveraging the cutting-edge **Google Gemini 2.0 Flash Multimodal API**.

## 🚀 Features
- **AI-Powered Scene Context**: Extracts visual information dynamically through Gemini 2.0 Flash video upload.
- **Client-Side Text-To-Speech (TTS)**: Leverages the Browser Web Speech API to seamlessly speak the descriptions aloud, providing an integrated screen reader experience without relying on expensive audio generation APIs.
- **Synchronous Accessibility Timeline**: Visual markers on the custom video player map out exactly when and what audio descriptions will play.
- **Sleek, Dynamic Interface**: Glassmorphism, deep dark-mode space gradients, and engaging micro-animations create a "wow" factor usually absent from basic accessibility tools.
- **Real-Time YouTube Simulator & Parallel Video Demos**: Easily demo the application's capabilities with built-in side-by-side video comparisons and YouTube API integration flows.

## 🛠 Tech Stack
- **Frontend / Fullstack Framework**: Next.js 15 (React, App Router)
- **Styling**: Vanilla CSS Modules (Custom scalable design system) 
- **AI Processing Engine**: `@google/genai` (Google Gemini 2.0 Flash)
- **Accessibility Engine**: HTML5 Web Speech API
- **Deployment**: Vercel Ready

## 🏃‍♂️ Getting Started

### 1. Requirements
- Node.js `18.x` or later
- An active [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 2. Environment Setup
Create a `.env.local` file in the root of the project to add your API key:
```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Build & Run
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000` to interact with the demo!

## 💡 The "Why" This Project?
With over 2.2 billion people globally experiencing some form of vision impairment (WHO data), access to video content without built-in audio description is a systemic barrier. ViddyScribe uses AI to seamlessly close this accessibility gap.
