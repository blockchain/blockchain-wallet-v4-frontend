import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  CoinType,
  FiatType,
  RemoteDataType,
  SBAccountType,
  SBOrderType,
  SBPairType
} from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

class BankWireDetails extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.fiatCurrency) {
      this.props.buySellActions.fetchPaymentAccount()
    }
  }

  render() {
    return this.props.data.cata({
      Failure: (e) => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  addBank?: boolean
  cryptoCurrency?: CoinType
  displayBack: boolean
  fiatCurrency: FiatType
  handleClose: () => void
  order?: SBOrderType
  pair: SBPairType
}
export type SuccessStateType = {
  account: SBAccountType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BankWireDetails)
