import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { OrderType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { FlyoutContainer, FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { RaffleEnteredComponent } from '../types'

const RaffleEntered: RaffleEnteredComponent = ({ handleClose, setStep }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_RAFFLE_INTERSTITIAL_VIEWED,
        properties: {}
      })
    )
  }, [])

  const continueCallback = useCallback(() => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: 'BTC',
        orderType: OrderType.BUY,
        origin: 'CowboysSignupModal'
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_RAFFLE_INTERSTITIAL_BUY_CRYPTO_CLICKED,
        properties: {}
      })
    )

    setTimeout(() => {
      setStep('verifyId')
    }, 4000)
  }, [dispatch, setStep])

  const onClose = useCallback(() => {
    handleClose()
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.COWBOYS_RAFFLE_INTERSTITIAL_CLOSED,
        properties: {}
      })
    )
  }, [])

  const heroImage =
    'https://www.blockchain.com/static/img/cowboys/7_9_22_cowboys_interstitial_raffle_icon.png'

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
          <Padding bottom={40}>
            <img width='200' src={heroImage} alt='Dallas Cowboys football players' />
          </Padding>
          <Padding bottom={16}>
            <Icon name='checkmark-circle-filled' size='48px' color='green400' />
          </Padding>
          <Padding horizontal={77} bottom={10}>
            <Text
              lineHeight='24px'
              color='grey900'
              size='24px'
              weight={700}
              style={{ textAlign: 'center' }}
            >
              <FormattedMessage
                id='copy.cowboys.you_reached_end_zone'
                defaultMessage="You've reached the end zone!"
              />
            </Text>
          </Padding>
          <Padding horizontal={77} bottom={40}>
            <Text
              lineHeight='24px'
              color='grey900'
              size='16px'
              weight={600}
              style={{ textAlign: 'center' }}
            >
              <FormattedMessage
                id='copy.cowboys.enter_details_rewards'
                defaultMessage="Raffle entry complete! You've entered the raffle to win Fantasy Camp Tickets. Winners will be announced in January."
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
                <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
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

export default RaffleEntered
