import { actions, model, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { pathOr } from 'ramda'
import { Remote } from 'blockchain-wallet-v4'
import React from 'react'
import Register from './template'

const { AB_TESTS } = model.analytics

class RegisterContainer extends React.PureComponent {
  componentDidMount () {
    if (Remote.Success.is(this.props.abTestR)) return

    // This line is done in AnalyticsTracker because we need to wait for
    // the matomo iframe to mount. See ../../providers/AnalyticsTracker/index
    // this.props.analyticsActions.createABTest(AB_TESTS.WALLET_PIT_SIGNUP)

    window.addEventListener('message', this.receiveMatomoMessage, false)

    // Fallback if a/b test can not be created
    setTimeout(() => {
      if (!Remote.Success.is(this.props.abTestR)) {
        this.props.analyticsActions.createABTestSuccess(
          AB_TESTS.WALLET_PIT_SIGNUP,
          'original'
        )
      }
    }, 2000)
  }

  receiveMatomoMessage = res => {
    if (res.data.from === 'matomo') {
      const result = pathOr('original', ['data', 'command'], res)
      this.props.analyticsActions.createABTestSuccess(
        AB_TESTS.WALLET_PIT_SIGNUP,
        result
      )
    }
  }

  onSubmit = () => {
    const { email, password, language } = this.props
    this.props.authActions.register(email, password, language)
  }

  render () {
    const { data, password } = this.props
    let busy = data.cata({
      Success: () => false,
      Failure: () => false,
      Loading: () => true,
      NotAsked: () => false
    })

    const passwordLength = (password && password.length) || 0

    return (
      <Register
        busy={busy}
        onSubmit={this.onSubmit}
        password={password}
        passwordLength={passwordLength}
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.auth.getRegistering(state),
  domainsR: selectors.core.walletOptions.getDomains(state),
  language: selectors.preferences.getLanguage(state),
  email: formValueSelector('register')(state, 'email'),
  goals: selectors.goals.getGoals(state),
  password: formValueSelector('register')(state, 'password') || '',
  abTestR: selectors.analytics.selectAbTest(AB_TESTS.WALLET_PIT_SIGNUP)(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterContainer)
