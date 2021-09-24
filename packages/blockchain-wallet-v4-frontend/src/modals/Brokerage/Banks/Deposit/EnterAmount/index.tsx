import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { SBPaymentMethodType } from '@core/network/api/simpleBuy/types'
import { ExtractSuccess, RemoteDataType, WalletFiatType } from '@core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankDWStepType, BankPartners, BankTransferAccountType } from 'data/types'

import { Loading, LoadingTextEnum } from '../../../../components'
import getData from './selectors'
import Failure from './template.failure'
import Success from './template.success'

const EnterAmount = (props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.buySellActions.fetchSBPaymentMethods(props.fiatCurrency)
      props.buySellActions.fetchSBFiatEligible(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
      props.buySellActions.fetchSDDEligibility()
    }
  }, [props.fiatCurrency])

  const onSubmit = () => {
    if (
      props.defaultMethod &&
      'partner' in props.defaultMethod &&
      props.defaultMethod.partner === BankPartners.YAPILY
    ) {
      props.brokerageActions.setDWStep({
        dwStep: BankDWStepType.AUTHORIZE
      })
    } else {
      props.brokerageActions.setDWStep({
        dwStep: BankDWStepType.CONFIRM
      })
    }
  }

  return props.data.cata({
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => (
      <Success
        {...val}
        {...props}
        onSubmit={onSubmit}
        initialValues={{ currency: props.fiatCurrency }}
      />
    )
  })
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.components.brokerage.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method: SBPaymentMethodType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  defaultMethod: BankTransferAccountType | undefined
  fiatCurrency: WalletFiatType | undefined
}

export type Props = OwnProps & ConnectedProps<typeof connector>
export type ValidateProps = Props & SuccessStateType & LinkStatePropsType

export default connector(EnterAmount)
