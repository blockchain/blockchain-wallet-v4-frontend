import React from 'react'
import ui from 'redux-ui'
import Header from './template.js'

const HeaderContainer = ({ ui, updateUI, ...props }) => (
  <Header
    toggled={ui.toggled}
    handleToggle={() => updateUI({ toggled: !ui.toggled })}
    {...props}
  />
)

const enhance = ui({ key: 'HeaderContainer_Public', state: { toggled: false } })

export default enhance(HeaderContainer)
