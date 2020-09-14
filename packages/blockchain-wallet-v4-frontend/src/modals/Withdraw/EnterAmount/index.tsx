import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from 'core/types'
import { getData } from './selectors'
import { UserDataType, WithdrawCheckoutFormValuesType } from 'data/types'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.custodialActions.fetchCustodialBeneficiaries(
      this.props.fiatCurrency
    )
  }

  handleSubmit = () => {
    const { defaultBeneficiary } = this.props.data.getOrElse(
      {} as SuccessStateType
    )

    this.props.withdrawActions.setStep({
      step: 'CONFIRM_WITHDRAW',
      amount: this.props.formValues.amount,
      beneficiary: this.props.beneficiary || defaultBeneficiary
    })
  }

  handleBankSelection = (
    userData: UserDataType,
    beneficiary?: BeneficiaryType
  ) => {
    if (!beneficiary) {
      this.props.simpleBuyActions.showModal('WithdrawModal')
      if (userData.tiers.current === 2) {
        this.props.simpleBuyActions.setStep({
          step: 'TRANSFER_DETAILS',
          fiatCurrency: this.props.fiatCurrency,
          displayBack: false
        })
      } else {
        this.props.simpleBuyActions.setStep({
          step: 'KYC_REQUIRED'
        })
      }
    }

    if (beneficiary) {
      this.props.withdrawActions.setStep({
        step: 'BANK_PICKER',
        fiatCurrency: this.props.fiatCurrency
      })
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          handleBankSelection={this.handleBankSelection}
        />
      ),
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps),
  formValues: selectors.form.getFormValues('custodyWithdrawForm')(
    state
  ) as WithdrawCheckoutFormValuesType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
