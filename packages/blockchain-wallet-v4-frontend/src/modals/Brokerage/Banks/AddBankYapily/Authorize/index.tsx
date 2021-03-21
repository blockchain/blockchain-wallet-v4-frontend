import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Success from './template.success'

const Authorize = props => {
  return props.data.cata({
    Success: val => <Success {...props} {...val} />,
    Failure: () => null,
    Loading: () => null,
    NotAsked: () => null
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})
const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
type OwnProps = {
  entity: 'SafeConnect(UK)' | 'Fintecture(EU)'
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(Authorize)
