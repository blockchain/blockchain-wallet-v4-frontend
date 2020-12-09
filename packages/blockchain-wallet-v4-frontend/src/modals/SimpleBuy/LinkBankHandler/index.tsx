import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { FastLinkType } from 'data/types'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class LinkBankHandler extends PureComponent<Props, State> {
  componentDidMount () {
    window.addEventListener('message', this.handlePostMessage, false)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handlePostMessage, false)
  }

  handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'yodlee') return
    if (event.data.to !== 'sb') return

    const { sites } = event.data
    this.props.simpleBuyActions.fetchBankTransferUpdate(sites)
    this.props.simpleBuyActions.fetchBTUpdateLoading()
    // eslint-disable-next-line
    console.info('YODLEE MSG:', event.data)
  }

  render () {
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
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = {
  fastLink: FastLinkType
  iFrameUrl: string
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type State = { threeDSCallbackReceived: boolean }

export default connector(LinkBankHandler)
