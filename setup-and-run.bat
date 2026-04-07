@echo off
echo ========================================
echo VOLTEX Quick Setup and Run
echo ========================================
echo.

echo [1/4] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo [2/4] Setting up Database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    echo Make sure PostgreSQL is running and DATABASE_URL is correct in .env
    pause
    exit /b 1
)
echo ✓ Database tables created
echo.

echo [3/4] Seeding Sample Data...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo WARNING: Seed failed, but continuing...
)
echo ✓ Sample data loaded
echo.

echo [4/4] Starting Development Server...
echo.
echo ========================================
echo Server will start at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
