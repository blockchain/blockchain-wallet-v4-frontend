import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'

import { Palette } from '../Colors/index.ts'

const Themes = props => {
  const { children, theme } = props
  const colors = Palette(theme)

  return <ThemeProvider theme={colors}>{children}</ThemeProvider>
}

Themes.propTypes = {
  theme: PropTypes.string
}

Themes.defaultProps = {
  theme: 'default'
}
export { Themes }
