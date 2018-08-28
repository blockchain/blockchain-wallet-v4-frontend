import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Menu from './template.js'

class MenuContainer extends React.PureComponent {
  render () {
    const { deviceName } = this.props
    return <Menu deviceName={deviceName} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(MenuContainer)
