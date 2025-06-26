const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add React Native Firebase support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config; 