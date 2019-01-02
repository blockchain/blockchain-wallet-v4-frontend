import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectors } from 'data'
import styled from 'styled-components'
import { head } from 'ramda'

const Iframe = styled.iframe`
  position: absolute;
  left: -1000px;
  top: -1000px;
  opacity: 0;
  height: 0px;
  width: 0px;
`

class AnalyticsTracker extends React.PureComponent {
  constructor () {
    super()
    this.iframe = React.createRef()
  }

  componentDidUpdate (prevProps) {
    if (!this.iframe.current) return
    const { analytics, location, domains } = this.props
    const { analytics: prevAnalytics, location: prevLocation } = prevProps
    const targetOrigin = domains.walletHelper

    if (location.pathname !== prevLocation.pathname) {
      this.iframe.current.contentWindow.postMessage(
        { method: 'trackPageView', trackingData: [location.pathname] },
        targetOrigin
      )
    }
    if (head(prevAnalytics) !== head(analytics)) {
      const { trackingData } = head(analytics)
      this.iframe.current.contentWindow.postMessage(
        { method: 'trackEvent', trackingData: [trackingData] },
        targetOrigin
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
        innerRef={this.iframe}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  analytics: selectors.analytics.getAnalytics(state)
})

export default compose(
  withRouter,
  connect(mapStateToProps)
)(AnalyticsTracker)
