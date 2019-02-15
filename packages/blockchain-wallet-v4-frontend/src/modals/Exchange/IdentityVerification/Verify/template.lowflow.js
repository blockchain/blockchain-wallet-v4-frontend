import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import { model } from 'data'
import { map, flip, prop } from 'ramda'
import {
  Button,
  Image,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FooterShadowWrapper } from 'components/Form'
import {
  BackButton,
  IdentityVerificationForm,
  InputWrapper,
  IdentityVerificationImage,
  IdentityVerificationHeader,
  IdentityVerificationSubHeader,
  FaqHeaderHelper,
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
const VerifyIdentityVerificationSubHeader = styled(
  IdentityVerificationSubHeader
)`
  margin-top: 30px;
  max-width: 600px;
  ${media.laptop`
    max-width: 500px;
  `};
`
const VerifyIdentityVerificationImage = styled(IdentityVerificationImage)`
  margin: 0;
  display: block;
  ${media.tablet`
    display: none;
  `};
`
const AllowCameraImage = styled(IdentityVerificationImage)`
  margin-top: 12px;
  max-width: 325px;
  ${media.tablet`
    display: none;
  `};
`
const DocumentListWrapper = styled.div`
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
  margin-top: 44px;
  > div {
    margin-bottom: 12px;
  }
  img {
    margin-top: 16px;
  }
`
const ResubmitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  & > :first-child {
    flex-basis: max-content;
    margin-right: 50px;
  }
`
const ResubmissionGuidelines = styled.div`
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  height: 100%;
`
const ResubmissionSubHeader = styled(VerifyIdentityVerificationSubHeader)`
  margin: 20px 0 30px;
`
const ResubmitChecklist = styled.div`
  > div:not(:first-child) {
    margin-top: 5px;
    > span {
      &:before {
        content: '- ';
      }
    }
  }
`
const ResubmitCameraReminder = styled.div`
  margin-top: 30px;
`
const { SUPPORTED_DOCUMENTS } = model.components.identityVerification

const supportedDocList = {
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
const resubmissionTipList = [
  <FormattedMessage
    key='missing'
    id='dentityverification.verify.resubmit.reason.missing'
    defaultMessage='The required photos are missing'
  />,
  <FormattedMessage
    key='incorrect'
    id='identityverification.verify.resubmit.reason.incorrect'
    defaultMessage='The document you submitted is incorrect'
  />,
  <FormattedMessage
    key='quality'
    id='identityverification.verify.resubmit.reason.quality'
    defaultMessage='We were unable to read the images you submitted due to image quality'
  />
]

const Verify = ({
  handleSubmit,
  onBack,
  supportedDocuments,
  showVeriff,
  needsDocResubmit
}) => (
  <IdentityVerificationForm>
    <FooterShadowWrapper
      fields={
        <VerifyWrapper>
          {showVeriff ? (
            <Veriff />
          ) : needsDocResubmit ? (
            <InputWrapper>
              <ResubmitWrapper>
                <ResubmissionGuidelines>
                  <IdentityVerificationHeader>
                    <FormattedMessage
                      id='identityverification.verify.resubmit.header'
                      defaultMessage='Resubmit your verification information.'
                    />
                  </IdentityVerificationHeader>
                  <ResubmissionSubHeader>
                    <FormattedMessage
                      id='identityverification.verify.resubmit.message'
                      defaultMessage="Unfortunately we're having trouble verifying your identity and we need you to resubmit your verification information."
                    />
                  </ResubmissionSubHeader>
                  <ResubmitChecklist>
                    <Text size='16px' weight={300}>
                      <FormattedMessage
                        id='identityverification.verify.resubmit.reason.intro'
                        defaultMessage='Main reasons for this to happen are'
                      />
                      :
                    </Text>
                    {resubmissionTipList.map(t => (
                      <Text key={t.key} size='16px' weight={300}>
                        {t}
                      </Text>
                    ))}
                  </ResubmitChecklist>
                  <ResubmitCameraReminder>
                    <Text size='16px' weight={500}>
                      <FormattedMessage
                        id='identityverification.verify.resubmit.camera.one'
                        defaultMessage='Remember to turn the camera on'
                      />
                    </Text>
                    <Text size='16px' weight={300} style={{ margin: '5px 0' }}>
                      <FormattedMessage
                        id='identityverification.verify.resubmit.camera.two'
                        defaultMessage='Click allow on the pop up that will appear on the next screen.'
                      />
                    </Text>
                  </ResubmitCameraReminder>
                  <AllowCameraImage
                    name='allow-camera'
                    srcset={{
                      'allow-camera2': '2x',
                      'allow-camera3': '3x'
                    }}
                  />
                </ResubmissionGuidelines>
                <IdentityVerificationImage name='identity-verification' />
              </ResubmitWrapper>
            </InputWrapper>
          ) : (
            <InputWrapper>
              <IdentityVerificationHeader>
                <FormattedMessage
                  id='identityverification.verify.header.confirm'
                  defaultMessage="Last Step. Let's Confirm It's You"
                />
                <FaqHeaderHelper>
                  <TooltipHost id='identityverification.headerhelper'>
                    <TooltipIcon
                      name='question-in-circle-filled'
                      color='brand-primary'
                      size='24px'
                    />
                  </TooltipHost>
                  <VerifyIdentityVerificationImage name='identity-verification' />
                </FaqHeaderHelper>
              </IdentityVerificationHeader>
              <VerifyIdentityVerificationSubHeader>
                <FormattedMessage
                  id='identityverification.verify.messagewithcamera'
                  defaultMessage='We need to confirm your identity with a government issued ID and selfie. Before proceeding, make sure you have one of the following forms of ID handy and your camera is enabled.'
                />
              </VerifyIdentityVerificationSubHeader>
              <DocumentListWrapper>
                {map(flip(prop)(supportedDocList), supportedDocuments)}
              </DocumentListWrapper>
              <SubInstructions>
                <Text size='18px'>
                  <FormattedMessage
                    id='identityverification.verify.how_to_camera_mic'
                    defaultMessage='How do I enable my camera and microphone?'
                  />
                </Text>
                <Text weight={300}>
                  <FormattedMessage
                    id='identityverification.verify.instructions'
                    defaultMessage='Click allow when prompted above or enable in your browser settings.'
                  />
                </Text>
                <Image
                  name='allow-camera'
                  srcset={{
                    'allow-camera2': '2x',
                    'allow-camera3': '3x'
                  }}
                />
              </SubInstructions>
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
                id='identityverification.lowflow.personal.continue'
                defaultMessage='Continue'
              />
            </Button>
          )}
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

Verify.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  needsDocResubmit: PropTypes.bool
}

export default Verify
