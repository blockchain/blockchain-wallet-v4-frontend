import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { getData } from './selectors'
import { actions, model } from 'data'
import Loading from './template.loading'
import DataError from 'components/DataError'

export const { ONFIDO_STARTED } = model.analytics.KYC

const VeriffIframe = styled.iframe.attrs({
  allow: 'camera'
})`
  width: 100%;
  height: 100%;
  border: none;
`

class Veriff extends React.PureComponent {
  componentDidMount () {
    this.props.actions.fetchVeriffUrl()
    this.props.analytics.logKycEvent(ONFIDO_STARTED)
    window.addEventListener('message', this.handleVeriffMessage, false)
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.handleVeriffMessage)
  }

  handleVeriffMessage = ({ data, origin }) => {
    const { veriffDomain, actions } = this.props
    if (origin !== veriffDomain) return
    if (data.status !== 'finished') return
    actions.syncVeriff()
  }

  render () {
    const { veriffUrl, actions } = this.props
    return veriffUrl.cata({
      Success: url => (
        <VeriffIframe
          data-e2e='veriffIframe'
          src={url}
          sandbox='allow-same-origin allow-scripts'
          scrolling='no'
          id='veriff-iframe'
        />
      ),
      Loading: () => <Loading />,
      Failure: () => (
        <DataError data-e2e='veriffFailure' onClick={actions.fetchVeriffUrl} />
      ),
      NotAsked: () => <Loading />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.veriff, dispatch),
  kycActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(Veriff)
