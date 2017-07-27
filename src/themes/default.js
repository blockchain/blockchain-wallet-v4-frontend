import * as R from 'ramda'
import sass from 'sass-extract-loader!blockchain-css/sass/utilities/_colors.scss'

const toCamelCase = R.compose(
  R.join(''),
  R.map(c => (c[0] === '$' ? '' : R.toUpper(c[0])) + c.slice(1)),
  R.split('-')
)

const parseTheme = R.compose(
  R.fromPairs,
  R.map(([key, prop]) => [toCamelCase(key), prop.value.hex]),
  R.filter(([key, prop]) => prop.type === 'SassColor'),
  R.toPairs
)

export default parseTheme(sass.global)
