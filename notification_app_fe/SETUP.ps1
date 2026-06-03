# Campus Notifications System - PowerShell Setup Script
# This script installs Node.js and runs the application

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Campus Notifications System - Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to download file
function Download-File {
    param(
        [string]$Url,
        [string]$Path
    )
    
    try {
        Write-Host "Downloading from: $Url" -ForegroundColor Yellow
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $Url -OutFile $Path -UseBasicParsing
        Write-Host "Download complete: $Path" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Download failed: $_" -ForegroundColor Red
        return $false
    }
}

# Step 1: Check if Node.js is installed
Write-Host "[1/4] Checking Node.js installation..." -ForegroundColor Cyan
$nodeCheck = $null
try {
    $nodeCheck = node --version 2>$null
    if ($nodeCheck) {
        Write-Host "Node.js is already installed: $nodeCheck" -ForegroundColor Green
    }
}
catch {
    $nodeCheck = $null
}

if (-not $nodeCheck) {
    Write-Host "[1/4] Node.js not found. Installing..." -ForegroundColor Yellow
    
    # Create temp directory
    $tempDir = "$env:TEMP\node_installer"
    if (-not (Test-Path $tempDir)) {
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $installerPath = "$tempDir\node-v20.11.0-x64.msi"
    
    # Download Node.js LTS
    Write-Host "Downloading Node.js LTS..." -ForegroundColor Yellow
    $downloadSuccess = Download-File -Url "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -Path $installerPath
    
    if ($downloadSuccess -and (Test-Path $installerPath)) {
        Write-Host "Running Node.js installer..." -ForegroundColor Yellow
        Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", "`"$installerPath`"", "/quiet" -Wait -NoNewWindow
        
        # Refresh environment variables
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "Node.js installation complete!" -ForegroundColor Green
        
        # Verify installation
        $nodeCheck = $null
        try {
            $nodeCheck = node --version 2>$null
            Write-Host "Verified: $nodeCheck" -ForegroundColor Green
        }
        catch {
            Write-Host "Node.js verification failed. You may need to restart PowerShell." -ForegroundColor Red
        }
    }
    else {
        Write-Host "ERROR: Could not download Node.js" -ForegroundColor Red
        Write-Host "Please download and install manually from: https://nodejs.org/" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 2: Verify versions
Write-Host ""
Write-Host "[2/4] Verifying installations..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "Node: $nodeVersion" -ForegroundColor Green
    Write-Host "npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Could not verify Node.js/npm installation" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "[3/4] Installing project dependencies..." -ForegroundColor Cyan
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 4: Start development server
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "[4/4] Starting development server..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
