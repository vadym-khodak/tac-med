# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tac Med is a desktop application for tactical medicine knowledge testing based on the MARCH protocol. It features:
- User testing interface with timed tests (20 minutes)
- Administrator dashboard for managing questions and viewing results
- 60 questions divided into 6 blocks (10 questions each)
- Local MongoDB database for data storage
- Knowledge level assessment (Low, Beginner, Medium, High, Maximum)

## Commands

### Development
```bash
# Install all dependencies
npm run install:all

# Run both server and client concurrently
npm start

# Run server only
npm run start:server
# or
cd server && npm start

# Run client only  
npm run start:client
# or
cd client && npm start

# Build all applications
npm run build
```

### Code Quality
```bash
# Server
cd server
npm run format  # Format code with Biome
npm run lint    # Lint code with Biome

# Client
cd client
npm run format  # Format code with Biome
npm run lint    # Lint code with Biome
```

### Docker
```bash
# Run with Docker Compose
docker-compose up --build
```

## Architecture

### Tech Stack
- **Platform**: Pure Node.js with TypeScript
- **Frontend**: React with Vite, served on port 4200
- **Backend**: NestJS server on port 3000
- **Database**: MongoDB (local, port 27017)
- **Code Quality**: Biome for linting/formatting

### Project Structure
```
tac-med/
├── server/              # NestJS backend API
│   ├── src/
│   │   ├── admin/       # Admin endpoints
│   │   ├── auth/        # JWT authentication
│   │   ├── questions/   # Question management
│   │   ├── results/     # Test results storage
│   │   └── users/       # User management
│   ├── package.json
│   ├── webpack.config.js
│   └── Dockerfile
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/       # Main application pages
│   │   ├── components/  # Reusable UI components
│   │   └── services/    # API communication
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
└── docker-compose.yml   # Docker orchestration
```

### Key Architectural Patterns

1. **Module Organization (NestJS)**
   - Each feature has its own module with controller, service, schema, and DTOs
   - MongoDB schemas use Mongoose decorators
   - JWT authentication with roles-based access control

2. **Frontend Architecture**
   - React with TypeScript
   - API communication through axios
   - Route-based code splitting
   - Theme context for UI customization

3. **Database Schema**
   - Questions: block, question text, answers array, correct indices, media paths
   - Results: user name, test date, block scores, total score, incorrect questions list
   - Users: authentication and profile data

4. **Authentication Flow**
   - Admin access requires password (default: "12345")
   - JWT tokens for session management
   - Role-based guards for protected endpoints

### Important Configuration

1. **Biome Configuration** (biome.json)
   - 2 spaces indentation
   - Single quotes
   - Trailing commas
   - 100 character line width
   - No unused variables allowed
   - No explicit any types

2. **Server Endpoints**
   - Base URL: http://localhost:3000
   - CORS enabled for client origin
   - MongoDB connection string should be configured

3. **Client Configuration**  
   - Runs on http://localhost:4200
   - Vite dev server with HMR
   - Proxy configuration for API calls

### Development Notes

1. **Cyrillic Text Validation**
   - Full names must be 3 words in Cyrillic
   - Each word starts with capital letter
   - Minimum 3 characters per word

2. **Question Import Format**
   - JSON array with specific structure
   - Supports image paths and YouTube URLs
   - Block numbers 1-6 correspond to MARCH protocol sections

3. **Scoring System**
   - Each question worth 100%
   - Multiple correct answers split weight equally
   - 60% threshold for question to be considered correct
   - No penalty for wrong answers

4. **Initial Setup**
   - MongoDB must be running locally
   - Import questions via admin panel
   - Use comprehensive-questions.json from project root
