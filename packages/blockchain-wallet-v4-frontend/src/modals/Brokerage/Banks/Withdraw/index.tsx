import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import { BeneficiaryType, WalletFiatType, WithdrawResponseType } from '@core/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName, WithdrawStepEnum } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { BROKERAGE_INELIGIBLE } from '../../../components'
import Rejected from '../../../components/Rejected'
import { ModalPropsType } from '../../../types'
import BankPicker from './BankPicker'
import ConfirmWithdraw from './ConfirmWithdraw'
import Loading from './ConfirmWithdraw/template.loading'
import EnterAmount from './EnterAmount'
import OnHold from './OnHold'
import getData from './selectors'
import WithdrawalDetails from './WithdrawalDetails'
import WithdrawalMethods from './WithdrawalMethods'

class Withdraw extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='custodyWithdrawModal'
        >
          <Loading {...this.props} />
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='custodyWithdrawModal'
        >
          <Loading {...this.props} />
        </Flyout>
      ),
      Success: (val) => {
        const { userData } = val
        const { kycState } = userData
        const isUserRejectedOrExpired = kycState === 'REJECTED' || kycState === 'EXPIRED'

        return isUserRejectedOrExpired ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
            data-e2e='custodyWithdrawModal'
          >
            <Rejected handleClose={this.handleClose} />
          </Flyout>
        ) : (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
            data-e2e='custodyWithdrawModal'
          >
            <FlyoutChild>
              {this.props.step === WithdrawStepEnum.LOADING && <Loading {...this.props} />}
              {this.props.step === WithdrawStepEnum.ENTER_AMOUNT && (
                <EnterAmount {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === WithdrawStepEnum.WITHDRAWAL_METHODS && (
                <WithdrawalMethods {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === WithdrawStepEnum.BANK_PICKER && (
                <BankPicker {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === WithdrawStepEnum.CONFIRM_WITHDRAW && (
                <ConfirmWithdraw {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === WithdrawStepEnum.WITHDRAWAL_DETAILS && (
                <WithdrawalDetails {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === WithdrawStepEnum.INELIGIBLE && (
                <DataError message={{ message: BROKERAGE_INELIGIBLE }} />
              )}
              {this.props.step === WithdrawStepEnum.ON_HOLD && (
                <OnHold handleClose={this.handleClose} />
              )}
            </FlyoutChild>
          </Flyout>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  amount: selectors.components.withdraw.getAmount(state),
  beneficiary: selectors.components.withdraw.getBeneficiary(state),
  data: getData(state),
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state),
  step: selectors.components.withdraw.getStep(state),
  withdrawal: selectors.components.withdraw.getWithdrawal(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.CUSTODY_WITHDRAW_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType =
  | {
      step: WithdrawStepEnum.LOADING | WithdrawStepEnum.INELIGIBLE | WithdrawStepEnum.ON_HOLD
    }
  | {
      beneficiary?: BeneficiaryType
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.ENTER_AMOUNT
    }
  | {
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.BANK_PICKER
    }
  | {
      amount: string
      beneficiary: BeneficiaryType
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.CONFIRM_WITHDRAW
    }
  | {
      step: WithdrawStepEnum.WITHDRAWAL_DETAILS
      withdrawal: WithdrawResponseType
    }
  | {
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.WITHDRAWAL_METHODS
    }
// export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(Withdraw)
