# Style Homes VPS Deployment Script (PowerShell)
# This script connects to VPS and runs deployment

$VPS_IP = "31.131.21.16"
$VPS_USER = "deploy"
$VPS_PASS = "deploy2"

Write-Host "==========================================" -ForegroundColor Green
Write-Host "Style Homes VPS Deployment" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if SSH is available
$sshPath = Get-Command ssh -ErrorAction SilentlyContinue
if (-not $sshPath) {
    Write-Host "SSH not found. Please install OpenSSH client." -ForegroundColor Red
    Write-Host "Or run the commands manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ssh deploy@31.131.21.16" -ForegroundColor Cyan
    Write-Host "wget https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh" -ForegroundColor Cyan
    Write-Host "chmod +x deploy-vps.sh" -ForegroundColor Cyan
    Write-Host "bash deploy-vps.sh" -ForegroundColor Cyan
    exit 1
}

Write-Host "Connecting to VPS and running deployment..." -ForegroundColor Yellow
Write-Host ""

# Create SSH command script
$sshCommands = @"
wget -O deploy-vps.sh https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh
chmod +x deploy-vps.sh
bash deploy-vps.sh
"@

# Save commands to temp file
$tempFile = [System.IO.Path]::GetTempFileName()
$sshCommands | Out-File -FilePath $tempFile -Encoding ASCII

Write-Host "To deploy, run these commands:" -ForegroundColor Yellow
Write-Host ""
Write-Host "ssh deploy@31.131.21.16" -ForegroundColor Cyan
Write-Host "wget https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh" -ForegroundColor Cyan
Write-Host "chmod +x deploy-vps.sh" -ForegroundColor Cyan
Write-Host "bash deploy-vps.sh" -ForegroundColor Cyan
Write-Host ""

Write-Host "Or copy-paste this one-liner:" -ForegroundColor Yellow
Write-Host ""
$oneLiner = "ssh deploy@31.131.21.16 'wget -O - https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh | bash'"
Write-Host $oneLiner -ForegroundColor Green
Write-Host ""

$response = Read-Host "Do you want to try connecting now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Connecting to VPS..." -ForegroundColor Yellow
    Write-Host "Password: deploy2" -ForegroundColor Yellow
    Write-Host ""
    
    # Try to connect (will prompt for password)
    ssh deploy@31.131.21.16 "wget -O - https://raw.githubusercontent.com/LargoScript/stylehome-wix-clone/main/stylehome_new/deploy-vps.sh | bash"
} else {
    Write-Host "Run the commands manually when ready." -ForegroundColor Yellow
}

Remove-Item $tempFile -ErrorAction SilentlyContinue
