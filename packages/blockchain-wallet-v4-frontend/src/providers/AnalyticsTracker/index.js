import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'
import styled from 'styled-components'

const Iframe = styled.iframe`
  position: absolute;
  left: -1000px;
  top: -1000px;
  opacity: 0;
  height: 0;
  width: 0;
`

class AnalyticsTracker extends React.PureComponent {
  render () {
    const { domains, isAuthenticated, siteId } = this.props
    // ensure iframe is added only once
    if (isAuthenticated && !document.getElementById('matomo-iframe')) {
      return (
        <Iframe
          id='matomo-iframe'
          src={
            domains.walletHelper + '/wallet-helper/matomo/#/?siteId=' + siteId
          }
        />
      )
    }
    return null
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  isAuthenticated: selectors.auth.isAuthenticated(state),
  siteId: selectors.core.walletOptions.getAnalyticsSiteId(state).getOrElse(1)
})

export default connect(mapStateToProps)(AnalyticsTracker)
