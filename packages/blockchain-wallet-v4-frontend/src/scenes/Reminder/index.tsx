import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import Reminder from './template'

class ReminderContainer extends React.PureComponent<Props> {
  componentWillUnmount() {
    this.props.authActions.remindGuidNotAsked()
  }

  onSubmit = () => {
    const { authActions, captcha, code, email } = this.props
    const { sessionToken } = captcha.getOrElse({ sessionToken: null })

    authActions.remindGuid(email, code, sessionToken)
  }

  render() {
    const { remindGuid } = this.props
    const { loading, success } = remindGuid.cata({
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
  captcha: selectors.core.data.misc.getCaptcha(state) as RemoteDataType<
    string,
    { sessionToken: any }
  >,
  remindGuid: selectors.auth.getRemindGuid(state)
})

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ReminderContainer)
