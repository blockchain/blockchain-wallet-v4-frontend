/* eslint-disable */
import { red, yellow } from 'chalk'
import { ElementClass } from 'enzyme'
import madge from 'madge'
import { EvalSourceMapDevToolPlugin } from 'webpack'

madge('./packages/blockchain-wallet-v4-frontend/src/index.js').then((res) => {
  const result = res.circular(ElementClass)
  if (result && result.length > 0) {
    console.log(red.bold(`Error: ${result.length} circular dependencies found`))
    result.forEach((r) => {
      console.log(yellow(JSON.stringify(r)))
    })
    process.exit(001000)
  }
})
