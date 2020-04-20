import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { formValueSelector } from 'redux-form'
import React from 'react'
import Reminder from './template'

class ReminderContainer extends React.PureComponent<Props> {
  componentWillUnmount () {
    this.props.authActions.remindGuidNotAsked()
  }

  onSubmit = () => {
    const { email, code, captcha, authActions } = this.props
    const { sessionToken } = captcha.getOrElse({})

    authActions.remindGuid(email, code, sessionToken)
  }

  render () {
    const { remindGuid } = this.props
    const { success, loading } = remindGuid.cata({
      Success: () => ({ success: true }),
      Loading: () => ({ loading: true }),
      Failure: () => ({}),
      NotAsked: () => ({})
    })

    return (
      <Reminder onSubmit={this.onSubmit} success={success} loading={loading} />
    )
  }
}

const mapStateToProps = state => ({
  email: formValueSelector('reminder')(state, 'email'),
  code: formValueSelector('reminder')(state, 'code'),
  captcha: selectors.core.data.misc.getCaptcha(state),
  remindGuid: selectors.auth.getRemindGuid(state)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

export default connector(ReminderContainer)
