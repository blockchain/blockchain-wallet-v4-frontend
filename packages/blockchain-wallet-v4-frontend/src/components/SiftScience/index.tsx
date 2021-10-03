import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { RootState } from 'data/rootReducer'

const SiftScienceIframe = styled.iframe`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  top: -1000px;
  left: -1000px;
`

class SiftScience extends Component<Props> {
  componentDidMount() {
    const receiveMessage = (e) => {
      if (!e.data.command) return
      if (e.data.from !== 'sift-science') return
      if (e.data.to !== 'exchange') return
      switch (e.data.command) {
        case 'done':
          // eslint-disable-next-line no-unused-expressions
          this.props.onDone && this.props.onDone()
          break
        default:
          return null
      }
    }
    window.addEventListener('message', receiveMessage, false)
  }

  render() {
    const { sessionId = '', userId } = this.props

    if (!userId) {
      return null
    }

    if (!this.props.walletOptions.data) {
      return null
    }

    const walletOptions = this.props.walletOptions.data as WalletOptionsType
    const helperDomain = walletOptions.domains.walletHelper
    const { siftKey } = this.props
    // reverse sift-science
    const url = `${helperDomain}/wallet-helper/ecneics-tfis/#/key/${siftKey}/user/${userId}/sessionId/${sessionId}`
    return <SiftScienceIframe src={url} scrolling='no' id='sift-science-iframe' />
  }
}

const mapStateToProps = (state: RootState) => ({
  walletOptions: state.walletOptionsPath
})

const connector = connect(mapStateToProps)

type OwnProps = {
  onDone?: () => void
  sessionId?: string
  siftKey?: string
  userId?: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SiftScience)
