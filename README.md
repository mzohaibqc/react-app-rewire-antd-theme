# create-react-rewire-antd-theme

This package is mainly to generate a `color.less` file which can be used to update color specific theme variables 
at runtime in browser or one can apply theme based on saved color configurations. 

But this package can be used just to setup Ant Design (antd) with `create-react-app` project.

You simply need to install this package and add a `config-overrides.js` file in project's root directory.

Live Theme Demo: https://mzohaibqc.github.io/antd-live-theme/

Add following code in above file

```js
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  varFile: path.join(__dirname, './src/styles/variables.less'),
  stylesDir: path.join(__dirname, './src/styles'),
  antDir: path.join(__dirname, './node_modules/antd'),
  // colorFilePath: path.join(__dirname, './public/color.less'),
  themeVariables: ['@primary-color', '@secondry-color', '@text-color-secondary']
}
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```

Default paths for various files are as in above code snippet but you can override by passing your own values.
`themeVariables` is required field (if you want to generate color.less file for Dynamic theme) and it's an array of color variable names that you want to configure for Dynamic theme e.g. ['@primary-color', '@secondry-color']
Here are two color specified in array. First one is Ant Design specific and other is our custom one. You can use only Ant Design color variables or just only your own or both as you can see in example.

In order to just integrate Ant Design with react project, just provide `varFile` path or `vars` object.

```js
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');

const options = {
  varFile: path.join(__dirname, './src/styles/variables.less')
}
// Or
// const options = {
//   vars: {
//     '@primary-color': '#ff0000'
//   }
// }
module.exports = function override(config, env) {
  config = updateConfig(config, env, options)
  return config;
};
```

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