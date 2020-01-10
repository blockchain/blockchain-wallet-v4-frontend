import { connect } from 'react-redux'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { merge } from 'ramda'
import { Palette } from 'blockchain-info-components'
import { selectors } from 'data'
import { theme } from '@blockchain-com/components'
import { ThemeProvider } from 'styled-components'
import React from 'react'

const mapStateToProps = createDeepEqualSelector(
  [selectors.preferences.getTheme],
  themeName => {
    const oldTheme = Palette(themeName)
    const newTheme = merge(theme, oldTheme)
    return { theme: newTheme }
  }
)

const CustomThemeProvider = ({ children, theme }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default connect(mapStateToProps)(CustomThemeProvider)
