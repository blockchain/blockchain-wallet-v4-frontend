import React from 'react'
import ui from 'redux-ui'

import Navigation from './template.js'

class NavigationContainer extends React.PureComponent {
  render () {
    const { ui, updateUI, handleCloseMenuLeft, partner } = this.props
    return (
      <Navigation
        partner={partner}
        settingsToggled={ui.settingsToggled}
        handleOpenSettings={() => { updateUI({ settingsToggled: true }); handleCloseMenuLeft() }}
        handleCloseSettings={() => { updateUI({ settingsToggled: false }); handleCloseMenuLeft() }}
        handleCloseMenuLeft={() => handleCloseMenuLeft()}
        {...this.props}
      />
    )
  }
}

export default ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } })(NavigationContainer)
