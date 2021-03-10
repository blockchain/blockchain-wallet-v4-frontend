import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  CoinType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { ModalNamesType } from 'data/types'

import Welcome from './template'

class CoinIntroductionContainer extends React.PureComponent<Props> {
  render() {
    const { coin, modalActions, supportedCoins } = this.props
    return (
      <Welcome
        handleRequest={() =>
          modalActions.showModal(
            `@MODAL.REQUEST.${supportedCoins[coin].coinCode}` as ModalNamesType,
            {
              origin: 'EmptyFeed'
            }
          )
        }
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  onboardingActions: bindActionCreators(
    actions.components.onboarding,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinIntroductionContainer)
