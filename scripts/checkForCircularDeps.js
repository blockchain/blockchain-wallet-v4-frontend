/* eslint-disable */
const chalk = require('chalk')
const madge = require('madge')

madge('./packages/blockchain-wallet-v4-frontend/src/index.js').then((res) => {
  const result = res.circular()
  if (result && result.length > 0) {
    console.log(chalk.red.bold(`Error: ${result.length} circular dependencies found`))
    result.forEach((r) => {
      console.log(chalk.yellow(JSON.stringify(r)))
    })
    process.exit(1)
  }
})
