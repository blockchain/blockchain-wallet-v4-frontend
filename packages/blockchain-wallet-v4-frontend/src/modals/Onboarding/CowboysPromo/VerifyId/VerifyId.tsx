import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { Button, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { VerifyIdComponent } from '../types'

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
        key: Analytics.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_CLOSED,
        properties: {}
      })
    )
  }, [])

  const heroImage =
    'https://www.blockchain.com/static/img/cowboys/7_9_22_cowboys_interstitial_verify_id_icon.png'
  return (
    <FlyoutContainer>
      {/* position the FlyoutHeader absolutely so the content image can butt up against the top of the modal */}
      <FlyoutHeader
        position='absolute'
        mode='close'
        data-e2e='CowboysSignupModal'
        onClick={onClose}
      />
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column' alignItems='center'>
          <Padding bottom={40}>
            <img width='200' src={heroImage} alt='Dallas Cowboys suite' />
          </Padding>
          <Flex flexDirection='column' alignItems='center'>
            <Padding horizontal={77} bottom={24}>
              <Text color='grey900' size='24px' weight={700} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='copy.cowboys.suite_experience'
                  defaultMessage='Win a Suite experience!'
                />
              </Text>
            </Padding>
            <Padding bottom={20} horizontal={77}>
              <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='copy.cowboys.verify_and_enter_suite'
                  defaultMessage='<b>Verify your ID & refer 3+ friends</b> to be entered to win a <b>Blockchain.com suite experience.</b> You and 7 friends will see the <b>Dallas Cowboys</b> take on the Houston <b>Texans</b> live on <b>December 11th!</b>'
                />
              </Text>
            </Padding>
            <Padding horizontal={77} bottom={40}>
              <Text color='grey900' size='16px' weight={500} style={{ textAlign: 'center' }}>
                <FormattedMessage
                  id='copy.cowboys.winners_announced'
                  defaultMessage='Winners will be announced on <b>November 25th.</b>'
                />
              </Text>
            </Padding>
          </Flex>
          <div style={{ boxSizing: 'border-box', padding: '0 40px 0', width: '100%' }}>
            <Flex flexDirection='column' gap={16}>
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

export default VerifyId
