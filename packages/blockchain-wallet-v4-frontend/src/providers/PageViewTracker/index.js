import React from 'react'
import ReactDOM from 'react-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectors } from 'data'
import styled from 'styled-components'

const Iframe = styled.iframe`
  position: absolute;
  left: -1000px;
  top: -1000px;
  opacity: 0;
`

class PageViewTracker extends React.PureComponent {
  componentDidUpdate (prevProps) {
    const { location } = this.props
    const { location: prevLocation } = prevProps
    const node = ReactDOM.findDOMNode(this)
    if (location.pathname !== prevLocation.pathname) {
      node.contentWindow.postMessage(
        { method: 'trackPageView', trackingData: [location.pathname] },
        '*'
      )
    }
  }

  render () {
    const { domains } = this.props
    const { walletHelper } = domains
    return (
      <Iframe
        id='matomo-iframe'
        src={walletHelper + '/wallet-helper/matomo/#/'}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  logs: selectors.logs.getLogs(state)
})

export default compose(
  withRouter,
  connect(mapStateToProps)
)(PageViewTracker)
