import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import Error from './template.error'

const Wrapper = styled.div`
  width: 330px;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};
`

class VerifyEmailToken extends React.PureComponent {
  state = {
    token: decodeURIComponent(
      this.props.location.pathname.split('/verify-email/')[1]
    )
  }

  componentDidMount () {
    this.props.miscActions.verifyEmailToken(this.state.token)
  }

  getMobileLinkOut = () => {
    return this.props.appEnv === 'prod'
      ? 'https://blockchain.page.link/email_verified'
      : 'https://blockchainwalletstaging.page.link/email_verified'
  }

  onResendEmail = () => {}

  render () {
    const { data } = this.props

    let VerifyEmailStatus = data.cata({
      Success: () => <Success mobileLinkOut={this.getMobileLinkOut()} />,
      Failure: error => (
        <Error onResendEmail={this.onResendEmail} error={error} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return <Wrapper>{VerifyEmailStatus}</Wrapper>
  }
}

const mapStateToProps = state => ({
  data: selectors.core.data.misc.verifyEmailToken(state),
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod')
})

const mapDispatchToProps = dispatch => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyEmailToken)
