import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { path, prop } from 'ramda'

const SiftScienceIframe = styled.iframe`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
  top: -1000px;
  left: -1000px;
`

class SiftScience extends Component {
  componentDidMount () {
    let receiveMessage = e => {
      // const helperDomain = path(
      //   ['domains', 'walletHelper'],
      //   this.props.walletOptions
      // )
      if (!e.data.command) return
      if (e.data.from !== 'sift-science') return
      if (e.data.to !== 'exchange') return
      // if (e.origin !== helperDomain) return
      switch (e.data.command) {
        case 'done':
          this.props.onDone && this.props.onDone()
          break
        default:
          return null
      }
    }
    window.addEventListener('message', receiveMessage, false)
  }

  render () {
    const { options, userId, sessionId = '', siftKey } = this.props

    if (!userId) {
      return null
    }

    const walletOptions = options || prop('data', this.props.walletOptions)
    const helperDomain = path(['domains', 'walletHelper'], walletOptions)
    let url = `${helperDomain}/wallet-helper/sift-science/#/key/${siftKey}/user/${userId}/sessionId/${sessionId}`
    return (
      <SiftScienceIframe src={url} scrolling='no' id='sift-science-iframe' />
    )
  }
}

const mapStateToProps = state => ({
  walletOptions: path(['walletOptionsPath'], state)
})

export default connect(mapStateToProps)(SiftScience)
