@echo off
REM AigoTools 一键配置脚本
REM 用法: 以管理员身份运行此脚本

echo ========================================
echo AigoTools 项目配置向导
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js ^>= 18.20.2
    pause
    exit /b 1
)

REM 检查 pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 未检测到 pnpm，正在安装...
    npm install -g pnpm
)

REM 检查 Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [警告] 未检测到 Docker，请先安装 Docker Desktop
)

echo.
echo [1/5] 生成安全密码...
set /p CUSTOM_PASSWORD="请输入自定义密码（直接回车使用随机密码）: "
if "%CUSTOM_PASSWORD%"=="" (
    echo 正在生成随机密码...
    REM 使用 PowerShell 生成随机密码
    powershell -Command "$password = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24)); Write-Output $password" > temp_password.txt
    set /p GENERATED_PASSWORD=<temp_password.txt
    echo 生成的密码: %GENERATED_PASSWORD%
    del temp_password.txt
) else (
    set GENERATED_PASSWORD=%CUSTOM_PASSWORD%
)

echo.
echo [2/5] 配置环境变量...
if not exist "packages\aigotools\.env.local" (
    copy "packages\aigotools\.env.example" "packages\aigotools\.env.local"
    echo 已创建 packages\aigotools\.env.local
)
if not exist "packages\crawler\.env.local" (
    copy "packages\crawler\.env.example" "packages\crawler\.env.local"
    echo 已创建 packages\crawler\.env.local
)

REM 更新密码
powershell -Command "(Get-Content 'packages\aigotools\.env.local') -replace 'your_minio_access_key', 'admin' -replace 'your_minio_secret_key', '%GENERATED_PASSWORD%' -replace 'your_crawler_password', '%GENERATED_PASSWORD%' | Set-Content 'packages\aigotools\.env.local'"
powershell -Command "(Get-Content 'packages\crawler\.env.local') -replace 'your_mongo_password', '%GENERATED_PASSWORD%' -replace 'your_redis_password', '%GENERATED_PASSWORD%' -replace 'your_minio_access_key', 'admin' -replace 'your_minio_secret_key', '%GENERATED_PASSWORD%' -replace 'your_crawler_password', '%GENERATED_PASSWORD%' | Set-Content 'packages\crawler\.env.local'"

echo.
echo [3/5] 更新 Docker Compose 密码...
powershell -Command "(Get-Content 'docker-compose.yml') -replace 'aigotools123456', '%GENERATED_PASSWORD%' | Set-Content 'docker-compose.yml'"

echo.
echo [4/5] 安装依赖...
echo 正在安装依赖，这可能需要几分钟...
call pnpm install

echo.
echo [5/5] 初始化 Git...
if not exist ".git" (
    git init
    echo 已初始化 Git 仓库
)

echo.
echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 您的安全密码: %GENERATED_PASSWORD%
echo 请妥善保管此密码！
echo.
echo 下一步：
echo 1. 编辑 packages\aigotools\.env.local 配置 Clerk 和 API 密钥
echo 2. 编辑 packages\crawler\.env.local 配置 OpenAI 和 Jina API 密钥
echo 3. 运行 docker-compose up -d 启动服务
echo 4. 访问 http://localhost:3000 查看网站
echo.
echo 详细配置请参考 CONFIGURATION_GUIDE.md
echo.
pause