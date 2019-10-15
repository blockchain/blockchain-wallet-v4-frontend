import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions, model, selectors } from 'data'

const { AB_TESTS } = model.analytics

const Iframe = styled.iframe`
  position: absolute;
  left: -1000px;
  top: -1000px;
  opacity: 0;
  height: 0;
  width: 0;
`

class AnalyticsTracker extends React.PureComponent {
  handleOnLoad = () => {
    this.props.analyticsActions.createABTest(AB_TESTS.WALLET_PIT_SIGNUP)
  }

  render () {
    const { domains, siteId } = this.props
    return (
      <Iframe
        id='matomo-iframe'
        onLoad={this.handleOnLoad}
        src={domains.walletHelper + '/wallet-helper/matomo/#/?siteId=' + siteId}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const mapStateToProps = state => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    walletHelper: 'https://wallet-helper.blockchain.com'
  }),
  siteId: selectors.core.walletOptions.getAnalyticsSiteId(state).getOrElse(3) // prod siteId is 3
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsTracker)
