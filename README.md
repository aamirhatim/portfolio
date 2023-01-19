Steps used from [this guide](https://javascript.plainenglish.io/create-a-react-app-from-scratch-in-2021-8e9948602e9c)

# Setup
1. Create directory to build app in
2. `cd` into the directory and then initialize the app with npm: `npm init -y`
3. Install npm dependencies:
    ```
    npm i webpack \
           babel-loader \
           @babel/preset-react \
           @babel/core \
           babel-preset-react \
           html-webpack-plugin \
           webpack-dev-server \
           css-loader \
           style-loader \
           @babel/plugin-proposal-class-properties \
           webpack-cli \
           sass-loader
    npm i react react-dom
    ```
4. Create `src` directory in app's root directory
5. Create `components` and `scss` directories in `src` directory from step 4
6. Create `index.js` and `index.html` in the `src` directory from step 4
7. Create `.babelrc` file in app's root directory and paste the following code:
    ``` bash
    {
    "presets": ["@babel/preset-react"],
    "plugins": ["@babel/plugin-proposal-class-properties"]
    }
    ```
8. Create `webpack.config.js` file in app's root directory and paste the following code:
    ``` javascript
    const HtmlWebPackPlugin = require('html-webpack-plugin');
    const htmlPlugin = new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
    });

    module.exports = {
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                }
            ]
        },
        plugins: [htmlPlugin]
    };
    ```
9. Add start script to `package.json` file:
    ``` json
    "scripts": {
        "start": "webpack serve --config webpack.config.js"
    }
    ```

## Boilerplate `index.html`
``` html
<!DOCTYPE html>

<html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <title>TITLE</title>
    </head>
    <body id='app'></body>
</html>
```

## Boilerplate `index.js`
``` javascript
import ReactDOM from 'react-dom';
import React from 'react';

ReactDOM.render(
    <React.StrictMode>
    </React.StrictMode>,
    document.getElementById('app')
);
```

## Boilerplate component code
``` javascript
// File name is called Component.js
import React from 'react';
import '../css/component.scss';

export default function Component() {
    return(
        <div>
            <h1>COMPONENT</h1>
        </div>
    )
};
```

# Usage
Run app using `npm run start`