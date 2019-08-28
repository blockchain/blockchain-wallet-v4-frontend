import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import Error from './template.error'
import { Wrapper } from 'components/Public'

class VerifyEmailToken extends React.PureComponent {
  state = {
    token: decodeURIComponent(
      this.props.location.pathname.split('/verify-email/')[1]
    ),
    context: new URLSearchParams(this.props.location.search).get('context')
  }

  componentDidMount () {
    this.props.miscActions.verifyEmailToken(this.state.token)
  }

  getMobileLinkOut = () => {
    const { context } = this.state
    const isProdEnv = this.props.appEnv === 'prod'

    const link = isProdEnv
      ? 'https://blockchain.page.link/email_verified'
      : 'https://blockchainwalletstaging.page.link/email_verified'

    return context != null ? `${link}?context=${context}` : link
  }

  render () {
    const { data } = this.props

    let VerifyEmailStatus = data.cata({
      Success: () => <Success mobileLinkOut={this.getMobileLinkOut()} />,
      Failure: error => <Error error={error} />,
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
