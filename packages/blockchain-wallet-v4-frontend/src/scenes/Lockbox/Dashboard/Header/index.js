import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Header from './template.js'

class HeaderContainer extends React.PureComponent {
  render () {
    const { device } = this.props
    return <Header deviceName={device.name} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(HeaderContainer)
