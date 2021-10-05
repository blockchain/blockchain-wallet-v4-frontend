import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import {
  Everypay3DSResponseType,
  ProviderDetailsType,
  RemoteDataType,
  SBCardType,
  SBOrderType,
} from '@core/types'
import DataError from 'components/DataError'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

class ThreeDSHandler extends PureComponent<Props, State> {
  state: State = {
    threeDSCallbackReceived: false
  }

  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage, false)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !prevProps.data.getOrElse({ order: {} } as SuccessStateType).order &&
      this.props.data.getOrElse({ order: {} } as SuccessStateType).order
    ) {
      // eslint-disable-next-line
      this.setState({ threeDSCallbackReceived: false })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage, false)
  }

  handlePostMessage = (event: MessageEvent) => {
    if (event.data.from !== 'everypay') return
    if (event.data.to !== 'sb') return
    if (event.data.command !== 'finished') return

    this.setState({ threeDSCallbackReceived: true })
    // @ts-ignore
    const { card, order, type } = this.props.data.getOrElse({
      card: { id: '' },
      order: { id: '' },
      type: null
    } as SuccessStateType)

    switch (type) {
      case 'ORDER':
        this.props.buySellActions.pollOrder(order.id)
        break
      case 'CARD':
        this.props.buySellActions.pollCard(card.id)
        break
      default:
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
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType =
  | { domains: { walletHelper: string }; order: SBOrderType; type: 'ORDER' }
  | {
      card: SBCardType
      domains: { walletHelper: string }
      order: SBOrderType
      providerDetails: ProviderDetailsType
      threeDSDetails: Everypay3DSResponseType
      type: 'CARD'
    }
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type State = { threeDSCallbackReceived: boolean }

export default connector(ThreeDSHandler)
