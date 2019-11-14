import { Palette } from '../Colors'
import { ThemeProvider } from 'styled-components'
import PropTypes from 'prop-types'
import React from 'react'

const Themes = props => {
  const { theme, children } = props
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
