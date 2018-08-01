# create-react-rewire-antd-theme

This package is mainly to integrate Ant Design with create-react-app but by adding some extra options/parameters, it will generate `color.less` file  which can be used to update color specific theme variables 
at runtime in browser or one can apply theme based on saved color configurations. 

Live Theme Demo: https://antd-live-theme.firebaseapp.com/

Here is a sample project https://github.com/mzohaibqc/antd-live-theme


For just Ant Design Integration with create-react-app, just add a file `config-overrides.js` in root directory
and add following code in it. You either need to provide `variables` less file or variables object.
```js
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  varFile: path.join(__dirname, './src/styles/variables.less')
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```
Or you can pass your Ant variables as object which you want to override.
```js
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  vars: {
    '@primary-color': '#0035f3'
  }
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```

But if you want to use live/dynamic theming functionality, add following options
```js
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  varFile: path.join(__dirname, './src/styles/variables.less'),
  mainLessFile: path.join(__dirname, './src/styles/index.less'),
  themeVariables: ['@primary-color'],
  indexFileName: 'index.html',
  generateOnce: false,
  publicPath: '' // e.g. in case you are hosting at gh-pages `https://username.github.io/project` then you can add `/project` here
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```

Default paths for various files are as in above snippet but you can override by passing your own values.
`themeVariables` is required field (if you want to generate color.less file for Dynamic theme) and it's an array of color variable names that you want to configure for Dynamic theme e.g. ['@primary-color', '@secondry-color']
Here are two color specified in array. First one is Ant Design specific and other is our custom one. You can use Ant Design color variables as well as your own custom variables as in above example.

## Note: generateOnce: false
By default this option is set as `false` which means that on each compilation, `color.less` file will be generated for dynamic theming but if you want you make your build/compilation process fast, you can disable `color.less` file generation on each compilation by setting this parameter to `true`and it will only be generated on first compilation/build. But if you have changes in your styles/less then you need to restart your compilation process `npm start` to generate `color.less` with updated changes.

# Utilities
- getLessVars(filePath)

This function reads a less file and create an object with keys as variable names 
and values as variables respective values. e.g. variabables.less
```
@primary-color : #1890ff;
@heading-color : #fa8c16;
@text-color : #cccccc;
```

to

```js
{
  '@primary-color' : '#1890ff',
  '@heading-color' : '#fa8c16',
  '@text-color' : '#cccccc'
}
```

- isValidColor(color)

This method takes color string as input and return true if string is a valid color otherwise returns false with one exception that if a color matches this regex `/colorPalette|fade/g` it will return true e.g.
```
isValidColor('#ffffff'); //true
isValidColor('#fff'); //true 
isValidColor('rgba(0, 0, 0, 0.5)'); //true
isValidColor('20px'); //false
```
