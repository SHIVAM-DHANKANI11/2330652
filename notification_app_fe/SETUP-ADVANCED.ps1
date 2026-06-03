# Campus Notifications System - Advanced Setup Script
# Uses portable Node.js to avoid PATH issues

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Campus Notifications System - Setup v2" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$nodeDir = Join-Path $scriptDir "node-portable"
$nodePath = Join-Path $nodeDir "node.exe"
$npmPath = Join-Path $nodeDir "npm.cmd"

# Step 1: Check if Node.js is already installed globally
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Cyan
$hasNode = $false
$nodeExe = $null

try {
    $version = & node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Node.js found globally: $version" -ForegroundColor Green
        $hasNode = $true
        $nodeExe = (Get-Command node).Source
    }
}
catch {
    # Node not found globally
}

# If no global Node.js, check for portable
if (-not $hasNode -and (Test-Path $nodePath)) {
    Write-Host "[OK] Portable Node.js found" -ForegroundColor Green
    $hasNode = $true
}

# If still no Node.js, download portable version
if (-not $hasNode) {
    Write-Host "[2/5] Downloading portable Node.js..." -ForegroundColor Yellow
    
    if (-not (Test-Path $nodeDir)) {
        New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null
    }
    
    $zipPath = Join-Path $env:TEMP "node-portable.zip"
    $downloadUrl = "https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip"
    
    try {
        Write-Host "Downloading from: $downloadUrl" -ForegroundColor Yellow
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing -TimeoutSec 60
        Write-Host "[OK] Download complete" -ForegroundColor Green
        
        Write-Host "[3/5] Extracting Node.js..." -ForegroundColor Yellow
        
        # Extract to a temp location first
        $tempExtractDir = Join-Path $env:TEMP "node-temp"
        if (Test-Path $tempExtractDir) {
            Remove-Item $tempExtractDir -Recurse -Force
        }
        
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tempExtractDir)
        
        # Move contents from node-v20.11.0-win-x64 folder to nodeDir
        $extractedDir = Get-ChildItem $tempExtractDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1
        if ($extractedDir) {
            Copy-Item "$($extractedDir.FullName)\*" $nodeDir -Recurse -Force
            Write-Host "[OK] Node.js extracted successfully" -ForegroundColor Green
        }
        
        # Cleanup
        Remove-Item $tempExtractDir -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
        
        $hasNode = $true
    }
    catch {
        Write-Host "[ERROR] Download/extraction failed: $_" -ForegroundColor Red
        Write-Host "Attempting to use fallback installation method..." -ForegroundColor Yellow
        
        # Try direct MSI installation
        Write-Host "Downloading and installing Node.js MSI..." -ForegroundColor Yellow
        $msiPath = Join-Path $env:TEMP "node-installer.msi"
        
        try {
            Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -OutFile $msiPath -UseBasicParsing -TimeoutSec 60
            Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", "`"$msiPath`"", "/quiet" -Wait -NoNewWindow
            
            # Try to reload environment
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            
            # Give it a moment
            Start-Sleep -Seconds 2
            
            $hasNode = $true
            Write-Host "[OK] Node.js installed via MSI" -ForegroundColor Green
        }
        catch {
            Write-Host "[ERROR] MSI installation also failed" -ForegroundColor Red
            Write-Host "Please manually install Node.js from https://nodejs.org/" -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
}

# Step 2: Verify Node.js
Write-Host ""
Write-Host "[4/5] Verifying installations..." -ForegroundColor Cyan

$nodeCmd = if (Test-Path $nodePath) { $nodePath } else { "node" }
$npmCmd = if (Test-Path $npmPath) { $npmPath } else { "npm" }

try {
    $nodeVersion = & $nodeCmd --version
    $npmVersion = & $npmCmd --version
    Write-Host "[OK] Node: $nodeVersion" -ForegroundColor Green
    Write-Host "[OK] npm: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "[WARN] Could not verify installations" -ForegroundColor Yellow
    Write-Host "Trying with global paths..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    try {
        node --version
        npm --version
        Write-Host "[OK] Verified with global installation" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERROR] Still cannot verify. Exiting." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "[5/5] Installing project dependencies..." -ForegroundColor Cyan

Set-Location -Path $scriptDir

if (Test-Path (Join-Path $scriptDir "node_modules")) {
    Write-Host "node_modules already exists, cleaning..." -ForegroundColor Yellow
    Remove-Item (Join-Path $scriptDir "node_modules") -Recurse -Force
}

$installCmd = if (Test-Path $npmPath) { $npmPath } else { "npm" }
& $installCmd install

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] npm install failed" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Dependencies installed" -ForegroundColor Green

# Step 4: Start development server
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Setup Complete! Starting dev server..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[OK] Application will open at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

& $npmCmd run dev
