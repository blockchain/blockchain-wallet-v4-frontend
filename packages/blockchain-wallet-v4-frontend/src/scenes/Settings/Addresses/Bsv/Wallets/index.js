import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Wallets from './template'

class BsvWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onSendBsv = account => {}

  onSwapBsv = account => {}

  render () {
    const { data, search } = this.props

    return data.cata({
      Success: value => (
        <Wallets
          search={search && search.toLowerCase()}
          data={value}
          onSendBsv={this.onSendBsv}
          onSwapBsv={this.onSwapBsv}
        />
      ),
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector('settingsAddresses')(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  modalsActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvWalletsContainer)
