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

## Screenshots
<img width="1487" height="1308" alt="image" src="https://github.com/user-attachments/assets/f37b5d8f-37a8-40b9-b9fe-c6bec210e3e8" />
<img width="746" height="819" alt="image" src="https://github.com/user-attachments/assets/4bdc11e6-6a44-4a69-abbb-45aa0751d769" />
<img width="1501" height="1017" alt="image" src="https://github.com/user-attachments/assets/a69b8910-d418-46e0-aa01-7973b00081d0" />
<img width="1493" height="862" alt="image" src="https://github.com/user-attachments/assets/a0793fea-708c-4793-b6ef-872b1cb690c2" />
<img width="1180" height="1314" alt="image" src="https://github.com/user-attachments/assets/18e0d768-df0f-4ace-9691-62dd10abd6c1" />
<img width="1498" height="1136" alt="image" src="https://github.com/user-attachments/assets/b2beb68f-0b8b-4d8c-8d3d-5c3eb3b0f34c" />
<img width="687" height="721" alt="image" src="https://github.com/user-attachments/assets/54aee59a-7b9e-45ed-bc2e-804afc05192c" />
<img width="1498" height="679" alt="image" src="https://github.com/user-attachments/assets/a91f5ee3-0d7e-4fba-8204-31b3cd3bb64c" />
<img width="1460" height="1179" alt="image" src="https://github.com/user-attachments/assets/40c9cb82-3977-4fa5-a32a-96f001138de8" />

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

- Node.js (v16+)
- npm or yarn
- MongoDB (local installation)
- Nx CLI (`npm install -g nx`)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up MongoDB
   - Install MongoDB locally
   - Start MongoDB service
   - Database will be created automatically on first run

4. Build and run the application
   ```bash
   # Build all projects
   nx run-many --target=build --all
   
   # Start the desktop application
   nx serve client
   ```

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
