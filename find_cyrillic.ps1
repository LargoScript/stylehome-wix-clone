# Script to find all Cyrillic characters in code files
# Usage: .\find_cyrillic.ps1

$cyrillicPattern = '[А-Яа-яЁёІіЇїЄєҐґ]'
$extensions = @('*.ts', '*.js', '*.css', '*.html', '*.java', '*.yml', '*.yaml')

Write-Host "Searching for Cyrillic characters in code files..." -ForegroundColor Yellow
Write-Host ""

$results = @()
$excludeDirs = @('node_modules', 'dist', 'target', '.git', 'backend/target')

Get-ChildItem -Path . -Recurse -Include $extensions | 
    Where-Object { 
        $excluded = $false
        foreach ($dir in $excludeDirs) {
            if ($_.FullName -like "*\$dir\*") {
                $excluded = $true
                break
            }
        }
        -not $excluded
    } | ForEach-Object {
    $file = $_
    try {
        $content = Get-Content $file.FullName -Encoding UTF8 -ErrorAction SilentlyContinue
        
        if ($content) {
            $lineNumber = 0
            
            foreach ($line in $content) {
                $lineNumber++
                if ($line -match $cyrillicPattern) {
                    $relativePath = $file.FullName.Replace((Get-Location).Path + '\', '')
                    
                    $results += [PSCustomObject]@{
                        File = $relativePath
                        Line = $lineNumber
                        Text = $line.Trim()
                    }
                }
            }
        }
    } catch {
        # Skip files that can't be read
    }
}

if ($results.Count -gt 0) {
    Write-Host "Found $($results.Count) lines with Cyrillic characters:" -ForegroundColor Red
    Write-Host ""
    
    $results | Format-Table -AutoSize File, Line
    
    # Save to file
    $results | Export-Csv -Path "cyrillic_found.csv" -NoTypeInformation -Encoding UTF8
    Write-Host "Results saved to cyrillic_found.csv" -ForegroundColor Green
} else {
    Write-Host "No Cyrillic characters found!" -ForegroundColor Green
}

return $results
