import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { keys, includes, toUpper } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import Actions from './template'

const { COIN_MODELS } = model.coins
class ActionsContainer extends React.PureComponent {
  showModal = type => {
    const { coin, erc20List, lockboxPath, lockboxDeviceId } = this.props
    if (includes(coin, erc20List)) {
      return this.props.modalActions.showModal(`@MODAL.${type}.ETH`, {
        coin: toUpper(coin)
      })
    } else if (includes(coin, keys(COIN_MODELS))) {
      return this.props.modalActions.showModal(`@MODAL.${type}.${coin}`, {
        lockboxIndex: lockboxPath ? lockboxDeviceId : null
      })
    }
    return this.props.modalActions.showModal(`@MODAL.${type}.BTC`, {
      lockboxIndex: lockboxPath ? lockboxDeviceId : null
    })
  }

  render () {
    const { sendAvailable, requestAvailable } = this.props
    return (
      <Actions
        sendAvailable={sendAvailable}
        requestAvailable={requestAvailable}
        showModal={this.showModal}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(ActionsContainer)
