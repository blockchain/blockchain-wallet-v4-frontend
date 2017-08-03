import React from 'react'
import ui from 'redux-ui'
import SecuritySettings from './template.js'

const SecuritySettingsContainer = ({ ui, updateUI, ...props }) => (
  <SecuritySettings
    toggled={ui.toggled}
    handleToggle={() => updateUI({ toggled: !ui.toggled })}
    {...props}
  />
)

const enhance = ui({ state: { toggled: false } })

export default enhance(SecuritySettingsContainer)
