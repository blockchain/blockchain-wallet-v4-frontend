import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, IconCloseCircle, SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Image } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { Bottom, Middle, TextContainer, Top, Wrapper } from './WithdrawalRequested.styles'

const WithdrawalRequested = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_ACTIVE_REWARDS_WITHDRAWAL_REQUESTED_VIEWED,
        properties: {
          currency: coin
        }
      })
    )
  }, [])

  const handleClick = () => {
    dispatch(actions.components.interest.setActiveRewardsStep({ name: 'ACCOUNT_SUMMARY' }))
  }

  return (
    <Wrapper>
      <Top>
        <IconCloseCircle color={SemanticColors.muted} onClick={handleClose} size='medium' />
      </Top>
      <Middle>
        <Image name='btc-clock' size='72px' />
        <TextContainer>
          <Text color={SemanticColors.title} textAlign='center' variant='title3'>
            <FormattedMessage
              defaultMessage='Withdrawal Requested'
              id='modals.active-rewards.withdrawalrequested.title'
            />
          </Text>
          <Text color={SemanticColors.body} textAlign='center' variant='paragraph1'>
            <FormattedMessage
              defaultMessage="Your withdrawal will be executed once this week's strategy is complete."
              id='modals.active-rewards.withdrawalrequested.description'
            />
          </Text>
        </TextContainer>
      </Middle>
      <Bottom>
        <Button
          onClick={handleClick}
          size='default'
          state='initial'
          text={
            <Text color={SemanticColors.background} variant='body2'>
              <FormattedMessage
                id='modals.active-rewards.withdrawalrequested.activerewardsbutton'
                defaultMessage='Go to {coin} Active Rewards'
                values={{
                  coin
                }}
              />
            </Text>
          }
          type='button'
          variant='primary'
          width='full'
        />
      </Bottom>
    </Wrapper>
  )
}

type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default WithdrawalRequested
