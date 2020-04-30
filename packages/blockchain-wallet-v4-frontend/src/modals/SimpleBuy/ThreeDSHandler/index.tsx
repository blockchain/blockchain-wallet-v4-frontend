import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import {
  Everypay3DSResponseType,
  RemoteDataType,
  SBCardType,
  SBOrderType,
  SBProviderDetailsType
} from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class ThreeDSHandler extends PureComponent<Props, State> {
  state: State = {
    threeDSCallbackReceived: false
  }

  componentDidMount () {
    window.addEventListener('message', this.handlePostMessage, false)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handlePostMessage, false)
  }

  handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'everypay') return
    if (event.data.to !== 'sb') return
    if (event.data.command !== 'finished') return

    this.setState({ threeDSCallbackReceived: true })
    // @ts-ignore
    const { card, order, type } = this.props.data.getOrElse({
      type: null,
      card: { id: '' },
      order: { id: '' }
    })

    switch (type) {
      case 'ORDER':
        this.props.simpleBuyActions.pollSBOrder(order.id)
        break
      case 'CARD':
        this.props.simpleBuyActions.pollSBCard(card.id)
        break
      default:
    }
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

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType =
  | { domains: { walletHelper: string }; order: SBOrderType; type: 'ORDER' }
  | {
      card: SBCardType
      domains: { walletHelper: string }
      order: SBOrderType
      providerDetails: SBProviderDetailsType
      threeDSDetails: Everypay3DSResponseType
      type: 'CARD'
    }
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type State = { threeDSCallbackReceived: boolean }

export default connector(ThreeDSHandler)
