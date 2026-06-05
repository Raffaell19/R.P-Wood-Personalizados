# Auto-commit watcher for IPUB Parobé
# Monitors src/ for file changes and auto-commits to GitHub
# Run: powershell -ExecutionPolicy Bypass -File .agent/scripts/auto-commit.ps1

param(
    [string]$WatchPath = "src",
    [int]$DebounceSeconds = 10
)

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$fullWatchPath = Join-Path $projectRoot $WatchPath

Write-Host ""
Write-Host "  IPUB Parobé — Auto-Commit Watcher" -ForegroundColor Green
Write-Host "  Watching: $fullWatchPath" -ForegroundColor Cyan
Write-Host "  Debounce: ${DebounceSeconds}s after last change" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

# Set up FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $fullWatchPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.Filter = "*.*"
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

# Track last change time to debounce rapid saves
$script:lastChange = $null
$script:timer = $null

function Invoke-AutoCommit {
    $now = Get-Date
    
    # Check if there's actually anything to commit
    $status = git -C $projectRoot status --porcelain 2>&1
    if (-not $status) {
        return
    }

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $changedFiles = git -C $projectRoot diff --name-only HEAD 2>&1
    $newFiles = git -C $projectRoot ls-files --others --exclude-standard 2>&1

    # Build a smart commit message
    $allChanged = @($changedFiles) + @($newFiles) | Where-Object { $_ -ne "" }
    
    if ($allChanged.Count -eq 1) {
        $fileName = Split-Path -Leaf $allChanged[0]
        $commitMsg = "chore: update $fileName [$timestamp]"
    } elseif ($allChanged.Count -le 4) {
        $names = ($allChanged | ForEach-Object { Split-Path -Leaf $_ }) -join ", "
        $commitMsg = "chore: update $names [$timestamp]"
    } else {
        $commitMsg = "chore: auto-save $($allChanged.Count) files [$timestamp]"
    }

    Write-Host ""
    Write-Host "  > Committing..." -ForegroundColor Cyan
    git -C $projectRoot add -A | Out-Null
    git -C $projectRoot commit -m $commitMsg | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  + Committed: $commitMsg" -ForegroundColor Green
        Write-Host "  > Pushing to GitHub..." -ForegroundColor Cyan
        git -C $projectRoot push | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  + Pushed successfully!" -ForegroundColor Green
        } else {
            Write-Host "  ! Push failed. Will retry on next commit." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ! Nothing new to commit." -ForegroundColor Yellow
    }
}

# Event handler — resets timer on every change (debounce)
$action = {
    $script:lastChange = Get-Date

    if ($script:timer) {
        $script:timer.Stop()
        $script:timer.Dispose()
    }

    $script:timer = New-Object System.Timers.Timer
    $script:timer.Interval = $DebounceSeconds * 1000
    $script:timer.AutoReset = $false

    # Register the elapsed event
    Register-ObjectEvent -InputObject $script:timer -EventName Elapsed -Action {
        Invoke-AutoCommit
    } | Out-Null

    $script:timer.Start()
}

# Register all change events
Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

Write-Host "  Watching for changes... (saves auto-commit after ${DebounceSeconds}s of inactivity)" -ForegroundColor Gray

# Keep the script alive
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n  Auto-commit watcher stopped." -ForegroundColor Yellow
}
