import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

import { Link, Text } from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import {
  BackButton,
  ColLeft,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  IdentityVerificationImage
} from 'components/IdentityVerification'

const Footer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const VerifyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`

const Verify = ({ resend, onBack, mobile }) => (
  <IdentityVerificationForm>
    <FooterShadowWrapper
      fields={
        <VerifyWrapper>
          <ColLeft>
            <InputWrapper>
              <IdentityVerificationHeader>
                <FormattedMessage
                  id='identityverification.highflow.header'
                  defaultMessage='Last Step. Continue your verification on mobile'
                />
              </IdentityVerificationHeader>
              <IdentityVerificationImage name='identity-verification' />
              <IdentityVerificationSubHeader>
                <Text>
                  <FormattedMessage
                    id='identityverification.highflow.message'
                    defaultMessage='We need to confirm your identity by taking a selfie video'
                  />
                </Text>
                <br />
                <Text>
                  <FormattedMessage
                    id='identityverification.highflow.sentlink'
                    defaultMessage='- We just sent you an SMS to {mobile} with a link to complete KYC on your mobile device'
                    values={{ mobile }}
                  />
                </Text>
                <Text>
                  <FormattedMessage
                    id='identityverification.highflow.getidready'
                    defaultMessage='- Get your ID or Passport ready'
                  />
                </Text>
                <br />
                <Link onClick={resend}>
                  <FormattedMessage
                    id='identityverification.highflow.resend'
                    defaultMessage='Resend link'
                  />
                </Link>
              </IdentityVerificationSubHeader>
            </InputWrapper>
          </ColLeft>
        </VerifyWrapper>
      }
      footer={
        <Footer>
          <BackButton onClick={onBack}>
            <FormattedMessage
              id='identityverification.personal.back'
              defaultMessage='Back'
            />
          </BackButton>
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

Verify.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Verify
