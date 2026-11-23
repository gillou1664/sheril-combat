# Meilleur équipement contre meilleur équipement, 3 moteurs (jeu actuel, débordement, tir continu), calcul long.
# - Empêche la mise en veille de Windows pendant le calcul (elle a coupé un calcul de 4 h le 2026-11-20).
# - Un fichier de résultats par moteur : une relance saute les moteurs déjà faits (reprise après coupure).
# - Fusionne ensuite les trois fichiers pour meilleur-equipement.js.
# Usage, depuis la racine du dépôt :
#   powershell -ExecutionPolicy Bypass -File equilibre/lancer-meilleur-equipement.ps1 [-Combats 1000] [-Coeurs 16]
param([int]$Combats = 1000, [int]$Coeurs = [Environment]::ProcessorCount)

$ErrorActionPreference = 'Stop'
$depot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $depot
$dossier = Join-Path $depot 'equilibre\resultats'
New-Item -ItemType Directory -Force $dossier | Out-Null

Add-Type -Namespace Sheril -Name Veille -MemberDefinition '[DllImport("kernel32.dll")] public static extern uint SetThreadExecutionState(uint esFlags);'
$ES_CONTINUOUS = [uint32]'0x80000000'; $ES_SYSTEM_REQUIRED = [uint32]'0x00000001'

$moteurs = @(
  @{ Nom = 'jeu';         Regles = 'debordement=false' },
  @{ Nom = 'debordement'; Regles = 'debordement=true' },
  @{ Nom = 'tir continu'; Regles = 'debordement=false;tirContinu=true;ciblesVivantes=true;enrayement=20' }
)
$fichiers = @()
try {
  [Sheril.Veille]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED) | Out-Null
  foreach ($m in $moteurs) {
    $court = $m.Nom -replace ' ', '-'
    $json = Join-Path $dossier "me-$Combats-$court.json"
    $fichiers += $json
    if (Test-Path $json) { Write-Host "$($m.Nom) : déjà calculé ($json), sauté."; continue }
    $debut = Get-Date
    Write-Host "$($m.Nom) : début à $($debut.ToString('HH:mm:ss'))"
    $tmp = "$json.partiel"
    & node equilibre/equilibre.js equilibre/scenarios/meilleur-equipement.json --ressource minerai --budget 5000,25000 `
      -n $Combats --coeurs $Coeurs --sans-actuel --variante "$($m.Nom):$($m.Regles)" --json $tmp > (Join-Path $dossier "me-$Combats-$court.txt")
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmp)) { throw "$($m.Nom) : échec du calcul (code $LASTEXITCODE)" }
    Move-Item -Force $tmp $json
    Write-Host ("$($m.Nom) : fini en {0:N0} min" -f ((Get-Date) - $debut).TotalMinutes)
  }
  $sortie = Join-Path $dossier "resultats-$Combats.json"
  & node equilibre/fusionner.js $sortie @fichiers
  if ($LASTEXITCODE -ne 0) { throw 'échec de la fusion' }
  Write-Host "Terminé : $sortie"
} finally {
  [Sheril.Veille]::SetThreadExecutionState($ES_CONTINUOUS) | Out-Null
}
