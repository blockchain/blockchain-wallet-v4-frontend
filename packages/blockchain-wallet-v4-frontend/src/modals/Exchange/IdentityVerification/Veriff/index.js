import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { getData } from './selectors'
import { actions } from 'data'
import Loading from './template.loading'
import Failure from './template.failure'

const VeriffIframe = styled.iframe.attrs({
  allow: 'camera; microphone'
})`
  width: 100%;
  height: 100%;
  border: none;
`

class Veriff extends React.PureComponent {
  state = {
    loading: false
  }
  componentDidMount () {
    this.props.actions.fetchVeriffUrl()
    window.addEventListener('message', this.handleVeriffMessage, false)
  }

  componentWillUnmount () {
    this.setState({ loading: false })
    window.removeEventListener('message', this.handleVeriffMessage)
  }

  handleVeriffMessage = ({ data, origin }) => {
    const { veriffDomain, actions } = this.props
    if (origin !== veriffDomain) return
    if (data.status !== 'finished') return
    this.setState({ loading: true })
    actions.syncVeriff()
  }

  render () {
    const { veriffUrl, actions, onClose } = this.props

    if (this.state.loading) return <Loading />

    return veriffUrl.cata({
      Success: url => (
        <VeriffIframe data-e2e='veriffIframe' src={url} id='veriff-iframe' />
      ),
      Loading: () => <Loading />,
      Failure: message => (
        <Failure
          data-e2e='veriffFailure'
          message={message}
          onClick={actions.fetchVeriffUrl}
          onClose={onClose}
        />
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
  )
})

export default connect(
  getData,
  mapDispatchToProps
)(Veriff)
