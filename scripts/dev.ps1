$ErrorActionPreference = 'Stop'

$raiz = Split-Path -Parent $PSScriptRoot
$runtime = Join-Path $raiz '.runtime'
New-Item -ItemType Directory -Force -Path $runtime | Out-Null

function Test-Port {
  param(
    [Parameter(Mandatory = $true)]
    [int] $Port
  )

  $cliente = New-Object System.Net.Sockets.TcpClient
  try {
    $conexion = $cliente.BeginConnect('127.0.0.1', $Port, $null, $null)
    if (-not $conexion.AsyncWaitHandle.WaitOne(700)) {
      return $false
    }
    $cliente.EndConnect($conexion)
    return $true
  } catch {
    return $false
  } finally {
    $cliente.Close()
  }
}

function Wait-Port {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Name,
    [Parameter(Mandatory = $true)]
    [int] $Port,
    [Parameter(Mandatory = $true)]
    [int] $TimeoutSeconds
  )

  for ($i = 0; $i -lt $TimeoutSeconds; $i++) {
    if (Test-Port -Port $Port) {
      Write-Host "$Name listo en http://127.0.0.1:$Port"
      return
    }
    Start-Sleep -Seconds 1
  }

  Write-Warning "$Name no confirmo puerto $Port. Revisa logs en $runtime."
}

function Start-IfMissing {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Name,
    [Parameter(Mandatory = $true)]
    [int] $Port,
    [Parameter(Mandatory = $true)]
    [string] $FilePath,
    [Parameter(Mandatory = $true)]
    [string[]] $Arguments,
    [int] $TimeoutSeconds = 45
  )

  if (Test-Port -Port $Port) {
    Write-Host "$Name ya esta activo en http://127.0.0.1:$Port"
    return
  }

  $log = Join-Path $runtime "$Name.log"
  $errorLog = Join-Path $runtime "$Name.error.log"
  $pidFile = Join-Path $runtime "$Name.pid"

  Write-Host "Iniciando $Name..."
  $proceso = Start-Process `
    -FilePath $FilePath `
    -ArgumentList $Arguments `
    -WorkingDirectory $raiz `
    -WindowStyle Hidden `
    -RedirectStandardOutput $log `
    -RedirectStandardError $errorLog `
    -PassThru

  Set-Content -Path $pidFile -Value $proceso.Id
  Wait-Port -Name $Name -Port $Port -TimeoutSeconds $TimeoutSeconds
}

$powershell7 = 'C:\Program Files\PowerShell\7\pwsh.exe'
$powershell = if (Test-Path $powershell7) {
  $powershell7
} else {
  "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
}

Start-IfMissing `
  -Name 'ia' `
  -Port 8000 `
  -FilePath $powershell `
  -Arguments @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/servicio-ia.ps1') `
  -TimeoutSeconds 90

Write-Host 'Vaciando datos de la BD antes de iniciar backend...'
Push-Location $raiz
try {
  npm --prefix backend run db:reset-data
} finally {
  Pop-Location
}

Start-IfMissing `
  -Name 'backend' `
  -Port 3000 `
  -FilePath 'npm.cmd' `
  -Arguments @('--prefix', 'backend', 'run', 'dev') `
  -TimeoutSeconds 60

Start-IfMissing `
  -Name 'frontend' `
  -Port 5173 `
  -FilePath 'npm.cmd' `
  -Arguments @('--prefix', 'frontend', 'run', 'dev', '--', '--host', '127.0.0.1', '--port', '5173') `
  -TimeoutSeconds 60

Write-Host ''
Write-Host 'Sistema listo:'
Write-Host '  Frontend: http://127.0.0.1:5173'
Write-Host '  Backend : http://127.0.0.1:3000'
Write-Host '  IA      : http://127.0.0.1:8000'
Write-Host "Logs: $runtime"
