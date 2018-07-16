
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.actions.showModal('PairingCode')
  }

  render () {
    return <Settings handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(SettingsContainer)
