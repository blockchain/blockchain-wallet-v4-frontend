import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { CoinType, FiatType } from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class DepositForm extends PureComponent<Props> {
  componentDidMount () {
    this.handleInitializeDepositForm()
  }

  handleDisplayToggle = isCoin => {
    const { displayCoin } = this.props.data.getOrElse({
      displayCoin: false
    } as SuccessStateType)
    if (isCoin === displayCoin) return
    this.props.formActions.clearFields(
      'interestDepositForm',
      false,
      false,
      'depositAmount'
    )

    this.props.interestActions.setCoinDisplay(isCoin)
  }

  handleRefresh = () => {
    this.handleInitializeDepositForm()
  }

  handleInitializeDepositForm = () => {
    const { coin } = this.props
    const { walletCurrency } = this.props.data.getOrElse({
      walletCurrency: 'GBP' as FiatType
    } as SuccessStateType)
    this.props.interestActions.initializeDepositForm(coin, walletCurrency)
  }

  handleSubmit = () => {
    const { coin } = this.props
    this.props.interestActions.submitDepositForm(coin)
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
          onSubmit={this.handleSubmit}
          handleDisplayToggle={this.handleDisplayToggle}
        />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  formActions: typeof actions.form
  interestActions: typeof actions.components.interest
}
export type SuccessStateType = ReturnType<typeof getData>['data']

export type OwnProps = {
  coin: CoinType
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositForm)
