import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, IconCloseCircle, SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Image } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { Bottom, Middle, TextContainer, Top, Wrapper } from './DepositSuccess.model'

const DepositSuccess = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_ACTIVE_REWARDS_DEPOSIT_SUCCESS_VIEWED,
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
              defaultMessage='Transfer Submitted'
              id='modals.active-rewards.depositsuccess.title'
            />
          </Text>
          <Text color={SemanticColors.body} textAlign='center' variant='paragraph1'>
            <FormattedMessage
              defaultMessage='We are transferring your funds to your Active Rewards account. It may take a few minutes until it’s completed.'
              id='modals.active-rewards.depositsuccess.description'
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
                id='modals.active-rewards.depositsuccess.activerewardsbutton'
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
        <LinkContainer to='/earn/history'>
          <Button
            size='default'
            state='initial'
            text={
              <Text color={SemanticColors.primary} variant='body2'>
                <FormattedMessage
                  id='modals.active-rewards.depositsuccess.historybutton'
                  defaultMessage='See Transfer Details'
                />
              </Text>
            }
            type='button'
            variant='minimal'
            width='full'
          />
        </LinkContainer>
      </Bottom>
    </Wrapper>
  )
}

type OwnProps = {
  coin: CoinType
  handleClose: () => void
}

export default DepositSuccess
