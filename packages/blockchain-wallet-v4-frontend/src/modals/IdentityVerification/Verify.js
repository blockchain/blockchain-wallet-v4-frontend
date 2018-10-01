import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

import { Button, Image } from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import {
  IdentityVerificationForm,
  ColLeft,
  ColRight,
  InputWrapper,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  ColRightInner
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
const DocumentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 24px;
  height: 74px;
  font-size: 18px;
  line-height: 25px;
  font-weight: 600;
`

const Verify = ({ handleSubmit, onBack }) => (
  <IdentityVerificationForm>
    <FooterShadowWrapper
      fields={
        <VerifyWrapper>
          <ColLeft>
            <InputWrapper>
              <IdentityVerificationHeader>
                <FormattedMessage
                  id='identityverification.verify.header'
                  defaultMessage='Verify Your Identity'
                />
              </IdentityVerificationHeader>
              <IdentityVerificationSubHeader>
                <FormattedMessage
                  id='identityverification.verify.message'
                  defaultMessage='Last step! We need to confirm your identity with a government issued ID. Before proceeding, make sure you have one of the following forms of ID handy.'
                />
              </IdentityVerificationSubHeader>
              <DocumentsWrapper>
                <FormattedMessage
                  id='identityverification.verify.passport'
                  defaultMessage='Government Issued Passport'
                />
                <FormattedMessage
                  id='identityverification.verify.driverslicense'
                  defaultMessage='Driver’s License'
                />
              </DocumentsWrapper>
            </InputWrapper>
          </ColLeft>
          <ColRight>
            <ColRightInner>
              <Image name='identity-verification' width='100%' />
            </ColRightInner>
          </ColRight>
        </VerifyWrapper>
      }
      footer={
        <Footer>
          <Button nature='transferred' onClick={onBack}>
            <FormattedMessage
              id='identityverification.personal.back'
              defaultMessage='Back'
            />
          </Button>
          <Button nature='primary' onClick={handleSubmit}>
            <FormattedMessage
              id='identityverification.personal.continue'
              defaultMessage='Continue'
            />
          </Button>
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

Verify.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Verify
