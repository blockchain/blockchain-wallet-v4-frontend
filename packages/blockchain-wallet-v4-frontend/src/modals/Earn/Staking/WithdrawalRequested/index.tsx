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

  // useEffect(() => {
  //   dispatch(
  //     actions.analytics.trackEvent({
  //       key: Analytics.WALLET_ACTIVE_REWARDS_WITHDRAWAL_REQUESTED_VIEWED,
  //       properties: {
  //         currency: coin
  //       }
  //     })
  //   )
  // }, [])

  const handleClick = () => {
    dispatch(actions.components.interest.setStakingStep({ name: 'ACCOUNT_SUMMARY' }))
  }

  return (
    <Wrapper>
      <Top>
        <IconCloseCircle color={SemanticColors.muted} onClick={handleClose} size='medium' />
      </Top>
      <Middle>
        <Image name='eth-pending' size='72px' />
        <TextContainer>
          <Text color={SemanticColors.title} textAlign='center' variant='title3'>
            <FormattedMessage
              defaultMessage='Withdrawal Requested'
              id='modals.active-rewards.withdrawalrequested.title'
            />
          </Text>
          <Text color={SemanticColors.body} textAlign='center' variant='paragraph1'>
            <FormattedMessage
              defaultMessage='Your withdrawal will be executed once the unbonding period finishes. Your funds will be available in your Trading Account.'
              id='modals.stakings.withdrawalrequested.description'
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
                id='modals.staking.withdrawalrequested.stakingbutton'
                defaultMessage='Go to {coin} Staking Rewards'
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
