# Tac Med

A desktop application for tactical medicine knowledge testing based on the MARCH protocol. The application allows users to take tests, stores results in a local database, determines knowledge levels, and provides administrators with question management capabilities.

## Features

### User Mode
- **Name Validation**: Full name input with Cyrillic validation (3 words, each starting with capital letter, minimum 3 characters each)
- **MARCH Protocol Testing**: 6 blocks of 10 questions each (60 questions total)
- **Timed Testing**: 20-minute countdown timer with automatic completion
- **Interactive Questions**: Radio buttons for single answers, checkboxes for multiple answers
- **Real-time Feedback**: Answer highlighting (green for correct, red for incorrect)
- **Knowledge Level Assessment**: 5 levels based on performance (Low, Beginner, Medium, High, Maximum)
- **Results Display**: Detailed breakdown by blocks and overall performance

### Administrator Mode
- **Password Protected Access**: Default password "12345" with change capability
- **Results Management**: View all test results with filtering and sorting
- **Excel Export**: Export results to Excel format
- **Question Management**: Import questions via JSON format
- **Media Support**: Add images (JPG) or YouTube videos to questions
- **Question Browser**: View all questions with correct answers highlighted

### Test Blocks
1. **General Questions** (Загальні питання)
2. **Massive Hemorrhage** (Масивна кровотеча)
3. **Airway** (Дихальні шляхи)
4. **Respiration** (Дихання)
5. **Circulation** (Кровообіг)
6. **Hypothermia/Head Injury** (Гіпотермія/травма голови)

## Tech Stack

- **Platform**: Windows 7, 10, 11
- **Language**: TypeScript
- **Monorepo Tool**: Nx
- **Frontend**: Desktop GUI application
- **Database**: MongoDB (local)
- **Image Format**: JPG (centered, adaptive size)
- **Video Support**: YouTube integration

## Knowledge Levels

| Score Range | Level |
|-------------|-------|
| 0-20% | Low (Низький) |
| 21-50% | Beginner (Початковий) |
| 51-80% | Medium (Середній) |
| 81-95% | High (Високий) |
| 96-100% | Maximum (Максимальний) |

## Database Schema

### Questions Collection
```json
{
  "id": "INTEGER (auto-increment)",
  "block": "INTEGER (1-6)",
  "question": "TEXT",
  "answers": ["Answer A", "Answer B", "Answer C", "Answer D"],
  "correct": [0, 2],
  "image_path": "images/example.jpg",
  "youtube_url": "https://youtu.be/example"
}
```

### Results Collection
```json
{
  "id": "INTEGER (primary key)",
  "full_name": "Прізвище Ім'я По-батькові",
  "test_date": "2025-07-25 10:30:00",
  "block_scores": {"1": 80, "2": 60, "3": 100, "4": 70, "5": 50, "6": 90},
  "total_score": 75.00,
  "incorrect_list": ["Question text 1", "Question text 2"]
}
```

## Scoring System

- Each question worth 100%
- Multiple correct answers split weight equally
- Question considered correct if user scores ≥60% of question weight
- No penalty for wrong answers, only positive scoring for correct ones

**Example**: 
- Correct answers: [0, 1, 3] (each worth 33.3%)
- User selects: [0, 1] → 66.6% → ✅ Correct
- User selects: [1, 2] → 33.3% → ❌ Incorrect

## Project Structure

This is an Nx monorepo consisting of several TypeScript-based applications and libraries:

### Apps
- **apps/server** - Backend API server
- **apps/client** - Desktop GUI application
- **apps/admin** - Administrator interface

### Libraries
- **libs/shared/types** - Shared TypeScript interfaces and types
- **libs/shared/utils** - Common utilities and helpers
- **libs/database** - MongoDB connection and models
- **libs/ui/components** - Shared UI components

## Getting Started

### Prerequisites

- Node.js v23 (required)
- npm or yarn
- MongoDB (local installation)
- Nx CLI (`npm install -g nx`)

### Installation and Running

#### macOS

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js v23**
   ```bash
   # Using Homebrew
   brew install node@23
   
   # Or using Node Version Manager (nvm)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 23
   nvm use 23
   ```

3. **Install and run MongoDB locally**
   ```bash
   # Install MongoDB using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   
   # Start MongoDB service
   brew services start mongodb-community@7.0
   
   # Verify MongoDB is running
   mongosh --eval "db.version()"
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the application**
   ```bash
   # In terminal 1 - Start the backend server
   nx serve server
   
   # In terminal 2 - Start the frontend client
   nx serve client
   ```

   The server will run on http://localhost:3333 and the client on http://localhost:4200

#### Linux (Ubuntu/Debian)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js v23**
   ```bash
   # Using NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_23.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Or using Node Version Manager (nvm)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install 23
   nvm use 23
   ```

3. **Install and run MongoDB locally**
   ```bash
   # Import MongoDB public key
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   
   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   
   # Update packages and install MongoDB
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB service
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Verify MongoDB is running
   mongosh --eval "db.version()"
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the application**
   ```bash
   # In terminal 1 - Start the backend server
   nx serve server
   
   # In terminal 2 - Start the frontend client
   nx serve client
   ```

   The server will run on http://localhost:3333 and the client on http://localhost:4200

#### Windows

1. **Clone the repository**
   ```powershell
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js v23**
   - Download Node.js v23 from [https://nodejs.org/en/download/prebuilt-installer](https://nodejs.org/en/download/prebuilt-installer)
   - Select version 23.x.x for Windows
   - Run the installer and follow the installation wizard
   - Verify installation:
     ```powershell
     node --version
     npm --version
     ```

3. **Install and run MongoDB locally**
   - Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Choose Windows x64 platform
   - Run the MSI installer
   - During installation:
     - Choose "Complete" setup
     - Install MongoDB as a Windows Service
     - Keep "Run service as Network Service user" selected
   - MongoDB will start automatically as a Windows service
   - Verify MongoDB is running:
     ```powershell
     # Open Command Prompt as Administrator
     net start MongoDB
     ```

4. **Install dependencies**
   ```powershell
   npm install
   ```

5. **Run the application**
   ```powershell
   # In PowerShell terminal 1 - Start the backend server
   nx serve server
   
   # In PowerShell terminal 2 - Start the frontend client
   nx serve client
   ```

   The server will run on http://localhost:3333 and the client on http://localhost:4200

### Initial Setup

1. **Import test questions** (required for first run)
   - Navigate to http://localhost:4200
   - Click "Увійти як адміністратор" (Login as administrator)
   - Use default password: `12345`
   - Go to "Імпортувати питання" (Import questions)
   - Upload the `comprehensive-questions.json` file from the project root

2. **Test the application**
   - Return to main menu
   - Enter your full name in Cyrillic (e.g., "Чернобай Степан Бандерович")
   - Click "Розпочати тестування" to start the test

### Troubleshooting

#### MongoDB Connection Issues
- **macOS/Linux**: Check if MongoDB is running with `ps aux | grep mongod`
- **Windows**: Check Windows Services for "MongoDB" service status
- Ensure MongoDB is listening on default port 27017

#### Node.js Version Issues
- Ensure you're using Node.js v23 by running `node --version`
- If using nvm, set default version: `nvm alias default 23`

#### Port Already in Use
- If port 3333 or 4200 is already in use:
  ```bash
  # Kill process on port (macOS/Linux)
  lsof -ti:3333 | xargs kill -9
  lsof -ti:4200 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :3333
  taskkill /PID <PID> /F
  ```

#### Nx Command Not Found
- Install Nx globally: `npm install -g nx`
- Or use npx: `npx nx serve server`

## Development Guidelines

### Nx Commands

- Generate a new app:
  ```bash
  nx g @nx/node:app my-app
  ```

- Generate a new library:
  ```bash
  nx g @nx/node:lib my-lib
  ```

- Run tests:
  ```bash
  nx test my-app
  nx run-many --target=test --all
  ```

- Build:
  ```bash
  nx build my-app
  nx run-many --target=build --all
  ```

- Analyze dependencies:
  ```bash
  nx graph
  ```

### Code Standards
- Follow TypeScript best practices
- Use proper validation for Cyrillic text input
- Implement proper error handling for database operations
- Follow desktop application UI/UX guidelines

### Question Import Format

Questions can be imported via JSON in the following format:

```json
[
  {
    "question": "What is hemorrhage?",
    "answers": ["Temperature rise", "Blood loss", "Shortness of breath", "Loss of consciousness"],
    "correct": [1],
    "block": 2,
    "image_path": "images/bleeding.jpg",
    "youtube_url": ""
  },
  {
    "question": "Actions for wounds?",
    "answers": ["Stop bleeding", "Check consciousness", "Call friend", "Run away"],
    "correct": [0, 1],
    "block": 1,
    "image_path": "",
    "youtube_url": "https://youtu.be/example"
  }
]
```

## Security Features

- Password protection for administrator access
- Input validation for all user data
- Secure local data storage
- Prevention of result tampering

## Contributing

1. Create a new branch following the naming convention
2. Make your changes
3. Ensure all tests pass (`nx affected:test`)
4. Submit a pull request for review

## License

[MIT License](LICENSE)