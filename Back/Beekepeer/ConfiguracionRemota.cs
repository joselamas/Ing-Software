using System;
using System.IO;
using System.Net;
using System.Net.Sockets;

namespace Beekepeer
{
    public static class ConfiguracionRemota
    {
        public static void GenerarScriptBat()
        {
            string ipServidor = "127.0.0.1";
            try
            {
                using (Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, 0))
                {
                    socket.Connect("8.8.8.8", 65530);
                    if (socket.LocalEndPoint is IPEndPoint endPoint)
                    {
                        ipServidor = endPoint.Address.ToString();
                    }
                }
            }
            catch
            {
                var host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (var ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !ip.ToString().StartsWith("127."))
                    {
                        ipServidor = ip.ToString();
                        break;
                    }
                }
            }

            string carpetaDatos = Path.Combine(AppContext.BaseDirectory, "Datos");
            if (!Directory.Exists(carpetaDatos))
            {
                Directory.CreateDirectory(carpetaDatos);
            }

            string rutaBat = Path.Combine(carpetaDatos, "ConectarBeekeeper.bat");

            string contenidoBat = $@"@echo off
color 0E
title Configurar Red - Beekeeper

:: ==========================================
:: 1. CONFIGURACION AUTOMATICA
:: ==========================================
set IP_SERVIDOR={ipServidor}
set NOMBRE_PERSONALIZADO=servidor.beekeeper

:: ==========================================
:: 2. AUTO-ELEVACION A ADMINISTRADOR
:: ==========================================
>nul 2>&1 ""%SYSTEMROOT%\system32\cacls.exe"" ""%SYSTEMROOT%\system32\config\system""
if '%errorlevel%' NEQ '0' (
    echo Solicitando privilegios...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^(""Shell.Application""^) > ""%temp%\getadmin.vbs""
    echo UAC.ShellExecute ""%~s0"", """", """", ""runas"", 1 >> ""%temp%\getadmin.vbs""
    ""%temp%\getadmin.vbs""
    exit /B

:gotAdmin
    if exist ""%temp%\getadmin.vbs"" ( del ""%temp%\getadmin.vbs"" )
    pushd ""%CD%""
    CD /D ""%~dp0""

:: ==========================================
:: 3. ESCRITURA EN EL ARCHIVO HOSTS
:: ==========================================
cls
echo ===================================================
echo     INSTALADOR DE ACCESO A BEEKEEPER (CLIENTES)
echo ===================================================
echo.
echo Servidor detectado en: {ipServidor}

set ""tempHosts=%temp%\hosts.tmp""
if exist ""%tempHosts%"" del ""%tempHosts%""

for /f ""tokens=*"" %%i in ('type ""%WINDIR%\System32\drivers\etc\hosts""') do (
    echo %%i | findstr /C:""servidor.beekeeper"" >nul
    if errorlevel 1 (
        echo %%i >> ""%tempHosts%""
    )
)
move /y ""%tempHosts%"" ""%WINDIR%\System32\drivers\etc\hosts"" >nul

echo. >> ""%WINDIR%\System32\drivers\etc\hosts""
echo {ipServidor}    servidor.beekeeper >> ""%WINDIR%\System32\drivers\etc\hosts""

echo.
echo [EXITO] Enlace configurado. Entra a http://servidor.beekeeper:5000
pause
";
            try { File.WriteAllText(rutaBat, contenidoBat); } catch { }
        }
    }
}