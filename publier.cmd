@echo off
setlocal
cd /d "%~dp0"
where git >nul 2>nul
if errorlevel 1 goto missinggit
node build.cjs
if errorlevel 1 goto failed
git add .gitignore README.md index.html pedagogie.html recherche.html style.css script.js data.js favicon.svg package.json server.cjs build.cjs vercel.json assets documents publier.cmd
if errorlevel 1 goto failed
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Redesign academic site with teaching resources and research publications"
  if errorlevel 1 goto failed
)
git push https://github.com/medlam22/aissa-sghir.git main
if errorlevel 1 goto failed
echo.
echo Envoi termine. Vercel peut maintenant reconstruire le site.
echo https://github.com/medlam22/aissa-sghir
pause
exit /b 0
:missinggit
echo Git est introuvable. Ouvrez Git Bash dans ce dossier.
pause
exit /b 1
:failed
echo.
echo Publication interrompue. Consultez le message ci-dessus.
pause
exit /b 1
