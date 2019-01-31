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
    return (
      <Iframe
        id='matomo-iframe'
        src={this.props.domains.walletHelper + '/wallet-helper/matomo/#/'}
      />
    )
  }
}

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  })
})

export default connect(mapStateToProps)(AnalyticsTracker)
