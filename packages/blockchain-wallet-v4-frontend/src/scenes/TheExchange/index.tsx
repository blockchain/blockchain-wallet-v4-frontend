import { actions, model, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, RemoteDataType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import Exchange from './template'
import React from 'react'

const { EXCHANGE_EVENTS } = model.analytics

class ExchangeContainer extends React.PureComponent<Props> {
  onSignup = () => {
    this.props.modalActions.showModal('LinkToExchangeAccount')
    this.props.analyticsActions.logEvent(EXCHANGE_EVENTS.CONNECT_NOW)
  }

  onLearnMore = () => {
    this.props.analyticsActions.logEvent(EXCHANGE_EVENTS.LEARN_MORE)
  }

  render () {
    return <Exchange onSignup={this.onSignup} {...this.props} />
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  domains: selectors.core.walletOptions
    .getDomains(state)
    .getOrElse({ exchange: 'https://exchange.blockchain.com' }),
  isExchangeAccountLinked: selectors.modules.profile
    .isExchangeAccountLinked(state)
    .getOrElse(false),
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type LinkStatePropsType = {
  data: RemoteDataType<
    string,
    { walletAddresses: { [key in CoinType]?: string } }
  >
  domains: { exchange: string }
  isExchangeAccountLinked: boolean
}

export type Props = ConnectedProps<typeof connector>

export default connector(ExchangeContainer)
