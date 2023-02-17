import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Icon } from 'blockchain-info-components'

import CustodialAccount from '../../CustodialAccount'
import { Bottom, MessageContainer, Top, Wrapper } from './WithdrawalForm.styles'
import { SuccessPropsType } from './WithdrawalForm.types'

const Withdrawal = ({
  activeRewardsCryptoAmount,
  activeRewardsFiatAmount,
  buySellCryptoAmount,
  buySellFiatAmount,
  coin,
  handleClose,
  handleWithdrawal
}: SuccessPropsType) => (
  <Wrapper>
    <Top>
      <Padding bottom={1.5}>
        <Flex justifyContent='space-between' width='fill'>
          <Flex alignItems='center' gap={16}>
            <Flex flexDirection='column' gap={4}>
              <Text color={SemanticColors.title} variant='body2'>
                <FormattedMessage
                  id='modals.active-rewards.detailstitle'
                  defaultMessage='Withdraw {displayName}'
                  values={{ displayName: coin }}
                />
              </Text>
            </Flex>
          </Flex>
          <Icon
            onClick={handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
            data-e2e='closeInterest'
          />
        </Flex>
      </Padding>
      <Padding bottom={0.5}>
        <Text color={SemanticColors.body} variant='paragraph1'>
          <FormattedMessage defaultMessage='From' id='copy.from' />
        </Text>
      </Padding>
      <Padding bottom={3.5}>
        <CustodialAccount
          coin={coin}
          cryptoAmount={activeRewardsCryptoAmount}
          fiatAmount={activeRewardsFiatAmount}
          product='Active Rewards'
        />
      </Padding>
      <Flex justifyContent='center'>
        <Padding bottom={1}>
          <Text color={SemanticColors.title} variant='title1'>
            {activeRewardsFiatAmount}
          </Text>
        </Padding>
      </Flex>
      <Padding bottom={2}>
        <MessageContainer>
          <Padding all={1}>
            <Text color={SemanticColors.title} variant='caption1'>
              <FormattedMessage
                defaultMessage='Requesting a withdrawal from your Active Rewards Account will send your total balance to your Bitcoin Trading Account.'
                id='modals.active-rewards.withdrawal.total-balance-message'
              />
            </Text>
          </Padding>
        </MessageContainer>
      </Padding>
      <Padding bottom={0.5}>
        <Text color={SemanticColors.body} variant='paragraph1'>
          <FormattedMessage defaultMessage='To' id='copy.to' />
        </Text>
      </Padding>
      <Padding bottom={0.5}>
        <CustodialAccount
          coin={coin}
          cryptoAmount={buySellCryptoAmount}
          fiatAmount={buySellFiatAmount}
          product='Trading'
        />
      </Padding>
    </Top>
    <Bottom>
      <Flex>
        <Text color={SemanticColors.title} textAlign='center' variant='caption1'>
          <FormattedMessage
            defaultMessage="You are requesting to withdraw your funds from your Active Rewards Account. This balance will be available in your Trading Account on Saturday at or about 8:00AM UTC, and may vary depending on the outcome of this week's strategy."
            id='modals.active-rewards.withdrawal.bottom-text'
          />
        </Text>
      </Flex>
      <Button
        onClick={handleWithdrawal}
        size='default'
        text={
          <Text color={SemanticColors.background} variant='body2'>
            <FormattedMessage id='buttons.request-withdrawal' defaultMessage='Request Withdrawal' />
          </Text>
        }
        variant='primary'
        width='full'
      />
    </Bottom>
  </Wrapper>
)

export default Withdrawal
