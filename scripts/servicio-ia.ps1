$ErrorActionPreference = 'Stop'

function Resolve-Python {
  $raiz = Split-Path -Parent $PSScriptRoot
  $candidatos = @(
    @{ File = Join-Path $raiz '.venv\Scripts\python.exe'; Args = @() },
    @{ File = Join-Path $raiz 'ai-service\.venv\Scripts\python.exe'; Args = @() },
    @{ File = $env:PYTHON; Args = @() },
    @{ File = "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe"; Args = @() },
    @{ File = "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe"; Args = @() },
    @{ File = 'python'; Args = @() },
    @{ File = 'py'; Args = @('-3') }
  )

  foreach ($candidato in $candidatos) {
    if ([string]::IsNullOrWhiteSpace($candidato.File)) {
      continue
    }

    if ($candidato.File -like '*\*' -and -not (Test-Path $candidato.File)) {
      continue
    }

    $preferenciaErrores = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
      & $candidato.File @($candidato.Args) --version *> $null
      if ($LASTEXITCODE -eq 0) {
        return $candidato
      }
    } catch {
      continue
    } finally {
      $ErrorActionPreference = $preferenciaErrores
    }
  }

  return $null
}

$raiz = Split-Path -Parent $PSScriptRoot
$python = Resolve-Python

Set-Location $raiz
if ($null -ne $python) {
  & $python.File @($python.Args) -m uvicorn services.app:app --host 127.0.0.1 --port 8000
  exit $LASTEXITCODE
}

Write-Warning 'No se encontro Python utilizable. Se iniciara el servicio IA local de desarrollo con Node.'
& node scripts/servicio-ia-local.mjs
