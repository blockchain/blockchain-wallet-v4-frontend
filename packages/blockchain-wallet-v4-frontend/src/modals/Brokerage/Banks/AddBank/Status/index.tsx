import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { ExtractSuccess, RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import BankLinkError from './template.error.general'
import Loading from './template.loading'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
}
type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  brokerageActions: typeof actions.components.brokerage
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class LinkBankStatus extends PureComponent<Props, State> {
  render() {
    return this.props.data.cata({
      Success: val =>
        val.bankStatus === 'ACTIVE' ? (
          <Success {...val} {...this.props} />
        ) : (
          <BankLinkError {...val} {...this.props} />
        ),
      Failure: () => null,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(LinkBankStatus)
