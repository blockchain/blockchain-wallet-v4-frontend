import React from 'react'
import ui from 'redux-ui'

import SecuritySettings from './template.js'

class SecurityContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  render () {
    return <SecuritySettings toggled={this.props.ui.toggled} handleToggle={this.handleToggle} />
  }
}

export default ui({ state: { toggled: false } })(SecurityContainer)
