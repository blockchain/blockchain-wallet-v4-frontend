import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { model } from 'data'
import { required, validEmail } from 'services/FormHelper'
import { EmailVerification, FormItem } from 'components/Form'
import { FaqFormGroup, Form } from 'components/IdentityVerification'
import media from 'services/ResponsiveService'

const { EMAIL_STEPS } = model.components.identityVerification

const Wrapper = styled.div`
  margin-top: 16px;
`

const KycEmailVerification = styled(EmailVerification)`
  label {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 12px;
    display: block;
  }
`
const CreateForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
  `};
`

const VerifyEmail = props => {
  const {
    editEmail,
    emailStep,
    emailVerified,
    handleSubmit,
    sendEmailVerification,
    updateEmail
  } = props

  return (
    <Wrapper>
      <CreateForm onSubmit={handleSubmit}>
        <FaqFormGroup>
          <FormItem>
            <Field
              name='email'
              component={KycEmailVerification}
              validate={[required, validEmail]}
              verificationSent={emailStep === EMAIL_STEPS.verify}
              verified={emailStep !== EMAIL_STEPS.edit && emailVerified}
              onVerificationSend={sendEmailVerification}
              onUpdate={updateEmail}
              onEdit={editEmail}
              errorBottom
            />
          </FormItem>
        </FaqFormGroup>
      </CreateForm>
    </Wrapper>
  )
}

export default reduxForm({ form: 'coinifyVerifyEmail' })(VerifyEmail)
