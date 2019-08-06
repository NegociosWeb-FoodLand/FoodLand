// Importar path para poder acceder al árbol de direcciones
const path = require('path');

// Importar webpack
const webpack = require('webpack');

module.exports = {
    // punto de entrada 
    entry : './public/assets/js/app.js',
    // punto de salida
    output : {
        filename : 'bundle.js',
        path : path.join(__dirname, './public/assets/dist')
    },

    module : {
        rules : [
            {
                test : /\.m?js$/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}