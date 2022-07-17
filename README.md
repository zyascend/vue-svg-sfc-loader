# vue-svg-sfc-loader  

**import SVG as Vue Component with webpack !!!**  

**将SVG文件加载为Vue组件**

## Installation
```
npm i vue-svg-sfc-loader -D
yarn add vue-svg-sfc-loader -D
```

## Configuration    

use `vue-svg-sfc-loader` as the last loader of the SVG laoders  

将 `vue-svg-sfc-loader` 作为处理SVG的最后一个loader

### Webpack

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'vue-svg-sfc-loader',
            options: {
              className: 'myclass'
            }
          },
        ],
      },
    ],
  },
};
```
### Vue CLI 
```
module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-sfc-loader')
      .loader('vue-svg-sfc-loader')
      .options({
        className: 'myclass'
      })
      .end()
  },
};
```

## options
### `className`  

type: `string`  

default value: `class`

add custom class props to `<svg>`  

the render result:
```
<svg class='myclass' ...>
  ...
</svg>
```







