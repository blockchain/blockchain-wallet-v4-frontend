import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { WithdrawCheckoutFormValuesType, WithdrawStepEnum } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class ConfirmWithdraw extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.withdrawActions.fetchWithdrawalFees({})
    }
  }

  errorCallback() {
    this.props.withdrawActions.setStep({
      beneficiary: this.props.beneficiary,
      fiatCurrency: this.props.fiatCurrency,
      step: WithdrawStepEnum.ENTER_AMOUNT
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => (
        <FlyoutOopsError action='retry' data-e2e='withdrawReload' handler={this.errorCallback} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as WithdrawCheckoutFormValuesType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  amount: string
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ConfirmWithdraw)
