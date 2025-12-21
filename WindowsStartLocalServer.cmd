@echo off
chcp 65001 >nul
title Serveur local Python

REM === Test Python ===

python --version >nul 2>&1
if %errorlevel%==0 (
    set PYTHON_CMD=python
) else (
    py --version >nul 2>&1
    if %errorlevel%==0 (
        set PYTHON_CMD=py
    )
)

if "%PYTHON_CMD%"=="" (
        echo.
        echo ❌ Python n'est pas installé ou non accessible.
        echo.
        echo 👉 Télécharge Python ici :
        echo https://www.python.org/downloads/windows/
        echo.
        echo ⚠️ IMPORTANT : cocher "Add Python to PATH" à l'installation.
        echo.
        pause
        exit /b
)

REM === Lancement du serveur ===
echo ✅ Python détecté
echo 🌐 Lancement du serveur sur http://localhost:8000
echo.

%PYTHON_CMD% -m http.server 8000
start http://localhost:8000
