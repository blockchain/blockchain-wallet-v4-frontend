import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { OBEntityType } from 'data/types'

import { getData } from './selectors'
import Failure from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const Authorize = props => {
  return props.data.cata({
    Success: val => <Success {...props} {...val} />,
    Failure: () => <Failure {...props} />,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})
const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
}
type OwnProps = {
  entity: OBEntityType
  handleClose: () => void
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Authorize)
