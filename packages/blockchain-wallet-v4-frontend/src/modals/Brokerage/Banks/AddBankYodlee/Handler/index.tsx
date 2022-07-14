import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, YodleeAccountType } from 'data/types'

import { LoadingUpdating as Loading } from '../../../../components'
import { getData } from './selectors'
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

    const { error, sites }: { error: string; sites: [YodleeAccountType] } = event.data
    if (!isEmpty(sites)) {
      try {
        this.props.brokerageActions.fetchBankTransferUpdate(sites[0])
        this.props.brokerageActions.fetchBankLinkCredentialsLoading()
      } catch (error) {
        // do nothing
      }
    } else if (error) {
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
      Failure: (e) => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} {...this.state} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
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
