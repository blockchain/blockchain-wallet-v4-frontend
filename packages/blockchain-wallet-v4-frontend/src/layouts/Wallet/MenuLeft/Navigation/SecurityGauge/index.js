import React from 'react'
import ui from 'redux-ui'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getSecurityGauge } from './selectors'
import { SecurityGauge } from 'blockchain-info-components'

class SecurityGaugeContainer extends React.Component {
  componentWillMount () {
    this.props.actions.fetchSettings()
  }

  render () {
    // return <SecurityGauge score={this.props.securityGauge.score} />
    return <div />
  }
}

const mapStateToProps = state => ({
  securityGauge: getSecurityGauge(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } }))

export default enhance(SecurityGaugeContainer)
