import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'

import { CoinType, SupportedWalletCurrenciesType } from 'core/types'
import { ModalNamesType } from 'data/types'
import Welcome from './template'

class CoinIntroductionContainer extends React.PureComponent<Props> {
  render () {
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
