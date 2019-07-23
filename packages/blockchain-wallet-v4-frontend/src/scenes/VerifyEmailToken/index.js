import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import Error from './template.error'
import { Wrapper } from 'components/Public'

const VALID_CONTEXTS = ['PIT_SIGNUP', 'KYC', 'SETTINGS']
const PARAM_DEEP_LINK_PATH = 'email_verified'
const PARAM_ISI = '493253309'
const PARAM_IBI = 'com.rainydayapps.Blockchain'
const PARAM_APN = 'piuk.blockchain.android'

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
      ? 'https://blockchain.page.link/'
      : 'https://blockchainwalletstaging.page.link/'

    const params = new URLSearchParams()
    params.set('deep_link_path', PARAM_DEEP_LINK_PATH)
    params.set('isi', PARAM_ISI)
    params.set('ibi', PARAM_IBI)
    params.set('apn', PARAM_APN)

    if (VALID_CONTEXTS.indexOf(context) > -1) {
      params.set('context', context)
    }

    const deepLinkComponent = `${window.location.origin}/login?${params}`

    return link + '?link=' + encodeURIComponent(deepLinkComponent)
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
