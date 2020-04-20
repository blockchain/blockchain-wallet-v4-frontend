import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RemoteDataType, SBAccountType, SBOrderType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class TransferDetails extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.fetchSBPaymentAccount()
  }

  render () {
    switch (this.props.order.state) {
      case 'PENDING_CONFIRMATION':
      case 'PENDING_DEPOSIT':
        return this.props.data.cata({
          Success: val => <Success {...val} {...this.props} />,
          Failure: e => <DataError message={{ message: e }} />,
          Loading: () => <Loading />,
          NotAsked: () => <Loading />
        })
      default:
        return null
    }
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type SuccessStateType = {
  account: SBAccountType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TransferDetails)
