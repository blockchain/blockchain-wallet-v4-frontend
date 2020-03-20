import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { RemoteDataType, SBAccountType, SBOrderType } from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import TransferDetails from './template.transfer'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
type SuccessStateType = {
  account: SBAccountType
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class OrderDetails extends PureComponent<Props, State> {
  state = {}

  render () {
    switch (this.props.order.state) {
      case 'PENDING_CONFIRMATION':
      case 'PENDING_DEPOSIT':
        return this.props.data.cata({
          Success: val => <TransferDetails {...val} {...this.props} />,
          Failure: e => <DataError message={{ message: e }} />,
          Loading: () => <Loading />,
          NotAsked: () => <Loading />
        })
    }
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetails)
