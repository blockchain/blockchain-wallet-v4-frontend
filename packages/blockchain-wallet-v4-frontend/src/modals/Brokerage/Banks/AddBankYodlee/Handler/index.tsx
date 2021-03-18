import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkBankHandler extends PureComponent<Props, State> {
  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage, false)
  }

  handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'yodlee') return
    if (event.data.to !== 'sb') return

    const { error, sites } = event.data
    if (!isEmpty(sites)) {
      this.props.brokerageActions.fetchBankTransferUpdate(sites)
      this.props.brokerageActions.fetchBTUpdateLoading()
    } else if (error) {
      this.props.analyticsActions.logEvent([
        'BANK_LINK_FAILED',
        error.additionalStatus,
        error.providerName,
        error.providerId
      ])
      this.props.brokerageActions.setAddBankStep({
        addBankStep: AddBankStepType.ADD_BANK
      })
    } else {
      this.props.brokerageActions.setAddBankStep({
        addBankStep: AddBankStepType.ADD_BANK
      })
    }
  }

  render() {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} {...this.state} />,
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
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = {
  iFrameUrl: string
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type State = { threeDSCallbackReceived: boolean }

export default connector(LinkBankHandler)
