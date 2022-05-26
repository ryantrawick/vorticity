const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'src'),
  watch: true,
  // stats: 'verbose',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'main.js'
  }
}
