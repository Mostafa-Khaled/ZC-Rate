module.exports = {
  lintOnSave: false,
  devServer: {
    proxy:{
      '^/server':{
        target:"http://localhost:5000/",
        changeOrigin: true
      }
    },
    host: 'localhost'
    }
}
