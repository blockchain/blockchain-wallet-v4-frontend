import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { FlyoutContent, FlyoutHeader, StyledContainer } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { VerifyIdComponent } from '../types'

const StyledImage = styled(Image)`
  max-height: 500px;
`

const VerifyId: VerifyIdComponent = ({ handleClose }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VIEWED,
        properties: {}
      })
    )
  }, [])

  const verifyCallback = useCallback(() => {
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'CowboysSignupModal',
        tier: 2
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_VERIFY_ID_CLICKED,
        properties: {}
      })
    )
  }, [dispatch])

  const onClose = useCallback(() => {
    handleClose()
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_RAFFLE_INTERSTITIAL_CLOSED,
        properties: {}
      })
    )
  }, [])

  return (
    <StyledContainer>
      {/* position the FlyoutHeader absolutely so the content image can butt up against the top of the modal */}
      <div style={{ position: 'absolute', width: '100%' }}>
        <FlyoutHeader mode='close' data-e2e='CowboysSignupModal' onClick={onClose} />
      </div>
      <FlyoutContent mode='top'>
        <StyledImage name='cowboy-suite' />
        <Flex flexDirection='column' alignItems='center'>
          <Padding horizontal={77} vertical={24}>
            <Text color='grey900' size='24px' weight={700} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.suite_experience'
                defaultMessage='Win a Suite experience!'
              />
            </Text>
          </Padding>
          <Padding bottom={40} horizontal={77}>
            <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.verify_and_enter_suite'
                defaultMessage='<b>Verify your ID & refer 3+ friends</b> to be entered to win a <b>Blockchain.com suite experience.</b> You and 7 friends will see the <b>Dallas Cowboys</b> take on the Houston <b>Texans</b> live on <b>December 11th!</b>'
              />
            </Text>
          </Padding>
          <Padding bottom={40} horizontal={77}>
            <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.winners_announced'
                defaultMessage='Winners will be announced on [DATE]'
              />
            </Text>
          </Padding>
        </Flex>
        <Padding horizontal={40}>
          <Padding bottom={16}>
            <Button
              data-e2e='CowboySignupContinueButton'
              nature='primary'
              fullwidth
              onClick={verifyCallback}
            >
              <FormattedMessage
                id='modals.confirm.confirm.verify_identity'
                defaultMessage='Verify My Identity'
              />
            </Button>
          </Padding>
          <Button
            data-e2e='CowboySignupDismissButton'
            nature='empty-blue'
            fullwidth
            onClick={handleClose}
          >
            <FormattedMessage
              id='modals.recurringbuys.get_started.maybe_later'
              defaultMessage='Maybe Later'
            />
          </Button>
        </Padding>
      </FlyoutContent>
    </StyledContainer>
  )
}

export default VerifyId
