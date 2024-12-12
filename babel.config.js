module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      "module-resolver",
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '@assets': './src/assets',
          "@features": "./src/features",
          "@service": "./src/service",
          "@components": "./src/components",
          '@navigation': './src/navigation',
          "@state": "./src/state",
          "@styles": "./src/styles",
          "@utils": "./src/utils",
          "@types": "./src/types"
        }
      }
    ]
  ]
};
