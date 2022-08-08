import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  BSOrderType,
  BSPairType,
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType
} from '@core/types'
import DataError from 'components/DataError'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

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
      Success: (val) => <Success {...val} {...this.props} order={this.props.order} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  order: selectors.components.buySell.getBSOrder(state).data
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
  pair: BSPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  order?: BSOrderType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BankWireDetails)
