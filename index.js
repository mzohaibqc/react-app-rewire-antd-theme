#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const postcss = require('postcss');
const less = require('less');
const bundle = require('less-bundle-promise');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

function updateConfig(config, env, options = {}) {
  let vars = {};
  if (options.varFile) {
    if (fs.existsSync(options.varFile)) {
      vars = getLessVars(options.varFile);
    } else {
      throw Error('variables file absolute path does not exists. ')
    }
  } else {
    const stylesDir = options.stylesDir || path.join(__dirname, '../../src/styles');
    const varFile = path.join(stylesDir, './variables.less');
    if (fs.existsSync(varFile)) {
      vars = getLessVars(varFile);
    } else {
      console.log(`No variables.less file found at path: ${varFile}`);
    }
  }
  /*
    One can provide variables through options against `vars` key or it can be used to override
    variables' values provides in variables file
  */
  vars = Object.assign(vars, options.vars);
  config = rewireLess.withLoaderOptions({
    modifyVars: vars
  })(config, env);
  if (!(options.importPlugin === false)) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  }
  if (Array.isArray(options.themeVariables) && options.themeVariables.length > 0) {
    config.plugins.push(new AntDesignThemePlugin(options));
  }

  return config;
}

/*
  This funtion reads a less file and create an object with keys as variable names 
  and values as variables respective values. e.g.
  //variabables.less
    @primary-color : #1890ff;
    @heading-color : #fa8c16;
    @text-color : #cccccc;
  
    to

    {
      '@primary-color' : '#1890ff',
      '@heading-color' : '#fa8c16',
      '@text-color' : '#cccccc'
    }

*/
function getLessVars(filtPath) {
  const sheet = fs.readFileSync(filtPath).toString();
  const lessVars = {};
  const matches = sheet.match(/@(.*:[^;]*)/g) || [];

  matches.forEach(variable => {
    const definition = variable.split(/:\s*/);
    const varName = definition[0].replace(/['"]+/g, '').trim();
    lessVars[varName] = definition.splice(1).join(':');
  });
  return lessVars;
}

/*
  This function takes color string as input and return true if string is a valid color otherwise returns false.
  e.g.
  isValidColor('#ffffff'); //true
  isValidColor('#fff'); //true 
  isValidColor('rgba(0, 0, 0, 0.5)'); //true
  isValidColor('20px'); //false
*/
function isValidColor(color) {
  if (!color || color.match(/px/g)) return false;
  if (color.match(/colorPalette|fade/g)) return true;
  if (color.charAt(0) === '#') {
    color = color.substring(1);
    return (
      [3, 4, 6, 8].indexOf(color.length) > -1 && !isNaN(parseInt(color, 16))
    );
  }
  return /^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s\/]*[\d\.]+%?\)$/i.test(color);
}


module.exports = {
  updateConfig,
  isValidColor,
  getLessVars
}