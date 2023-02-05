import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { CoinType, FiatType, RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'

import getData from './selectors'
import Loading from './template.loading'
import WithdrawalForm from './template.success'

const PASSIVE_REWARDS_FORM_NAME = 'passiveRewardsWithdrawalForm'

class WithdrawalFormContainer extends PureComponent<Props> {
  componentDidMount() {
    const { walletCurrency } = this.props
    this.handleRefresh()
    this.props.interestActions.fetchEDDWithdrawLimits({ currency: walletCurrency })
  }

  handleDisplayToggle = (isCoin: boolean) => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    } as SuccessStateType)
    if (isCoin === displayCoin) return
    this.props.formActions.clearFields(PASSIVE_REWARDS_FORM_NAME, false, false, 'withdrawalAmount')
    this.props.interestActions.setCoinDisplay({ isAmountDisplayedInCrypto: isCoin })
  }

  handleRefresh = () => {
    const { coin, interestActions, walletCurrency } = this.props
    interestActions.initializeWithdrawalForm({
      coin,
      formName: PASSIVE_REWARDS_FORM_NAME,
      walletCurrency
    })
  }

  render() {
    const { data } = this.props
    return data.cata({
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => (
        <WithdrawalForm {...val} {...this.props} handleDisplayToggle={this.handleDisplayToggle} />
      )
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

export type OwnProps = {
  coin: CoinType
  setShowSupply: (boolean) => void
  walletCurrency: FiatType
}

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(WithdrawalFormContainer)
