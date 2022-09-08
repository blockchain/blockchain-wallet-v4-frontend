import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { OrderType } from '@core/types'
import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'
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
        key: Analytics.COWBOYS_VERIFY_IDENTITY_INTERSTITIAL_CLOSED,
        properties: {}
      })
    )
  }, [])

  return (
    <FlyoutContainer>
      <FlyoutHeader mode='close' data-e2e='CowboysSignupModal' onClick={onClose} />
      <FlyoutContent mode='middle'>
        <Flex flexDirection='column' alignItems='center'>
          <Padding bottom={16}>
            <Icon name='checkmark-circle-filled' size='48px' color='green400' />
          </Padding>
          <Padding horizontal={77}>
            <Text color='grey900' size='24px' weight={700} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.you_reached_end_zone'
                defaultMessage="You've reached the end zone!"
              />
            </Text>
          </Padding>
          <Padding bottom={68} horizontal={77}>
            <Text color='grey900' size='16px' weight={600} style={{ textAlign: 'center' }}>
              <FormattedMessage
                id='copy.cowboys.enter_details_rewards'
                defaultMessage="Raffle entry complete! You've entered the raffle to win a signed Dak jersey. Winners will be announced MM/DD/YYYY"
              />
            </Text>
          </Padding>
          <Padding>
            <Image name='cowboys-jersey' />
          </Padding>
        </Flex>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <Padding bottom={16}>
          <Button
            data-e2e='CowboySignupContinueButton'
            nature='primary'
            fullwidth
            onClick={continueCallback}
          >
            <FormattedMessage id='buttons.buy_crypto' defaultMessage='Buy Crypto' />
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
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default RaffleEntered
