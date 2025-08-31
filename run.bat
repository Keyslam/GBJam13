@echo off
cd game

echo Checking for required dependencies...

echo Checking for LOVE installation...
where love.exe >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo LOVE 11.5 is not installed or not in PATH.
    echo Please install it from https://love2d.org/
    echo and ensure it's added to your system PATH.
    pause
    exit /b 1
)

echo Checking for pnpm installation...
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo pnpm is not installed. Please install it from https://pnpm.io/installation
    pause
    exit /b 1
)

echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call pnpm install
)

echo Building project...
call pnpm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed.
    pause
    exit /b 1
)

echo Running game...
cd build
love .

cd ..