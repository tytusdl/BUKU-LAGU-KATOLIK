# Skrip untuk mengoptimumkan imej PNG ke WebP (hanya splash.png)

# Pastikan tool sharp-cli telah dipasang
if (!(Test-Path node_modules\.bin\sharp-cli.cmd)) {
    Write-Host "Memasang sharp-cli..."
    npm install sharp-cli --save-dev
}

# Optimumkan splash.png jika ia wujud
$splashImage = @{InputPath = "assets\images\splash.png"; OutputPath = "assets\images\splash.webp"; Quality = 80}

if (Test-Path $splashImage.InputPath) {
    Write-Host "Mengoptimumkan $($splashImage.InputPath) ke $($splashImage.OutputPath)..."
    npx sharp-cli -i $splashImage.InputPath -o $splashImage.OutputPath -f webp -q $splashImage.Quality
    Write-Host "Optimumkan $($splashImage.InputPath) selesai."

    # Tunjukkan perbandingan saiz untuk fail splash
    if ((Test-Path $splashImage.InputPath) -and (Test-Path $splashImage.OutputPath)) {
        $originalSize = (Get-Item $splashImage.InputPath).Length
        $webpSize = (Get-Item $splashImage.OutputPath).Length
        
        if ($originalSize -gt 0) {
            $savingPercentage = [math]::Round(($originalSize - $webpSize) / $originalSize * 100, 2)
            Write-Host "Perbandingan Saiz:"
            Write-Host "$($splashImage.InputPath): $originalSize bytes"
            Write-Host "$($splashImage.OutputPath): $webpSize bytes"
            Write-Host "Penjimatan: $savingPercentage%"
        }
    }
} else {
    Write-Host "Fail $($splashImage.InputPath) tidak dijumpai. Langkau optimasi splash."
}

Write-Host "Proses optimasi imej selesai!" 