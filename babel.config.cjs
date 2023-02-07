module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      }],
  ],
  plugins: [
    './src/index.js',
  ],
};
