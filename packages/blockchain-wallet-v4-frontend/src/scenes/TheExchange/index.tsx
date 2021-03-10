import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { actions, model, selectors } from 'data'

import Exchange from './template'

const { EXCHANGE_EVENTS } = model.analytics

class ExchangeContainer extends React.PureComponent<Props> {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToExchangeAccount', {
      origin: 'TheExchangePage'
    })
    this.props.analyticsActions.logEvent(EXCHANGE_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(EXCHANGE_EVENTS.LEARN_MORE)
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
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
