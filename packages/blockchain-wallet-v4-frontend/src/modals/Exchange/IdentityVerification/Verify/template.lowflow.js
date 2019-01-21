import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import { model } from 'data'
import { map, flip, prop } from 'ramda'
import { Button, Image, Text } from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import {
  BackButton,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationImage,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  Footer
} from 'components/IdentityVerification'
import Veriff from '../Veriff'

const VerifyWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const ContentWrapper = styled.div`
  max-width: 600px;
`
const DocumentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 300;
  > span:not(:first-child) {
    margin-top: 10px;
  }
  > span {
    &:before {
      content: '- ';
    }
  }
`
const SubInstructions = styled.div`
  margin-top: 25px;
  > div {
    margin-bottom: 5px;
  }
  img {
    margin-top: 20px;
  }
`

const { SUPPORTED_DOCUMENTS } = model.components.identityVerification

const docMap = {
  [SUPPORTED_DOCUMENTS['PASSPORT']]: (
    <FormattedMessage
      key='passport'
      id='identityverification.verify.passport'
      defaultMessage='Government Issued Passport'
    />
  ),
  [SUPPORTED_DOCUMENTS['DRIVING_LICENCE']]: (
    <FormattedMessage
      key='deivingLicence'
      id='identityverification.verify.driverslicense'
      defaultMessage='Driver’s License'
    />
  ),
  [SUPPORTED_DOCUMENTS['NATIONAL_IDENTITY_CARD']]: (
    <FormattedMessage
      key='id'
      id='identityverification.verify.natitionalidcard'
      defaultMessage='National Identity Card'
    />
  )
}

const Verify = ({
  handleSubmit,
  onBack,
  isCameraBlocked,
  supportedDocuments,
  showVeriff
}) => (
  <IdentityVerificationForm>
    <FooterShadowWrapper
      fields={
        <VerifyWrapper>
          {showVeriff && <Veriff />}
          {!showVeriff && (
            <InputWrapper>
              <ContentWrapper>
                <IdentityVerificationHeader>
                  <FormattedMessage
                    id='identityverification.verify.header'
                    defaultMessage='Last Step. Verify Your ID'
                  />
                </IdentityVerificationHeader>
                <IdentityVerificationImage name='identity-verification' />
                <IdentityVerificationSubHeader>
                  <FormattedMessage
                    id='identityverification.verify.message_with_cam'
                    defaultMessage='We need to confirm your identity with a government issued ID. Before proceeding, make sure you have one of the following forms of ID handy and your camera is enabled.'
                  />
                </IdentityVerificationSubHeader>
                <DocumentsWrapper>
                  {map(flip(prop)(docMap), supportedDocuments)}
                </DocumentsWrapper>
                <SubInstructions>
                  <Text size='18px' color={isCameraBlocked && 'error'}>
                    {isCameraBlocked ? (
                      <FormattedMessage
                        id='identityverification.verify.camerablocked'
                        defaultMessage="You're camera is blocked. You must enable access before continuing in your browser's settings."
                      />
                    ) : (
                      <FormattedMessage
                        id='identityverification.verify.howtocamera'
                        defaultMessage='How do I enable my camera?'
                      />
                    )}
                  </Text>
                  {!isCameraBlocked && (
                    <Text weight={300}>
                      <FormattedMessage
                        id='identityverification.verify.instructions'
                        defaultMessage='Click allow when prompted above or enable in your browser settings.'
                      />
                    </Text>
                  )}
                  <Image
                    name='allow-camera'
                    srcset={{
                      'allow-camera2': '2x',
                      'allow-camera3': '3x'
                    }}
                  />
                </SubInstructions>
              </ContentWrapper>
            </InputWrapper>
          )}
        </VerifyWrapper>
      }
      footer={
        <Footer>
          <BackButton data-e2e='lowflowBackButton' onClick={onBack}>
            <FormattedMessage
              id='identityverification.lowflow.personal.back'
              defaultMessage='Back'
            />
          </BackButton>
          {!showVeriff && (
            <Button
              nature='primary'
              data-e2e='lowflowContinueButton'
              onClick={handleSubmit}
            >
              <FormattedMessage
                id='identityverification.lowflow.personal.enable_and_continue'
                defaultMessage='Enable Camera & Continue'
              />
            </Button>
          )}
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

Verify.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

export default Verify
