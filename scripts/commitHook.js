/* eslint-disable */
const chalk = require('chalk')
const sgf = require('staged-git-files')

// checks current files in commit for reducer files.  Warning user if any are found
sgf((error, files) => {
  if (error) return
  if (
    files
      .map(file => file.filename)
      .filter(filename => filename.includes('reducer')).length
  ) {
    console.log(
      chalk.red.bold('.: Warning :.\n') +
        chalk.yellow(
          "You've modified a reducer file. Please verify the Redux state import/export feature still works before creating PR."
        )
    )
  }
})
