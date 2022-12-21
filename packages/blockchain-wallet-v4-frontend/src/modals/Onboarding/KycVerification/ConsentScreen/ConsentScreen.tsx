import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import {
  IconBlockchain,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { Button } from 'blockchain-info-components'
import Flyout, { duration } from 'components/Flyout'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
import { actions } from 'data'
import { Analytics, ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const ConsentScreen = ({ close, position, total, userClickedOutside }) => {
  const dispatch = useDispatch()
  const [isOpen, setOpen] = useState<boolean>(true)

  useEffect(() => {
    // TODO add tracking events
  }, [])

  const handleClose = useCallback(async () => {
    setOpen(false)

    await new Promise((resolve) => {
      setTimeout(() => {
        close?.call(ModalName.KYC_CONSENT_SCREEN)

        setTimeout(resolve, 0)
      }, duration)
    })
  }, [close])

  const handleClickOnContinue = () => {
    // TODO add tracking event
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.ONBOARDING_PERSONAL_INFORMATION_ENTERED,
        properties: {
          origin: 'SETTINGS'
        }
      })
    )
    // TODO Start a prove flow
  }

  return (
    <Flyout
      position={position}
      isOpen={isOpen}
      userClickedOutside={userClickedOutside}
      onClose={handleClose}
      data-e2e='consentScreenModal'
      total={total}
    >
      <FlyoutContainer>
        <FlyoutHeader data-e2e='consentScreen' mode='close' onClick={handleClose}>
          <FormattedMessage
            id='modals.kycVerification.consentScreen.title'
            defaultMessage='Verify your account'
          />
        </FlyoutHeader>

        <FlyoutContent mode='middle'>
          <div>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <IconBlockchain color={PaletteColors['blue-600']} label='logo' size='large' />
            </div>

            <Text as='p' variant='title3' textAlign='center'>
              <FormattedMessage
                id='modals.kycVerification.consentScreen.mainTitle'
                defaultMessage='Let’s gather your information'
              />
            </Text>

            <Text as='p' variant='body1' textAlign='center' color={SemanticColors.body}>
              <FormattedMessage
                id='modals.kycVerification.consentScreen.mainSubTitle'
                defaultMessage='Click "Continue" to begin the process'
              />
            </Text>
          </div>
        </FlyoutContent>

        <FlyoutFooter collapsed>
          <Padding bottom={1}>
            <Text as='p' variant='paragraph1' textAlign='center' color={SemanticColors.overlay}>
              <FormattedMessage
                id='modals.kycVerification.consentScreen.bySelectingContinue'
                defaultMessage='By selecting "Continue", you agree to use Prove to verify your account.'
              />
            </Text>
          </Padding>
          <Button
            data-e2e='continueWithProveFlow'
            height='48px'
            size='16px'
            nature='primary'
            onClick={handleClickOnContinue}
            fullwidth
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </FlyoutFooter>
      </FlyoutContainer>
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.KYC_CONSENT_SCREEN, { transition: duration })

export default enhance(ConsentScreen)
