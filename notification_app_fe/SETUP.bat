@echo off
REM Campus Notifications System - Setup Script
REM This script will download and install Node.js, then install dependencies and run the app

echo.
echo ========================================
echo Campus Notifications System Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [1/3] Node.js not found. Downloading Node.js LTS...
    
    REM Create temp folder
    if not exist "%TEMP%\node_setup" mkdir "%TEMP%\node_setup"
    
    REM Download Node.js LTS (using PowerShell to download)
    powershell -Command "Write-Host 'Downloading Node.js LTS...' -ForegroundColor Cyan; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi' -OutFile '%TEMP%\node_setup\node-installer.msi' -ErrorAction SilentlyContinue; if (Test-Path '%TEMP%\node_setup\node-installer.msi') { Write-Host 'Download complete!' -ForegroundColor Green } else { Write-Host 'Download failed! Please visit https://nodejs.org/ and install Node.js manually.' -ForegroundColor Red; exit 1 }"
    
    if exist "%TEMP%\node_setup\node-installer.msi" (
        echo [1/3] Installing Node.js...
        msiexec.exe /i "%TEMP%\node_setup\node-installer.msi" /quiet
        timeout /t 30 /nobreak
        
        REM Refresh PATH
        setx PATH "%PATH%;C:\Program Files\nodejs"
        set "PATH=%PATH%;C:\Program Files\nodejs"
    )
)

REM Check Node.js version
echo [2/3] Checking Node.js installation...
node --version
npm --version

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js installation failed. Please download from https://nodejs.org/
    pause
    exit 1
)

REM Install dependencies
echo.
echo [3/3] Installing project dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit 1
)

REM Start dev server
echo.
echo ========================================
echo Starting development server...
echo ========================================
echo.
echo The application will open in your browser at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
