import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { includes, keys } from 'ramda'
import React from 'react'

import { actions } from 'data'
import { CoinTypeEnum } from 'core/types'

import { getData } from './selectors'
import { ModalNamesType } from 'data/types'
import Features from './template'

class FeaturesContainer extends React.PureComponent<Props> {
  showModal = type => {
    const {
      coin,
      erc20List,
      lockboxPath,
      lockboxDeviceId,
      modalActions,
      supportedCoins
    } = this.props
    // TODO: remove BTC check just for dev testing now
    if (type === 'REQUEST' && coin === 'BTC') {
      return modalActions.showModal('REQUEST_CRYPTO_MODAL', {
        coin: coin in CoinTypeEnum && coin,
        origin: 'FeaturesTopNav'
      })
    }
    // TODO: remove with send refactor
    if (includes(coin, erc20List)) {
      return modalActions.showModal(`@MODAL.${type}.ETH` as ModalNamesType, {
        coin,
        origin: 'FeaturesTopNav'
      })
    } else if (includes(coin, keys(supportedCoins))) {
      return this.props.modalActions.showModal(
        `@MODAL.${type}.${coin}` as ModalNamesType,
        {
          lockboxIndex: lockboxPath ? lockboxDeviceId : null,
          origin: 'FeaturesTopNav'
        }
      )
    }
    return this.props.modalActions.showModal(
      `@MODAL.${type}.BTC` as ModalNamesType,
      {
        lockboxIndex: lockboxPath ? lockboxDeviceId : null,
        origin: 'FeaturesTopNav'
      }
    )
  }

  render () {
    return <Features showModal={this.showModal} {...this.props} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(getData, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(FeaturesContainer)
