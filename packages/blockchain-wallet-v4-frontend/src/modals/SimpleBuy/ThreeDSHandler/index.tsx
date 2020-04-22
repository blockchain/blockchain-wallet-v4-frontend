import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  Everypay3DSResponseType,
  RemoteDataType,
  SBProviderDetailsType
} from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class ThreeDSHandler extends PureComponent<Props> {
  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: e => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
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

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = {
  providerDetails: SBProviderDetailsType
  threeDSDetails: Everypay3DSResponseType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ThreeDSHandler)
