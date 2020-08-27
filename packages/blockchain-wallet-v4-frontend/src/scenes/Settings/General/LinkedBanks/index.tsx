import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { ExtractSuccess, RemoteDataType, WalletFiatType } from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class LinkedBanks extends PureComponent<Props> {
  componentDidMount () {
    this.props.custodialActions.fetchCustodialBeneficiaries()
    this.props.simpleBuyActions.fetchSBPaymentMethods()
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Loading: () => <Loading />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: WalletFiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(LinkedBanks)
