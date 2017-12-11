import React from 'react'
import ui from 'redux-ui'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions, selectors } from 'data'
import { SecurityGauge } from 'blockchain-info-components'

class SecurityGaugeContainer extends React.Component {
  componentWillMount () {
    this.props.actions.initSecurityGauge()
  }

  render () {
    return <SecurityGauge score={this.props.securityGauge.score} />
  }
}

const mapStateToProps = state => ({
  securityGauge: selectors.modules.securityGauge.getSecurityGauge(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modules.securityGauge, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } }))

export default enhance(SecurityGaugeContainer)
