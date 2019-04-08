import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Text, Button } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'
import {
  Form,
  ColLeft,
  ColRight,
  ColRightInner,
  InputWrapper,
  ButtonWrapper,
  EmailHelper
} from 'components/IdentityVerification'
import media from 'services/ResponsiveService'

const EmailInput = styled.div`
  display: flex;
  margin-top: 25px;
  flex-direction: column;
`
const CreateForm = styled(Form)`
  ${media.mobile`
    flex-direction: column;
  `};
`
const ColRightEnd = styled(ColRight)`
  display: flex;
  align-items: flex-end;
`
const WideInputWrapper = styled(InputWrapper)`
  width: 100%;
`

const VerifyEmail = props => {
  const { invalid, handleSubmit, resend, codeSent } = props

  return (
    <Fragment>
      <CreateForm onSubmit={handleSubmit}>
        <ColLeft>
          <WideInputWrapper>
            <EmailInput>
              <Text size='14px' weight={400} style={{ 'margin-bottom': '5px' }}>
                <FormattedMessage
                  id='coinifyexchangedata.create.verifyemail.enteremail.youwouldlike'
                  defaultMessage="Enter the email address you'd like to verify:"
                />
              </Text>
              <Field
                name='emailAddress'
                component={TextBox}
                validate={[required]}
              />
            </EmailInput>
          </WideInputWrapper>
        </ColLeft>
        <ColRightEnd>
          <ColRightInner>
            <ButtonWrapper>
              <Button
                type='submit'
                nature='primary'
                fullwidth
                disabled={invalid}
              >
                <FormattedMessage
                  id='coinifyexchangedata.create.verifyemail.sendverifyemail'
                  defaultMessage='Send Verification Email'
                />
              </Button>
            </ButtonWrapper>
          </ColRightInner>
        </ColRightEnd>
      </CreateForm>
      {codeSent ? (
        <EmailHelper>
          <FormattedMessage
            id='coinifyexchangedata.create.verifyemail.helper.sentverificationemail'
            defaultMessage="Another verification email has been sent! Don't see it? {resend}"
            values={{ resend: <a onClick={resend}>Resend</a> }}
          />
        </EmailHelper>
      ) : null}
    </Fragment>
  )
}

export default reduxForm({ form: 'coinifyVerifyEmail' })(VerifyEmail)
