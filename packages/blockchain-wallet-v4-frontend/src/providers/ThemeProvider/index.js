import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import { merge } from 'ramda'
import { ThemeProvider } from 'styled-components'
import { theme } from '@blockchain-com/components'
import { Palette } from 'blockchain-info-components'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const mapStateToProps = createDeepEqualSelector(
  [selectors.preferences.getTheme],
  themeName => {
    const oldTheme = Palette(themeName)
    return { theme: merge(theme, oldTheme) }
  }
)

const CustomThemeProvider = ({ children, theme }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default connect(mapStateToProps)(CustomThemeProvider)
