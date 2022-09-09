import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Button, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { duration } from 'components/Flyout'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { Analytics, ModalName } from 'data/types'

import { SignupComponent } from '../types'

const Signup: SignupComponent = ({ handleClose }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_WELCOME_INTERSTITIAL_VIEWED,
        properties: {}
      })
    )
  }, [])

  const continueCallback = useCallback(() => {
    // Open up the Info & Reisdential modal
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        checkSddEligibility: true,
        needMoreInfo: false,
        origin: 'CowboysSignupModal',
        tier: 2
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_WELCOME_INTERSTITIAL_CONTINUE_CLICKED,
        properties: {}
      })
    )
    setTimeout(() => {
      dispatch(actions.modals.closeModal(ModalName.COWBOYS_PROMO))
    }, duration)
  }, [dispatch])

  const onClose = useCallback(() => {
    handleClose()
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_WELCOME_INTERSTITIAL_CLOSED,
        properties: {}
      })
    )
  }, [])

  return (
    <FlyoutContainer>
      <FlyoutHeader
        position='absolute'
        mode='close'
        data-e2e='CowboysSignupModal'
        onClick={onClose}
      />
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column' alignItems='center'>
          <Padding bottom={61}>
            <Image name='cowboys' width='219px' />
          </Padding>
          <Padding bottom={24}>
            <Text color='grey900' size='24px' weight={700}>
              <FormattedMessage
                id='copy.cowboys.signup_win_big'
                defaultMessage='Sign up to win BIG!'
              />
            </Text>
          </Padding>
          <Padding bottom={80} horizontal={77}>
            <Text color='grey900' size='16px' weight={600} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.enter_details_rewards'
                defaultMessage='Enter your details to be entered for a chance to win rewards'
              />
            </Text>
          </Padding>
          <div style={{ boxSizing: 'border-box', padding: '0 40px 0', width: '100%' }}>
            <Flex flexDirection='column' gap={16}>
              <Button
                data-e2e='CowboySignupContinueButton'
                nature='primary'
                fullwidth
                onClick={continueCallback}
              >
                <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
              </Button>
              <Button
                data-e2e='CowboySignupDismissButton'
                nature='empty-blue'
                fullwidth
                onClick={onClose}
              >
                <FormattedMessage
                  id='modals.recurringbuys.get_started.maybe_later'
                  defaultMessage='Maybe Later'
                />
              </Button>
            </Flex>
          </div>
        </Flex>
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default Signup
