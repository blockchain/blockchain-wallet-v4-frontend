import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletOptionsType } from '@core/types'
import { actions, selectors } from 'data'

import Exchange from './template'

class ExchangeContainer extends React.PureComponent<Props> {
  onSignup = () => {
    this.props.modalActions.showModal('LINK_TO_EXCHANGE_ACCOUNT_MODAL', {
      origin: 'TheExchangePage'
    })
  }

  render() {
    return <Exchange onSignup={this.onSignup} {...this.props} />
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    exchange: 'https://exchange.blockchain.com'
  } as WalletOptionsType['domains']),
  isExchangeAccountLinked: selectors.modules.profile
    .isExchangeAccountLinked(state)
    .getOrElse(false),
  isExchangeRelinkRequired: selectors.modules.profile
    .isExchangeRelinkRequired(state)
    .getOrElse(false)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  domains: { exchange: string }
  isExchangeAccountLinked: boolean
  isExchangeRelinkRequired: boolean | number
}

export type Props = ConnectedProps<typeof connector>

export default connector(ExchangeContainer)
