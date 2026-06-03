# Quick Start Guide - Campus Notifications System

## Prerequisites
- Windows OS with PowerShell
- Internet connection (to download Node.js)

## Automated Setup (Recommended)

### Option 1: PowerShell Script (Recommended)
1. Open PowerShell in the `notification_app_fe` folder
2. Run the setup script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File SETUP.ps1
   ```
3. The script will:
   - Check for Node.js installation
   - Download and install Node.js LTS (if needed)
   - Install npm dependencies
   - Start the development server on http://localhost:3000

### Option 2: Batch Script
1. Double-click `SETUP.bat` in the project root folder
2. Follow the prompts to complete installation

### Option 3: Manual Setup
If you prefer manual setup:

1. Install Node.js from https://nodejs.org/ (LTS version recommended)
2. Open PowerShell in the project folder:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

## What to expect

**During Setup:**
- Node.js installer will run (MSI installation)
- npm will download and install packages (~500MB)
- Vite dev server will start automatically

**After Startup:**
- Application opens at: http://localhost:3000
- Hot reload enabled (auto-refresh on code changes)
- Logs appear in terminal

## Troubleshooting

### PowerShell Execution Policy Error
If you get an execution policy error, run:
```powershell
powershell -ExecutionPolicy Bypass -File SETUP.ps1
```

### Port 3000 Already in Use
If port 3000 is busy:
```powershell
npm run dev -- --port 3001
```

### Node.js Won't Update PATH
Restart PowerShell after installation completes.

### npm install Fails
Try clearing npm cache:
```powershell
npm cache clean --force
npm install
```

## Project Structure

```
notification_app_fe/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # Context API state
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── middleware/      # Logging middleware
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Main App component
│   └── theme.js         # Material UI theme
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── index.html           # HTML template
```

## Environment Variables

Create a `.env` file (copy from `.env.example`):
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_LOG_LEVEL=info
```

## Features

- **Priority Inbox**: Intelligent notification sorting
- **Comprehensive Logging**: All actions logged to sessionStorage
- **Responsive Design**: Works on desktop, tablet, mobile
- **Real-time Updates**: WebSocket support ready
- **Dark/Light Theme**: Material UI theming

## Development Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors (if configured)
npm run type-check
```

## Documentation

For more detailed information, see:
- [README.md](./README.md) - Complete system documentation
- [notification_system_design.md](./notification_system_design.md) - Architecture and design
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify Node.js installation: `node --version`
4. Verify npm installation: `npm --version`

---

**Ready to start?** Run the PowerShell script and you're good to go!

```powershell
powershell -ExecutionPolicy Bypass -File SETUP.ps1
```
