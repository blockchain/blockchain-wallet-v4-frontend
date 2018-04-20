import React from 'react'
import ui from 'redux-ui'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import { SecurityGauge } from 'blockchain-info-components'

class SecurityGaugeContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <SecurityGauge score={value} />,
      Failure: (message) => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'MenuLeft', persist: true, state: { settingsToggled: false } }))

export default enhance(SecurityGaugeContainer)
