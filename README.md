# Tac Med

A desktop application for tactical medicine knowledge testing based on the MARCH protocol. The application allows users to take tests, stores results in a local database, determines knowledge levels, and provides administrators with question management capabilities.

## Features

### User Mode
- **Name Validation**: Full name input with Cyrillic validation (3 words, each starting with capital letter, minimum 3 characters each)
- **MARCH Protocol Testing**: 6 blocks of 10 questions each (60 questions total)
- **Timed Testing**: 20-minute countdown timer with automatic completion
- **Interactive Questions**: Radio buttons for single answers, checkboxes for multiple answers
- **Multiple Choice Indicator**: Visual hint "(Виберіть всі правильні відповіді)" for questions with multiple correct answers
- **Question Navigation**: Previous/Next buttons to review and change answers before final submission
- **Answer Persistence**: Selected answers are saved when navigating between questions
- **Real-time Feedback**: Answer highlighting after saving (green for correct, red for incorrect)
- **Knowledge Level Assessment**: 5 levels based on performance (Low, Beginner, Medium, High, Maximum)
- **Results Display**: Detailed breakdown by blocks and overall performance with rounded percentages

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
- **Frontend**: React with Vite
- **Backend**: NestJS with Express
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

This is a Node.js project with two separate applications:

### Applications
- **server/** - NestJS backend API server
- **client/** - React frontend application

## Getting Started

### Prerequisites

- Node.js v18 or higher (recommended: v20+)
- npm or yarn
- MongoDB (local installation)

### Installation and Running

#### Running with Docker Compose (Recommended)

Docker Compose provides the easiest way to run the application with all dependencies pre-configured.

### Installing Docker and Docker Compose

#### macOS

1. **Install Docker Desktop for Mac**
   - Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Double-click `Docker.dmg` to open the installer
   - Drag Docker.app to the Applications folder
   - Start Docker Desktop from Applications
   - Docker Compose is included with Docker Desktop

2. **Verify installation**
   ```bash
   docker --version
   docker-compose --version
   ```

#### Linux (Ubuntu/Debian)

1. **Install Docker**
   ```bash
   # Update package index
   sudo apt-get update

   # Install dependencies
   sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

   # Add Docker's official GPG key
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   # Add Docker repository
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Install Docker Engine
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io

   # Add your user to docker group (to run without sudo)
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Install Docker Compose**
   ```bash
   # Download Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   # Apply executable permissions
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Verify installation**
   ```bash
   docker --version
   docker-compose --version
   ```

#### Windows

1. **Install Docker Desktop for Windows**
   - Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Run `Docker Desktop Installer.exe`
   - Follow the installation wizard
   - Docker Compose is included with Docker Desktop
   - **Important**: Docker Desktop requires WSL 2 (Windows Subsystem for Linux)

2. **Enable WSL 2 (if not already enabled)**
   ```powershell
   # Run PowerShell as Administrator
   wsl --install

   # Restart your computer
   ```

3. **Verify installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

### Running the Application with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Create environment file (optional)**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env file with your configurations (if needed)
   ```

3. **Configure environment (if needed)**
   ```bash
   # The docker-compose.yml contains hardcoded IP addresses (192.168.88.87)
   # You may need to update these to match your local network or use localhost
   # Edit docker-compose.yml and replace:
   # - ORIGIN_URL=http://192.168.88.87:4200 → ORIGIN_URL=http://localhost:4200
   # - VITE_API_URL=http://192.168.88.87:3000 → VITE_API_URL=http://localhost:3000
   ```

4. **Build and run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build

   # Or run in detached mode (background)
   docker-compose up -d --build
   ```

5. **Access the application**
   - Client application: http://localhost:4200
   - Server API: http://localhost:3000
   - MongoDB: localhost:27018 (mapped from container's 27017)
   
   **Note**: By default, the application is only accessible from the local machine. To make it available on your local network, see the "Local Network Access" section below.

6. **Stop the application**
   ```bash
   # Stop all services
   docker-compose down

   # Stop and remove volumes (includes database data)
   docker-compose down -v
   ```

### Docker Compose Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server
docker-compose logs -f client

# Restart a specific service
docker-compose restart server

# Execute commands in running container
docker-compose exec server sh
docker-compose exec mongo mongosh

# Rebuild without cache
docker-compose build --no-cache
```

### Local Network Access

To make the application accessible from other devices on your local network (e.g., for testing on different computers or mobile devices), follow these platform-specific instructions:

#### Linux

1. **Get your local IP address**
   ```bash
   hostname -I | awk '{print $1}'
   # or
   ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1
   ```

2. **Update configuration files**
   
   For Docker setup, edit `docker-compose.yml`:
   ```yaml
   # Replace the hardcoded IPs with your local IP address
   ORIGIN_URL: http://YOUR_LOCAL_IP:4200
   VITE_API_URL: http://YOUR_LOCAL_IP:3000
   ```
   
   For manual setup, create/update `.env` files:
   ```bash
   # server/.env
   ORIGIN_URL=http://YOUR_LOCAL_IP:4200
   
   # client/.env
   VITE_API_URL=http://YOUR_LOCAL_IP:3000
   ```

3. **Configure firewall (if using UFW)**
   ```bash
   # Allow ports for the application
   sudo ufw allow 3000/tcp
   sudo ufw allow 4200/tcp
   
   # If using Docker, also allow MongoDB port
   sudo ufw allow 27018/tcp
   
   # Check firewall status
   sudo ufw status
   ```

4. **Restart the application**
   ```bash
   # For Docker
   docker-compose down
   docker-compose up --build
   
   # For manual setup
   # Restart both server and client
   ```

5. **Access from other devices**
   - Use `http://YOUR_LOCAL_IP:4200` from any device on the same network

#### macOS

1. **Get your local IP address**
   ```bash
   # Method 1: Using ifconfig
   ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
   
   # Method 2: Using System Preferences
   # Go to System Preferences → Network → Select your active connection → IP address is shown
   
   # Method 3: For specific interface (e.g., Wi-Fi)
   ipconfig getifaddr en0  # For Wi-Fi
   ipconfig getifaddr en1  # For Ethernet (may vary)
   ```

2. **Update configuration files** (same as Linux step 2)

3. **Configure macOS Firewall**
   ```bash
   # macOS firewall is usually configured through System Preferences
   # Go to: System Preferences → Security & Privacy → Firewall
   
   # Or use command line (requires admin privileges)
   # Add Node.js to firewall exceptions
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
   
   # If using specific Node version via nvm, adjust the path accordingly
   # Example: ~/.nvm/versions/node/v20.0.0/bin/node
   ```

4. **Alternative: Disable firewall temporarily (for testing only)**
   ```bash
   # Turn off firewall
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
   
   # Remember to turn it back on after testing
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
   ```

5. **Restart the application** (same as Linux step 4)

6. **Access from other devices**
   - Use `http://YOUR_LOCAL_IP:4200` from any device on the same network

#### Windows

1. **Get your local IP address**
   ```powershell
   # Method 1: Using ipconfig
   ipconfig | findstr /i "IPv4"
   
   # Method 2: Using PowerShell
   (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi).IPAddress
   # or for Ethernet
   (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet).IPAddress
   
   # Method 3: Using GUI
   # Settings → Network & Internet → Properties → IPv4 address
   ```

2. **Update configuration files** (same as Linux step 2)

3. **Configure Windows Firewall**
   
   Using PowerShell (Run as Administrator):
   ```powershell
   # Add inbound rules for the application ports
   New-NetFirewallRule -DisplayName "Tac-Med Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
   New-NetFirewallRule -DisplayName "Tac-Med Client" -Direction Inbound -Protocol TCP -LocalPort 4200 -Action Allow
   
   # If using Docker, also allow MongoDB port
   New-NetFirewallRule -DisplayName "Tac-Med MongoDB" -Direction Inbound -Protocol TCP -LocalPort 27018 -Action Allow
   
   # Check if rules were created
   Get-NetFirewallRule -DisplayName "Tac-Med*"
   ```
   
   Or using Windows Defender Firewall GUI:
   1. Open Windows Defender Firewall with Advanced Security
   2. Click "Inbound Rules" → "New Rule"
   3. Select "Port" → "TCP" → Enter port numbers (3000, 4200, 27018)
   4. Select "Allow the connection"
   5. Apply to all profiles (Domain, Private, Public)
   6. Give it a name (e.g., "Tac-Med Server")

4. **Restart the application**
   ```powershell
   # For Docker
   docker-compose down
   docker-compose up --build
   
   # For manual setup
   # Stop running processes (Ctrl+C) and restart
   npm run start
   ```

5. **Access from other devices**
   - Use `http://YOUR_LOCAL_IP:4200` from any device on the same network

#### Important Security Notes

1. **Firewall Rules**: The firewall rules above open ports to all network interfaces. For better security, you can restrict access to specific network interfaces or IP ranges.

2. **Production Environment**: These instructions are for development/testing. For production deployment, use proper security measures including:
   - HTTPS/SSL certificates
   - Reverse proxy (nginx/Apache)
   - Restricted firewall rules
   - Environment-specific configurations

3. **Temporary Access**: If you only need temporary access, remember to:
   - Remove or disable firewall rules when done
   - Revert configuration changes
   - Use localhost bindings for development

### Quick Setup - Bind to All Interfaces

For development/testing, you can configure the application to listen on all network interfaces without specifying IP addresses:

**Warning**: This method is less secure and should only be used in trusted networks.

1. **For Docker setup**, modify `docker-compose.yml`:
   ```yaml
   # Change these lines
   ORIGIN_URL: http://0.0.0.0:4200
   VITE_API_URL: http://0.0.0.0:3000
   ```

2. **For manual setup**, you may need to modify the server configuration to bind to `0.0.0.0` instead of `localhost`.

3. **Then access the application** using your machine's IP address from any device on the network.

### Troubleshooting Network Access

1. **Connection Refused**
   - Verify the IP address is correct
   - Check if the application is running
   - Ensure firewall rules are properly configured
   - Try disabling firewall temporarily to isolate the issue

2. **Cannot Find Server**
   - Ensure both devices are on the same network
   - Check if the IP address hasn't changed (dynamic IP)
   - Verify no VPN is interfering with local network access

3. **Port Already in Use**
   - Another application might be using the ports
   - Check with `netstat -tulnp` (Linux), `lsof -i :PORT` (macOS), or `netstat -an` (Windows)

### Troubleshooting Docker

1. **Port already in use**
   ```bash
   # Check what's using the port
   # macOS/Linux
   lsof -i :3000
   lsof -i :80

   # Windows
   netstat -ano | findstr :3000
   netstat -ano | findstr :80
   ```

2. **Permission denied errors (Linux)**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER

   # Log out and back in, or run
   newgrp docker
   ```

3. **Docker Desktop not starting (Windows)**
   - Ensure virtualization is enabled in BIOS
   - Ensure WSL 2 is properly installed
   - Try running Docker Desktop as Administrator

4. **Clear Docker cache**
   ```bash
   # Remove all stopped containers
   docker container prune

   # Remove all unused images
   docker image prune -a

   # Remove all unused volumes
   docker volume prune

   # Remove everything (careful!)
   docker system prune -a --volumes
   ```

### Manual Installation (Alternative)

#### macOS

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js**
   ```bash
   # Using Homebrew (installs latest LTS)
   brew install node

   # Or using Node Version Manager (nvm) - recommended
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install --lts
   nvm use --lts
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
   npm run install:all
   ```

5. **Run the application**
   ```bash
   # Run both server and client concurrently
   npm run build
   npm run start

   # Or run individually:
   # Terminal 1 - Start the backend server
   npm run start:server

   # Terminal 2 - Start the frontend client
   npm run start:client
   ```

   The server will run on http://localhost:3000 and the client on http://localhost:4200

#### Linux (Ubuntu/Debian)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js**
   ```bash
   # Using NodeSource repository (LTS version)
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Or using Node Version Manager (nvm) - recommended
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   nvm use --lts
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
   npm run install:all
   ```

5. **Run the application**
   ```bash
   # Run both server and client concurrently
   npm run build
   npm run start

   # Or run individually:
   # Terminal 1 - Start the backend server
   npm run start:server

   # Terminal 2 - Start the frontend client
   npm run start:client
   ```

   The server will run on http://localhost:3000 and the client on http://localhost:4200

#### Windows

1. **Clone the repository**
   ```powershell
   git clone https://github.com/yourusername/tac-med.git
   cd tac-med
   ```

2. **Install Node.js**
   - Download Node.js LTS from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS version (recommended)
   - Run the installer and follow the installation wizard
   - Verify installation:
     ```powershell
     node --version  # Should show v18.0.0 or higher
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
   # Run both server and client concurrently
   npm run build
   npm run start

   # Or run individually:
   # Terminal 1 - Start the backend server
   npm run start:server

   # Terminal 2 - Start the frontend client
   npm run start:client
   ```

   The server will run on http://localhost:3000 and the client on http://localhost:4200

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
- Ensure you're using Node.js v18 or higher by running `node --version`
- If using nvm, set default version: `nvm alias default lts/*`

#### Port Already in Use
- If port 3000 or 4200 is already in use:
  ```bash
  # Kill process on port (macOS/Linux)
  lsof -ti:3000 | xargs kill -9
  lsof -ti:4200 | xargs kill -9

  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Common Issues

#### Multiple Answer Selection Not Working
- The test interface supports both single and multiple answer selection
- Questions with multiple correct answers will show checkboxes
- Questions with single correct answer will show radio buttons
- A visual hint "(Виберіть всі правильні відповіді)" appears for multiple-choice questions

#### Answers Not Persisting Between Questions
- Answers are automatically saved when you click "Зберегти відповідь"
- You can navigate between questions using "Попереднє питання" and "Наступне питання" buttons
- Your selections will be maintained as you navigate

#### Percentage Display Issues
- All percentages are rounded to whole numbers (no decimal places)
- This applies to both the admin dashboard and test results

#### Docker Network Issues
- If you see connection errors, ensure the IP addresses in docker-compose.yml match your setup
- Replace hardcoded IPs (192.168.88.87) with localhost for local development
- Restart Docker containers after making changes to docker-compose.yml

#### Build Errors
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure all services are stopped before rebuilding

## Development Guidelines

### Build Commands

- Build all applications:
  ```bash
  npm run build
  ```

- Build server only:
  ```bash
  npm run build:server
  ```

- Build client only:
  ```bash
  npm run build:client
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
3. Ensure code quality standards are met
4. Submit a pull request for review

## License

[MIT License](LICENSE)
