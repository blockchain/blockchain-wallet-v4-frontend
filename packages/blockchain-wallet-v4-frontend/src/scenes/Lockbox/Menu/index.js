import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData } from './selectors'
import Header from './template'

class HeaderContainer extends React.PureComponent {
  // TODO: @header issue
  // Move this back to dashboard index page
  render () {
    const {
      deviceInfo,
      btcBalance,
      bchBalance,
      ethBalance
    } = this.props.data.cata({
      Success: val => val,
      Failure: () => ({}),
      NotAsked: () => ({}),
      Loading: () => ({})
    })
    return (
      <Header
        deviceName={deviceInfo.name}
        btcBalance={btcBalance}
        bchBalance={bchBalance}
        ethBalance={ethBalance}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)
