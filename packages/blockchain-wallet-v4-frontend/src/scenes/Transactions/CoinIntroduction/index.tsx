import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'

import { CoinType, SupportedWalletCurrenciesType } from 'core/types'
import { ModalNamesType } from 'data/types'
import Welcome from './template'

class CoinIntroductionContainer extends React.PureComponent<Props> {
  render () {
    const { coin, modalActions, supportedCoins, simpleBuyActions } = this.props
    const currentCoin = supportedCoins[coin]
    return (
      <Welcome
        currentCoin={currentCoin}
        handleRequest={() =>
          modalActions.showModal(
            `@MODAL.REQUEST.${currentCoin.coinCode}` as ModalNamesType,
            {
              origin: 'EmptyFeed'
            }
          )
        }
        handleBuy={() => simpleBuyActions.showModal('EmptyFeed', coin)}
      />
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
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
type LinkStatePropsType = {
  supportedCoins: SupportedWalletCurrenciesType | Error
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinIntroductionContainer)
