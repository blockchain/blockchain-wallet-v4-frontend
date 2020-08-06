import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { ExtractSuccess, WalletFiatType } from 'core/types'
import { getData } from './selectors'
import Failure from './template.failure'
import Loading from '../EnterAmount/template.loading'
import Success from './template.success'

class BankPicker extends PureComponent<Props> {
  componentDidMount () {
    this.props.custodialActions.fetchCustodialBeneficiaries(
      this.props.fiatCurrency
    )
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...this.props} {...val} />,
      Failure: () => (
        <Failure {...this.props} handleClose={this.props.handleClose} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = { fiatCurrency: WalletFiatType; handleClose: () => void }
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BankPicker)
