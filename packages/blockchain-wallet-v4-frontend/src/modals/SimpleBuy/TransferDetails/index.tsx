import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  FiatType,
  RemoteDataType,
  SBAccountType,
  SBOrderType,
  SBPairType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class TransferDetails extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.fetchSBPaymentAccount()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: e => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  cryptoCurrency?: CoinType
  displayBack?: boolean
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

export default connector(TransferDetails)
