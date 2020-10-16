module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/dev-api': {
                target: 'http://182.92.128.115',
                changeOrigin: true, 
                pathRewrite: {
                    '^/dev-api': ''
                }
            }
        }
    }
};
