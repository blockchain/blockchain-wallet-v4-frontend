import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { RemoteData } from 'blockchain-wallet-v4/src'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Balance extends React.Component {
  constructor (props) {
    super(props)
    this.handleCoinDisplay = this.handleCoinDisplay.bind(this)
  }

  componentWillMount () {
    this.props.actions.fetchMetadataEthereum()
  }

  handleCoinDisplay () {
    this.props.preferencesActions.toggleCoinDisplayed()
  }

  render () {
    const { data } = this.props

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success bitcoinContext={value[0]} etherContext={value[1]} handleCoinDisplay={this.handleCoinDisplay} />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Balance)
