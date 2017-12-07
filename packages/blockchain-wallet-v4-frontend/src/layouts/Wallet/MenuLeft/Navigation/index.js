import React from 'react'
import ui from 'redux-ui'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Navigation from './template.js'

const NavigationContainer = ({ ui, updateUI, resetUI, handleCloseMenuLeft, ...props }) => {
  const { emailVerified, isMnemonicVerified, mobileVerified, passwordHintEnabled, twoFactorEnabled, blockTorIpsEnabled } = props
  const securityScore = emailVerified + isMnemonicVerified + mobileVerified + passwordHintEnabled + twoFactorEnabled + blockTorIpsEnabled

  return (
    <Navigation
      settingsToggled={ui.settingsToggled}
      handleOpenSettings={() => { updateUI({ settingsToggled: true }); handleCloseMenuLeft() }}
      handleCloseSettings={() => { updateUI({ settingsToggled: false }); handleCloseMenuLeft() }}
      handleCloseMenuLeft={() => handleCloseMenuLeft()}
      securityScore={securityScore}
      {...props}
    />
  )
}

const mapStateToProps = (state) => ({
  emailVerified: selectors.core.settings.getEmailVerified(state),
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state),
  mobileVerified: selectors.core.settings.getSmsVerified(state),
  passwordHintEnabled: selectors.core.settings.getHint(state) ? 1 : 0,
  twoFactorEnabled: selectors.core.settings.getAuthType(state) > 0 ? 1 : 0,
  blockTorIpsEnabled: selectors.core.settings.getBlockTorIps(state)
})

const enhance = compose(
  connect(mapStateToProps),
  ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } }))

export default enhance(NavigationContainer)
