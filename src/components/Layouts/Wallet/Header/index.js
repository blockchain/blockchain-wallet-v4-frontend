import React from 'react'
import ui from 'redux-ui'
import Header from './template.js'

const HeaderContainer = ({ ui, updateUI, ...props }) => (
  <Header
    navigationToggled={ui.navigationToggled}
    handleToggleNavigation={() => updateUI({ navigationToggled: !ui.navigationToggled })}
    {...props}
  />
)

const enhance = ui({ key: 'Header', state: { navigationToggled: false } })

export default enhance(HeaderContainer)
