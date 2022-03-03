import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { FlyoutOopsError } from 'components/Flyout/Errors'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { OBEntityType } from 'data/types'

import { LoadingUpdating as Loading } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

const Authorize = (props) => {
  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError action='close' data-e2e='addBankClose' handler={props.handleClose} />
    ),
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (val) => <Success {...props} {...val} />
  })
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})
const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  buySellActions: typeof actions.components.buySell
}
type OwnProps = {
  entity: OBEntityType
  handleClose: () => void
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Authorize)
