import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from '@core/types'
import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { WithdrawStepEnum } from 'data/types'

import WithdrawLoading from '../WithdrawLoading'
import { getData } from './selectors'
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
      Loading: () => <WithdrawLoading />,
      NotAsked: () => <WithdrawLoading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ConfirmWithdraw)
