import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { ModalName, ModalNameType } from 'data/types'

import { getData } from './selectors'
import Features from './template'

class FeaturesContainer extends React.PureComponent<Props> {
  showModal = (type) => {
    const { coin, lockboxDeviceId, lockboxPath, modalActions } = this.props

    if (!window.coins[coin]) {
      if (type === 'REQUEST') {
        return modalActions.showModal('REQUEST_CRYPTO_MODAL', {
          origin: 'FeaturesTopNav'
        })
      }

      return this.props.modalActions.showModal(ModalName.SEND_BTC_MODAL as ModalNameType, {
        lockboxIndex: lockboxPath ? lockboxDeviceId : null,
        origin: 'FeaturesTopNav'
      })
    }

    const { coinfig } = window.coins[coin]

    if (type === 'REQUEST') {
      return modalActions.showModal('REQUEST_CRYPTO_MODAL', {
        coin,
        origin: 'FeaturesTopNav'
      })
    }

    // TODO: remove with send refactor 🙏
    if (coinfig.type.erc20Address) {
      return modalActions.showModal(`SEND_ETH_MODAL` as ModalNameType, {
        coin,
        origin: 'FeaturesTopNav'
      })
    }
    if (selectors.core.data.coins.getCoins().includes(coin)) {
      return this.props.modalActions.showModal(ModalName.SEND_CRYPTO_MODAL, {
        coin,
        origin: 'FeaturesTopNav'
      })
    }
    if (window.coins[coin]) {
      return this.props.modalActions.showModal(`SEND_${coin}_MODAL` as ModalNameType, {
        coin,
        lockboxIndex: lockboxPath ? lockboxDeviceId : null,
        origin: 'FeaturesTopNav'
      })
    }
    return this.props.modalActions.showModal(ModalName.SEND_BTC_MODAL, {
      lockboxIndex: lockboxPath ? lockboxDeviceId : null,
      origin: 'FeaturesTopNav'
    })
  }

  render() {
    return <Features showModal={this.showModal} {...this.props} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(getData, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(FeaturesContainer)
