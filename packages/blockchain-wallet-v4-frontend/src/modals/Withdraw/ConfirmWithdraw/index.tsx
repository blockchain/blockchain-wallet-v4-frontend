import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { BeneficiaryType, ExtractSuccess, WalletFiatType } from 'core/types'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { WithdrawCheckoutFormValuesType } from 'data/types'
import Failure from './template.failure'
import Loading from './template.loading'
import Success from './template.success'

class ConfirmWithdraw extends PureComponent<Props> {
  componentDidMount () {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.withdrawActions.fetchWithdrawalFees()
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  formValues: selectors.form.getFormValues('confirmCustodyWithdraw')(
    state
  ) as WithdrawCheckoutFormValuesType,
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  amount: string
  beneficiary: BeneficiaryType
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ConfirmWithdraw)
