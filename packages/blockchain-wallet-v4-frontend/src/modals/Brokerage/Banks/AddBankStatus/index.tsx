import React, { useCallback } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { AddBankStatus } from 'components/Flyout/Brokerage'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'

import { Loading, LoadingTextEnum } from '../../../components'
import { getData } from './selectors'

export type OwnProps = {
  handleClose: () => void
  yapilyBankId?: string
}
type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
}

const LinkBankStatus = (props: Props) => {
  const cancelGoBack = useCallback(() => {
    props.brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK
    })
  }, [])

  return props.data.cata({
    Failure: () => null,
    Loading: () => <Loading text={LoadingTextEnum.PROCESSING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.PROCESSING} />,
    Success: (val) => (
      <AddBankStatus
        handleClose={props.handleClose}
        bankStatus={val.bankStatus}
        retryAction={cancelGoBack}
      />
    )
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & LinkDispatchPropsType & ConnectedProps<typeof connector>

export default connector(LinkBankStatus)
