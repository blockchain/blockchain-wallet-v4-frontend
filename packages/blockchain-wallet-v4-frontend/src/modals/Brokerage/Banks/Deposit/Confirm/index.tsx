import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { getFormValues } from 'redux-form'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Success from './template.success'

const DepositMethods = (props: Props) => {
  return <Success {...props} />
}

const mapStateToProps = (state: RootState) => ({
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.core.settings.getCurrency(state),
  formValues: getFormValues('brokerageTx')(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

export type OwnProps = {
  handleClose: () => void
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositMethods)
