import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React from 'react'

import { actions, selectors } from 'data'

import { CoinType, SupportedCoinsType } from 'core/types'
import { currentUserTier, getCurrentKYCState, getTags } from './selectors'
import { ModalNamesType, TagsType, UserDataType } from 'data/types'
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
            `@MODAL.REQUEST.${currentCoin.coinCode}` as ModalNamesType
          )
        }
        handleBuy={() => simpleBuyActions.showModal('emptyFeed', coin)}
      />
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  currentUserTier: currentUserTier(state),
  currentTags: getTags(state),
  currentKYCState: getCurrentKYCState(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  onboardingActions: bindActionCreators(
    actions.components.onboarding,
    dispatch
  ),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  coin: CoinType
}
type LinkStatePropsType = {
  currentKYCState: UserDataType['kycState']
  currentTags: TagsType
  currentUserTier: 0 | 1 | 2
  supportedCoins: SupportedCoinsType | Error
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinIntroductionContainer)
