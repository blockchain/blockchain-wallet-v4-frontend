import React from 'react'
import ui from 'redux-ui'

import Navigation from './template.js'

const NavigationContainer = ({ ui, updateUI, resetUI, handleCloseMenuLeft, ...props }) => {
  return (
    <Navigation
      settingsToggled={ui.settingsToggled}
      handleOpenSettings={() => { updateUI({ settingsToggled: true }); handleCloseMenuLeft() }}
      handleCloseSettings={() => { updateUI({ settingsToggled: false }); handleCloseMenuLeft() }}
      handleCloseMenuLeft={() => handleCloseMenuLeft()}
      {...props}
    />
  )
}

const enhance = ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } })

export default enhance(NavigationContainer)
