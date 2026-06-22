// Konfigurasi Metro sederhana
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optimasi untuk prestasi
config.transformer.workerThreads = true;

module.exports = config;