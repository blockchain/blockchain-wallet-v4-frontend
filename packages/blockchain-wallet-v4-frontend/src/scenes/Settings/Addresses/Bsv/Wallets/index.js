import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions, model } from 'data'
import { getData } from './selectors'
import Wallets from './template'

class BsvWalletsContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  onSendBsv = index => {
    this.props.modalActions.showModal(model.components.sendBsv.MODAL, { index })
  }

  onSwapBsv = account => {}

  render () {
    const { data, search } = this.props

    return data.cata({
      Success: value => {
        return (
          <Wallets
            search={search && search.toLowerCase()}
            data={value}
            onSendBsv={this.onSendBsv}
            onSwapBsv={this.onSwapBsv}
          />
        )
      },
      Failure: () => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector('walletTxSearch')(state, 'search')
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BsvWalletsContainer)
