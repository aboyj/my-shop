@echo off
REM Production Setup Script for My Shop (Windows)

setlocal enabledelayedexpansion

echo.
echo 🚀 My Shop Production Setup
echo ================================
echo.

REM Check if git is initialized
if not exist .git (
    echo ❌ Git not initialized. Run: git init
    exit /b 1
)

echo ✅ Git repository found

REM Check required files
echo.
echo 📋 Checking project files...
set "missing=0"

for %%F in (
    package.json
    next.config.mjs
    tsconfig.json
    tailwind.config.ts
    prisma\schema.prisma
    .env.example
    vercel.json
) do (
    if not exist %%F (
        echo ❌ Missing: %%F
        set "missing=1"
    )
)

if !missing! equ 1 exit /b 1

echo ✅ All required files present

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install
if !errorlevel! neq 0 exit /b 1

REM Generate Prisma client
echo.
echo 🔧 Generating Prisma client...
call npm run prisma:generate
if !errorlevel! neq 0 exit /b 1

REM Build application
echo.
echo 🔨 Building application...
call npm run build
if !errorlevel! neq 0 exit /b 1

REM Type check
echo.
echo 📋 Running type checks...
call npm run type-check
if !errorlevel! neq 0 exit /b 1

echo.
echo ✅ Production setup complete!
echo.
echo Next steps:
echo 1. Push to GitHub:
echo    git push -u origin main
echo.
echo 2. Go to https://vercel.com
echo 3. Import your GitHub repository
echo 4. Add environment variables ^(see .env.example^)
echo 5. Deploy!
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md
echo.

pause
