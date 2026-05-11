<#
.SYNOPSIS
  Regenerates _data/packages.yml from package.json files inside a local Common-Package repo.

.DESCRIPTION
  Walks $CommonPackagePath/Assets/Scripts/**/package.json, parses each manifest, and writes
  the result to _data/packages.yml (in repo-relative path). Use this whenever a package is
  added, bumped or renamed in Common-Package, then commit the regenerated yml.

  Folder name of the package.json's parent dir is used as the GitHub repo name (under AgasKhan/).
  Category is taken from $CategoryMap below; add new entries there when publishing new packages.

.PARAMETER CommonPackagePath
  Path to the local Common-Package repo. Defaults to D:\Proyectos\Personales\Unity\Common-Package.

.PARAMETER GitHubOwner
  Owner under which the package repos live on GitHub. Defaults to AgasKhan.

.EXAMPLE
  pwsh scripts/sync-from-cp.ps1
  pwsh scripts/sync-from-cp.ps1 -CommonPackagePath D:\elsewhere\Common-Package
#>
[CmdletBinding()]
param(
  [string]$CommonPackagePath = 'D:\Proyectos\Personales\Unity\Common-Package',
  [string]$GitHubOwner = 'AgasKhan'
)

$ErrorActionPreference = 'Stop'

# Map package id -> category. Update when publishing new packages.
$CategoryMap = @{
  'com.agaskhan.commoninterfaces'      = 'Foundation'
  'com.agaskhan.commonextensions'      = 'Foundation'
  'com.agaskhan.datastructure'         = 'Foundation'
  'com.agaskhan.systemengineupdate'    = 'Engine'
  'com.agaskhan.threadsafeutils'       = 'Engine'
  'com.agaskhan.gamemanager'           = 'Engine'
  'com.agaskhan.timersmanager'         = 'Engine'
  'com.agaskhan.fadesystem'            = 'Engine'
  'com.agaskhan.eventsystem'           = 'Systems'
  'com.agaskhan.fsm'                   = 'Systems'
  'com.agaskhan.objectpool'            = 'Systems'
  'com.agaskhan.customswrappers'       = 'Serialization'
  'com.agaskhan.typeselector'          = 'Serialization'
  'com.agaskhan.superscriptableobject' = 'Serialization'
  'com.agaskhan.debugprint'            = 'Tooling'
  'com.agaskhan.editorplus'            = 'Tooling'
  'com.agaskhan.editortools'           = 'Tooling'
}

# Order categories appear in (and packages are sorted within their category by name).
$CategoryOrder = @('Foundation', 'Engine', 'Systems', 'Serialization', 'Tooling', 'Other')

# Packages whose repos are public on GitHub. The site only renders public packages;
# the rest stay listed in packages.yml (so the script output is complete) but get filtered out.
# Add a package id here when you publish its repo publicly.
$PublicPackages = @(
  # 'com.agaskhan.example'
)

function ConvertTo-YamlString {
  param([string]$Value)
  if ([string]::IsNullOrEmpty($Value)) { return '""' }
  # Quote if it contains characters YAML cares about, otherwise leave bare.
  if ($Value -match '[:#\[\]\{\},&\*\!\|\>''"%@`]' -or $Value -match '^\s' -or $Value -match '\s$') {
    $escaped = $Value -replace '"', '\"'
    return '"' + $escaped + '"'
  }
  return $Value
}

function Get-RepoFolderName {
  param([System.IO.FileInfo]$PackageJson)
  # The package.json sits inside the package's root folder.
  return $PackageJson.Directory.Name
}

# ---------- Validate input path ----------
$assetsScripts = Join-Path $CommonPackagePath 'Assets\Scripts'
if (-not (Test-Path $assetsScripts)) {
  throw "Could not find Assets\Scripts under '$CommonPackagePath'. Pass -CommonPackagePath <path>."
}

# ---------- Locate target output file ----------
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$siteRoot  = Split-Path -Parent $scriptDir
$outFile   = Join-Path $siteRoot '_data\packages.yml'

Write-Host "Scanning  : $assetsScripts"
Write-Host "Writing to: $outFile"
Write-Host ""

# ---------- Discover ----------
$pkgFiles = Get-ChildItem -Path $assetsScripts -Recurse -Filter 'package.json' -File

if (-not $pkgFiles -or $pkgFiles.Count -eq 0) {
  throw "No package.json files found under '$assetsScripts'."
}

# ---------- Parse ----------
$packages = foreach ($file in $pkgFiles) {
  $raw = Get-Content $file.FullName -Raw -Encoding UTF8
  $json = $raw | ConvertFrom-Json

  $repoFolder = Get-RepoFolderName -PackageJson $file

  $deps = @()
  if ($json.dependencies) {
    foreach ($prop in $json.dependencies.PSObject.Properties) {
      $deps += $prop.Name
    }
  }
  $deps = $deps | Sort-Object

  $keywords = @()
  if ($json.keywords) { $keywords = $json.keywords }

  [PSCustomObject]@{
    id           = $json.name
    display_name = $json.displayName
    version      = $json.version
    description  = $json.description
    unity        = $json.unity
    license      = $json.license
    repo         = "https://github.com/$GitHubOwner/$repoFolder"
    repo_short   = "$GitHubOwner/$repoFolder"
    visibility   = if ($PublicPackages -contains $json.name) { 'public' } else { 'private' }
    category     = if ($CategoryMap.ContainsKey($json.name)) { $CategoryMap[$json.name] } else { 'Other' }
    keywords     = $keywords
    dependencies = $deps
  }
}

# ---------- Sort by category order, then by id ----------
$sorted = $packages | Sort-Object `
  @{ Expression = { $CategoryOrder.IndexOf($_.category) }; Ascending = $true },
  @{ Expression = 'id'; Ascending = $true }

# ---------- Emit YAML ----------
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('# Auto-generated by scripts/sync-from-cp.ps1 -- do not edit by hand.')
[void]$sb.AppendLine('# Source of truth: Common-Package local repo (Assets/Scripts/**/package.json).')
[void]$sb.AppendLine('# Order is category-driven; category drives UI grouping.')
[void]$sb.AppendLine('')

foreach ($p in $sorted) {
  [void]$sb.AppendLine("- id: $($p.id)")
  [void]$sb.AppendLine("  display_name: $(ConvertTo-YamlString $p.display_name)")
  [void]$sb.AppendLine("  version: $(ConvertTo-YamlString $p.version)")
  [void]$sb.AppendLine("  description: $(ConvertTo-YamlString $p.description)")
  [void]$sb.AppendLine("  unity: $(ConvertTo-YamlString $p.unity)")
  [void]$sb.AppendLine("  license: $(ConvertTo-YamlString $p.license)")
  [void]$sb.AppendLine("  repo: $($p.repo)")
  [void]$sb.AppendLine("  repo_short: $($p.repo_short)")
  [void]$sb.AppendLine("  visibility: $($p.visibility)")
  [void]$sb.AppendLine("  category: $($p.category)")

  if ($p.keywords -and $p.keywords.Count -gt 0) {
    $kw = ($p.keywords | ForEach-Object { ConvertTo-YamlString $_ }) -join ', '
    [void]$sb.AppendLine("  keywords: [$kw]")
  } else {
    [void]$sb.AppendLine('  keywords: []')
  }

  if ($p.dependencies -and $p.dependencies.Count -gt 0) {
    [void]$sb.AppendLine('  dependencies:')
    foreach ($d in $p.dependencies) {
      [void]$sb.AppendLine("    - $d")
    }
  } else {
    [void]$sb.AppendLine('  dependencies: []')
  }

  [void]$sb.AppendLine('')
}

# Write as UTF-8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outFile, $sb.ToString(), $utf8NoBom)

Write-Host "OK: wrote $($sorted.Count) packages to $outFile"
$grouped = $sorted | Group-Object category
foreach ($g in $grouped) {
  Write-Host "  $($g.Name): $($g.Count)"
}
