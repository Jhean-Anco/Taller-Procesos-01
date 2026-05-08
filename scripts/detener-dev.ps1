$ErrorActionPreference = 'Continue'

$raiz = Split-Path -Parent $PSScriptRoot
$runtime = Join-Path $raiz '.runtime'

if (Test-Path $runtime) {
  Get-ChildItem -Path $runtime -Filter '*.pid' -ErrorAction SilentlyContinue | ForEach-Object {
    $pidTexto = Get-Content -Path $_.FullName -ErrorAction SilentlyContinue | Select-Object -First 1
    $pidNumero = 0
    if ([int]::TryParse($pidTexto, [ref] $pidNumero)) {
      Stop-Process -Id $pidNumero -Force -ErrorAction SilentlyContinue
    }
    Remove-Item -LiteralPath $_.FullName -Force -ErrorAction SilentlyContinue
  }
}

$puertos = @(8000, 3000, 5173)
foreach ($puerto in $puertos) {
  $lineas = netstat -ano | Select-String ":$puerto\s+.*LISTENING"
  foreach ($linea in $lineas) {
    $partes = ($linea.ToString() -split '\s+') | Where-Object { $_ }
    $pidProceso = [int] $partes[-1]
    Stop-Process -Id $pidProceso -Force -ErrorAction SilentlyContinue
  }
}

Write-Host 'Servicios de desarrollo detenidos.'
