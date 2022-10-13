import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, IconCloseCircle, SemanticColors } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Image, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { Analytics } from 'data/types'

import { Bottom, Middle, TextContainer, Top, Wrapper } from './DepositSuccess.model'

const DepositSuccess = ({ coin, handleClose }: OwnProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_STAKING_DEPOSIT_SUCCESS_VIEWED,
        properties: {
          currency: coin
        }
      })
    )
  }, [])

  const handleClick = () => {
    dispatch(actions.components.interest.setStakingStep({ name: 'ACCOUNT_SUMMARY' }))
  }

  return (
    <Wrapper>
      <Top>
        <IconCloseCircle color={SemanticColors.muted} onClick={handleClose} size='medium' />
      </Top>
      <Middle>
        <Image name='eth-pending' size='87px' />
        <TextContainer>
          <Text color='grey900' size='20px' weight={600}>
            <FormattedMessage
              defaultMessage='Transfer Submitted'
              id='modals.staking.depositsuccess.title'
            />
          </Text>
          <Text color='grey600' size='14px' weight={500}>
            <FormattedMessage
              defaultMessage='We are transferring your funds to your Staking account. It may take a few minutes until it’s completed.'
              id='modals.staking.depositsuccess.description'
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
            <Text color='white' size='16px' weight={600}>
              <FormattedMessage
                id='modals.staking.depositsuccess.stakingbutton'
                defaultMessage='Go to {coin} Staking'
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
              <Text color='blue600' size='16px' weight={600}>
                <FormattedMessage
                  id='modals.staking.depositsuccess.historybutton'
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
