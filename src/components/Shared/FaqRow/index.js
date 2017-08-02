import React from 'react'
import ui from 'redux-ui'
import FaqRow from './template.js'

const FaqRowContainer = ({ ui, updateUI, ...props }) => (
  <FaqRow
    toggled={ui.toggled}
    handleToggle={() => updateUI({ toggled: !ui.toggled })}
    {...props}
  />
)

let enhance = ui({ state: { toggled: false } })

export default enhance(FaqRowContainer)
