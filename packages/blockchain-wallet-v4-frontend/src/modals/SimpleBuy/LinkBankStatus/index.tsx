import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderType
} from 'core/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import BankLinkError from './template.error.general'
import Loading from '../template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
type LinkStatePropsType = {
  cryptoCurrency: CoinType
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: FiatType
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class LinkBankStatus extends PureComponent<Props, State> {
  render () {
    return this.props.data.cata({
      Success: val =>
        val.bankStatus === 'ACTIVE' ? (
          <Success {...val} {...this.props} />
        ) : (
          <BankLinkError {...val} {...this.props} />
        ),
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  cryptoCurrency:
    selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC',
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'USD'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(LinkBankStatus)
