import * as path from 'path';
import * as webpack from 'webpack';

const ARGV = process.argv;
const PRODUCTION = ARGV.indexOf('-p') > 0;
const DEVELOPMENT = !PRODUCTION;
const rel = (x: string) => path.resolve(__dirname, x);

const config: webpack.Configuration = {
  context: rel('.'),
  entry: {
    'dist/app': './src/App.bundle.ts',
  },
  output: {
    path: rel('./www'),
    filename: '[name].js',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          },
        ],
      },
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: 'url-loader?limit=100000' },
    ]
  },
  plugins: [],
};

if (DEVELOPMENT) {
  config.watch = true;
  config.devtool = 'eval';
  config.output!.pathinfo = true;
} else {
  config.plugins!.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    })
  );
}

const compiler = webpack(config);
const callback = (err: Error, stats: webpack.Stats) => {
  if (err) {
    console.log('ERROR:');
    console.error(err);
  } else {
    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
    }));
  }
};

if (DEVELOPMENT) {
  compiler.watch({}, callback);
} else {
  compiler.run(callback);
}
