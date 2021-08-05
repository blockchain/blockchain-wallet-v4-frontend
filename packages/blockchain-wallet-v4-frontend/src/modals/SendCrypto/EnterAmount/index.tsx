import React from 'react'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'

import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'

class SendEnterAmount extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  render() {
    const { formValues } = this.props
    const { selectedAccount, to } = formValues

    return (
      <FlyoutWrapper>
        <div>From: {selectedAccount.label}</div>
        <div>To: {to}</div>
      </FlyoutWrapper>
    )
  }
}

type Props = OwnProps

export default reduxForm<{}, Props>({
  destroyOnUnmount: false,
  form: SEND_FORM
})(SendEnterAmount)
