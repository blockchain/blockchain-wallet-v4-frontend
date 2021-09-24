import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { WalletFiatType } from '@core/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import Failure from '../template.failure'
import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const BankList = (props: Props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.brokerageActions.fetchBankTransferAccounts()
      props.withdrawActions.fetchWithdrawalFees('ALL')
    }
    props.custodialActions.fetchCustodialBeneficiaries(props.fiatCurrency)
  }, [])

  return props.data.cata({
    Failure: () => <Failure {...props} handleClose={props.handleClose} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  withdrawActions: bindActionCreators(actions.components.withdraw, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  fiatCurrency: WalletFiatType
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(BankList)
