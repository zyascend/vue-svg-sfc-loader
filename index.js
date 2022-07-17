const {
  parse,
  compileTemplate,
  compileScript,
  rewriteDefault
} = require('@vue/compiler-sfc')
const { getOptions, interpolateName } = require('loader-utils')

const COMP_IDENTIFIER = `__sfc__`

// const { validate } = require('schema-utils')
// const schema = require('./schema.json')
// validate options
// validate(schema, options, { name: 'vue-svg-sfc-loader' })
// options : include && exclude
module.exports = function (content, map, meta) {
  const options = getOptions(this)
  const loaderContext = this
  const resourceName = interpolateName(loaderContext, '[name]', {
    content,
    context: loaderContext.rootContext
  })
  const resourceQuery = loaderContext.resourceQuery || ''
  const importType = resourceQuery.replace('?', '')
  if (importType === 'raw') {
    return compileRaw(content)
  }
  const source = interpolateSFC(content, options)
  const code = transformSFC(source, resourceName, content)
  return code
}

function interpolateSFC(content, options) {
  let svg = content
  const className = options?.className || 'class'
  svg = svg.replace('<svg', `<svg :class="${className}"`)
  const template = `
    <template>
      ${svg}
    </template>
  `
  const script = `
    <script setup>
      const props = defineProps({
        ${className}: String
      })
    </script>
    `
  return `
    ${template}
    ${script}
  `
}

function compileRaw(content) {
  return `export default ${JSON.stringify(content)}`
}

function transformSFC(source, filename, content) {
  let clientCode = ''
  try {
    const { descriptor, errors } = parse(source, {
      filename,
      sourceMap: true
    })
    if (errors.length) {
      throw errors
    }
    const clientScript = doCompileScript(descriptor, filename)
    clientCode += clientScript
    clientCode += `
      ${COMP_IDENTIFIER}.__file = ${JSON.stringify(filename)}
      export default ${COMP_IDENTIFIER}
    `
  } catch (error) {
    const { code } = compileTemplate({
      id: filename,
      source: content,
      filename,
      transformAssetUrls: false
    })
    clientCode = `${code}\nexport default { render: render }`
  }
  return clientCode
}

function doCompileScript(descriptor, id) {
  const compiledScript = compileScript(descriptor, {
    id,
    inlineTemplate: true,
    script: {
      inlineTemplate: true,
      reactivityTransform: true
    },
    templateOptions: {
      ssr: false
    }
  })
  const code = `\n
    ${rewriteDefault(compiledScript.content, COMP_IDENTIFIER)}\n
  `
  return code
}
