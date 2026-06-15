// Patch to fix Expo QR scanning on Windows
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Menyiapkan konfigurasi untuk Expo...');

// Memeriksa alamat IP lokal yang benar
try {
  console.log('📡 Mendapatkan alamat IP...');
  const ipResult = execSync('ipconfig', { encoding: 'utf-8' });
  const ipMatch = ipResult.match(/IPv4 Address[.\s]+: ([\d.]+)/);
  
  if (ipMatch && ipMatch[1]) {
    const localIp = ipMatch[1];
    console.log(`✅ Alamat IP ditemukan: ${localIp}`);
    
    // Menyimpan IP ke file untuk digunakan oleh Expo
    fs.writeFileSync('./.expo/ip.txt', localIp);
    console.log('✅ Konfigurasi IP selesai.');
  } else {
    console.log('⚠️ Tidak dapat menemukan alamat IP dari ipconfig');
  }
} catch (error) {
  console.error('❌ Gagal mendapatkan alamat IP:', error);
}

console.log('🚀 Patch Expo selesai. Jalankan "npm run dev" untuk memulai aplikasi.'); 