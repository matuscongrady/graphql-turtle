const isProd = process.env.NODE_ENV == 'production';

const config = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    ['@babel/plugin-syntax-dynamic-import'],
    ['@babel/proposal-class-properties', { loose: true }],
    ['@babel/proposal-decorators', { loose: true, legacy: true }],
    ['@babel/proposal-object-rest-spread', { loose: true }],
    'react-hot-loader/babel'
  ],
  ignore: ['node_modules']
};

if (isProd) {
  (config.presets = config.presets.concat([
    [
      '@babel/preset-env',
      {
        targets: { browsers: ['> 1%'] },
        useBuiltIns: 'usage',
        modules: false,
        loose: true
      }
    ]
  ])),
    config.plugins.concat(['@babel/transform-react-inline-elements', '@babel/transform-react-constant-elements']);
}

module.exports = config;
