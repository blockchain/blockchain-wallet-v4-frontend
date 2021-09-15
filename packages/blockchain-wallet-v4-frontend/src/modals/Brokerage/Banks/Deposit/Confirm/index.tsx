import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BrokerageTxFormValuesType } from 'data/types'

import Failure from '../template.failure'
import Loading from '../template.loading'
import { getData } from './selectors'
import Success from './template.success'

const DepositMethods = (props: Props) => {
  useEffect(() => {
    props.sendActions.getLockRule()
  }, [])

  return props.data.cata({
    Failure: () => <Failure {...props} handleClose={props.handleClose} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...val} {...props} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.core.settings.getCurrency(state),
  formValues: selectors.form.getFormValues('brokerageTx')(state) as BrokerageTxFormValuesType
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  sendActions: bindActionCreators(actions.components.send, dispatch)
})

export type OwnProps = {
  handleClose: () => void
}
const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DepositMethods)
