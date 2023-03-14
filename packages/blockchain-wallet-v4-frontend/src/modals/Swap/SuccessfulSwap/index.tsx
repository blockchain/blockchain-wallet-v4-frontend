/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'ramda'
import styled from 'styled-components'

import { SwapOrderType } from '@core/types'
import { Button, Image, Text } from 'blockchain-info-components'
import { duration, FlyoutWrapper } from 'components/Flyout'
import { getOutput } from 'data/components/swap/model'
import { Analytics, ModalName } from 'data/types'

import { Props as BaseProps, SuccessStateType } from '..'

const Wrapper = styled(FlyoutWrapper)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const StyledText = styled(Text)`
  margin-top: 24px;
`

const StyledSubText = styled(Text)`
  margin-top: 4px;
`

const StyledEarnSubText = styled(Text)`
  margin-top: 30px;
  padding: 0 50px;
  text-align: center;
`

const StyledDoneButton = styled(Button)`
  margin-top: 16px;
`

const StyledEarnButton = styled(Button)`
  margin-top: 24px;
`

const SuccessfulSwap: React.FC<Props> = (props) => {
  const {
    analyticsActions,
    close,
    formActions,
    handleClose,
    interestEligible,
    interestRates,
    isRewardsFlowAfterSwapEnabled,
    order
  } = props
  if (!order) return null

  const swappedCurrency = useMemo(() => getOutput(order), [order])
  const swappedCurrencyHasRate = useMemo(
    () => interestRates[swappedCurrency],
    [swappedCurrency, interestRates]
  )

  const interestEligibleCoin = useMemo(
    () =>
      !isEmpty(interestEligible) &&
      !isEmpty(swappedCurrency) &&
      order.state === 'FINISHED' &&
      interestEligible[swappedCurrency] &&
      interestEligible[swappedCurrency]?.eligible,
    []
  )

  const isRewardsFullyEnabled = useMemo(
    () => isRewardsFlowAfterSwapEnabled && interestEligibleCoin && swappedCurrencyHasRate,
    [isRewardsFlowAfterSwapEnabled, interestEligibleCoin, swappedCurrencyHasRate]
  )

  const handleEarnRewardsButton = useCallback(() => {
    analyticsActions.trackEvent({
      key: Analytics.SWAP_EARN_REWARDS_BUTTON_CLICKED,
      properties: {
        currency: swappedCurrency,
        device: 'WEB'
      }
    })
    close(ModalName.SWAP_MODAL)
    setTimeout(() => {
      props.interestActions.showInterestModal({
        coin: swappedCurrency,
        step: 'ACCOUNT_SUMMARY'
      })
    }, duration)
  }, [])

  useEffect(() => {
    if (isRewardsFullyEnabled) {
      analyticsActions.trackEvent({
        key: Analytics.SWAP_EARN_REWARDS_BUTTON_VIEWED,
        properties: {
          currency: swappedCurrency,
          device: 'WEB'
        }
      })
    }
  }, [isRewardsFullyEnabled, swappedCurrency, analyticsActions])

  const onDoneClick = useCallback(() => {
    formActions.destroy('initSwap')
    handleClose()
  }, [])

  return (
    <Wrapper>
      <Image name='swap-success' size='32px' />
      <StyledText size='20px' color='grey800' weight={600} style={{ marginTop: '24px' }}>
        <FormattedMessage id='copy.swap_complete' defaultMessage='Swap Complete' />
      </StyledText>
      {order.state === 'FINISHED' ? (
        <StyledSubText size='14px' color='grey600' weight={600}>
          <FormattedMessage
            id='copy.swap_available_in_wallet'
            defaultMessage='Your {coin} is now available in your Wallet.'
            values={{
              coin: window.coins[swappedCurrency].coinfig.name
            }}
          />
        </StyledSubText>
      ) : (
        <StyledSubText size='14px' color='grey600' weight={600}>
          <FormattedMessage
            id='copy.swap_arrive_soon'
            defaultMessage='Your {coin} will arrive soon.'
            values={{
              // @ts-ignore
              coin: swappedCurrency
            }}
          />
        </StyledSubText>
      )}
      {!isRewardsFullyEnabled && (
        <StyledDoneButton
          data-e2e='swapDone'
          nature='primary'
          fullwidth
          jumbo
          onClick={handleClose}
        >
          <FormattedMessage id='buttons.done' defaultMessage='Done' />
        </StyledDoneButton>
      )}
      {isRewardsFullyEnabled && (
        <>
          <StyledEarnSubText size='14px' color='grey600' weight={600}>
            <FormattedMessage
              id='copy.swap_earn_paragraph'
              defaultMessage="Don't keep it waiting, earn up to {rate}% on it with our Rewards Program"
              values={{
                rate: swappedCurrencyHasRate
              }}
            />
          </StyledEarnSubText>
          <StyledEarnButton
            data-e2e='swapEarn'
            nature='primary'
            fullwidth
            jumbo
            onClick={handleEarnRewardsButton}
          >
            <FormattedMessage
              id='modals.tradinglimits.earn_interest'
              defaultMessage='Earn Rewards'
            />
          </StyledEarnButton>
          <StyledDoneButton
            data-e2e='swapDone'
            nature='white-blue'
            fullwidth
            jumbo
            onClick={onDoneClick}
          >
            <FormattedMessage id='buttons.done' defaultMessage='Done' />
          </StyledDoneButton>
        </>
      )}
    </Wrapper>
  )
}

type OwnProps = BaseProps &
  SuccessStateType & {
    handleClose: () => void
    order?: SwapOrderType
  }
export type Props = OwnProps

export default SuccessfulSwap
