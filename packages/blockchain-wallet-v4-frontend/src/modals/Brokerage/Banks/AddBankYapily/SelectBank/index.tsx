import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'

import { getData } from './selectors'

const SelectBank = props => {
  useEffect(() => {
    props.brokerageActions.fetchBankLinkCredentials(
      props.fiatCurrency as WalletFiatType
    )
  }, [])
  return (
    <>
      sup
      <button
        onClick={() =>
          props.brokerageActions.setAddBankStep({
            addBankStep: AddBankStepType.ADD_BANK_AUTHORIZE
          })
        }
      >
        Go to next step
      </button>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'GBP'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(SelectBank)
