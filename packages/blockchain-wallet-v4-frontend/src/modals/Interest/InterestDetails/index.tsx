import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  InterestAccountBalanceType,
  InterestRateType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RatesType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class InterestForm extends PureComponent<Props> {
  state = {}

  handleDepositClick = () => {
    this.props.interestActions.showInterestModal('DEPOSIT')
  }

  handleRefresh = () => {
    this.props.interestActions.showInterestModal('DEPOSIT')
  }

  render () {
    const { data } = this.props
    return data.cata({
      Success: val => (
        <Success
          {...val}
          {...this.props}
          handleDepositClick={this.handleDepositClick}
        />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  handleClose: () => void
  handleSBClick: () => void
}

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
  simpleBuyActions: typeof actions.components.simpleBuy
}

export type SuccessStateType = {
  coin: CoinType
  interestAccountBalance: InterestAccountBalanceType
  interestRate: InterestRateType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(InterestForm)
