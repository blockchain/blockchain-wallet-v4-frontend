import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import { actions } from 'data'
import { Button } from 'blockchain-info-components'
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

const MoreInfoWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`

const MoreInfo = ({ goToNextStep, closeAllModals }) => (
  <IdentityVerificationForm>
    <FooterShadowWrapper
      fields={
        <MoreInfoWrapper>
          <InputWrapper>
            <IdentityVerificationHeader>
              <FormattedMessage
                id='identityverification.more_info.header'
                defaultMessage='We Need Some More Information'
              />
            </IdentityVerificationHeader>
            <IdentityVerificationImage name='identity-verification' />
            <IdentityVerificationSubHeader>
              <FormattedMessage
                id='identityverification.more_info.more_info'
                defaultMessage='We need to get a bit more information from you before you can start trading.'
              />
              <br />
              <FormattedMessage
                id='identityverification.more_info.required_documents'
                defaultMessage="You'll need to verify your phone number and provide a government issued ID and selfie. Please click Continue below to complete these final steps."
              />
            </IdentityVerificationSubHeader>
          </InputWrapper>
        </MoreInfoWrapper>
      }
      footer={
        <Footer>
          <BackButton data-e2e='moreInfoCancelButton' onClick={closeAllModals}>
            <FormattedMessage
              id='identityverification.more_info.back'
              defaultMessage='Cancel'
            />
          </BackButton>
          <Button
            nature='primary'
            data-e2e='moreInfoContinueButton'
            onClick={goToNextStep}
          >
            <FormattedMessage
              id='identityverification.more_info.continue'
              defaultMessage='Continue'
            />
          </Button>
        </Footer>
      }
    />
  </IdentityVerificationForm>
)

const mapDispatchToProps = dispatch => ({
  goToNextStep: () =>
    dispatch(actions.components.identityVerification.goToNextStep()),
  closeAllModals: () => dispatch(actions.modals.closeAllModals())
})

export default connect(
  undefined,
  mapDispatchToProps
)(MoreInfo)
