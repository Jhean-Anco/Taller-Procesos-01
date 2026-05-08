$ErrorActionPreference = 'Stop'

function Resolve-Python {
  $candidatos = @(
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

    & $candidato.File @($candidato.Args) --version *> $null
    if ($LASTEXITCODE -eq 0) {
      return $candidato
    }
  }

  throw 'No se encontro Python. Instala Python 3.11+ o define la variable PYTHON.'
}

$raiz = Split-Path -Parent $PSScriptRoot
$python = Resolve-Python

Set-Location $raiz
& $python.File @($python.Args) -m pip install --retries 10 --timeout 120 --prefer-binary -r services\requirements.txt
