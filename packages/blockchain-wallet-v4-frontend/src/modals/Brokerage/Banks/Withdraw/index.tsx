import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import {
  BeneficiaryType,
  WalletFiatType,
  WithdrawResponseType
} from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { WithdrawStepEnum } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { BROKERAGE_INELIGIBLE } from '../../../components'
import { ModalPropsType } from '../../../types'
import BankPicker from './BankPicker'
import ConfirmWithdraw from './ConfirmWithdraw'
import Loading from './ConfirmWithdraw/template.loading'
import EnterAmount from './EnterAmount'
import WithdrawalDetails from './WithdrawalDetails'
import WithdrawalMethods from './WithdrawalMethods'

class Withdraw extends PureComponent<Props> {
  state: State = { show: false }

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
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        isOpen={this.state.show}
        data-e2e='custodyWithdrawModal'
      >
        {this.props.step === WithdrawStepEnum.LOADING && (
          <FlyoutChild>
            <Loading {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.ENTER_AMOUNT && (
          <FlyoutChild>
            <EnterAmount {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.WITHDRAWAL_METHODS && (
          <FlyoutChild>
            <WithdrawalMethods {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.BANK_PICKER && (
          <FlyoutChild>
            <BankPicker {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.CONFIRM_WITHDRAW && (
          <FlyoutChild>
            <ConfirmWithdraw {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.WITHDRAWAL_DETAILS && (
          <FlyoutChild>
            <WithdrawalDetails {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === WithdrawStepEnum.INELIGIBLE && (
          <FlyoutChild>
            <DataError message={{ message: BROKERAGE_INELIGIBLE }} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  amount: selectors.components.withdraw.getAmount(state),
  beneficiary: selectors.components.withdraw.getBeneficiary(state),
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state),
  step: selectors.components.withdraw.getStep(state),
  withdrawal: selectors.components.withdraw.getWithdrawal(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer('CUSTODY_WITHDRAW_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType =
  | {
      step: WithdrawStepEnum.LOADING | WithdrawStepEnum.INELIGIBLE
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
export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(Withdraw)
