import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { required, validEmail } from 'services/FormHelper'
import { SecondaryButton } from 'components/generic/Button'
import { Form, TextBox, CaptchaBox } from 'components/generic/Form'
import { Text } from 'components/generic/Text'

const ReminderForm = (props) => {
  const { handleClick, submitting, invalid } = props

  return (
    <Form>
      <Text id='scenes.reminder.reminderform.email' text='Email' small medium />
      <Field name='email' validate={[required, validEmail]} component={TextBox} />
      <Text id='scenes.reminder.reminderform.captcha' text='Captcha' small medium />
      <Field name='captcha' validate={[required]} component={CaptchaBox} props={{ timestamp: props.timestamp }} />
      <SecondaryButton id='scenes.reminder.reminderform.continue' text='Continue' disabled={submitting || invalid} onClick={handleClick} fullwidth uppercase />
    </Form>
  )
}

export default reduxForm({ form: 'reminderForm' })(ReminderForm)
