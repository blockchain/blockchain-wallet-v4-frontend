import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import Loading from '../EnterAmount/template.loading'
import getData from './selectors'
import Success from './template.success'

class BankPicker extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.custodialActions.fetchCustodialBeneficiaries(this.props.fiatCurrency)
      this.props.brokerageActions.fetchBankTransferAccounts()
    }
  }

  render() {
    return this.props.data.cata({
      Failure: () => (
        <FlyoutOopsError
          action='close'
          data-e2e='withdrawReload'
          handler={this.props.handleClose}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BankPicker)
