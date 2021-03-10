import React from 'react'
import { connect } from 'react-redux'
import { theme } from '@blockchain-com/components'
import { merge } from 'ramda'
import { ThemeProvider } from 'styled-components'

import { Palette } from 'blockchain-info-components'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

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
