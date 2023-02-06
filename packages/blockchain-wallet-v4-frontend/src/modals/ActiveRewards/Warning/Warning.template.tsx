import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType } from '@core/types'
import { Icon, Image } from 'blockchain-info-components'
import { FlyoutWrapper as Header } from 'components/Flyout'

import { Bottom, Top, WarningContainer, Wrapper } from './Warning.styles'

const Warning = ({
  coin,
  handleClick,
  handleClose,
  isActiveRewardsWithdrawalEnabled
}: OwnProps) => (
  <Wrapper>
    <Header>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text color={SemanticColors.title} variant='body2'>
          <FormattedMessage
            id='modals.active-rewards.warning.title'
            defaultMessage='{coin} Active Rewards'
            values={{ coin }}
          />
        </Text>
        <Icon
          onClick={handleClose}
          cursor
          name='close'
          size='20px'
          color='grey600'
          data-e2e='closeActiveRewards'
        />
      </Flex>
    </Header>
    <Top>
      <Flex alignItems='center' flexDirection='column' gap={16}>
        <Image name='btc-graph' size='68px' />
        <Text color={SemanticColors.title} textAlign='center' variant='title3'>
          <FormattedMessage
            defaultMessage='Active Rewards considerations'
            id='modals.active-rewards.warning.content.title'
          />
        </Text>
        <Text color={SemanticColors.body} textAlign='center' variant='body1'>
          <FormattedMessage
            defaultMessage='Price movements may result in a reduction of your BTC balance.{br}{br} Once subscribed, assets are locked until the following week and subject to market volatility.'
            id='modals.active-rewards.warning.content.subtitle'
            values={{
              br: <br />
            }}
          />
        </Text>
      </Flex>
    </Top>
    <Bottom>
      <WarningContainer>
        <Text color={SemanticColors.title} variant='paragraph2'>
          <FormattedMessage defaultMessage='Important' id='copy.important' />
        </Text>
        {!isActiveRewardsWithdrawalEnabled && (
          <Text color={SemanticColors.title} variant='caption1'>
            <FormattedMessage
              defaultMessage="Withdrawals for Active Rewards are not yet enabled. Weekly withdrawal functionality is being finalized and will be enabled approximately end of January 2023. Until then, BTC assets in Active Rewards Accounts will be re-subscribed to each week's strategy."
              id='modals.active-rewards.warning.bottom.warning-1'
            />
          </Text>
        )}
        <Text color={SemanticColors.title} variant='caption1'>
          <FormattedMessage
            defaultMessage='Blockchain.com does not assume liability for any losses incurred from price fluctuations. Please trade with caution.'
            id='modals.active-rewards.warning.bottom.warning-2'
          />
        </Text>
        <LinkContainer to='/earn/active-rewards-learn'>
          <Button
            onClick={handleClose}
            size='small'
            text={<FormattedMessage defaultMessage='Learn More' id='buttons.learn_more' />}
            type='button'
            variant='secondary'
          />
        </LinkContainer>
      </WarningContainer>
      <Button
        onClick={handleClick}
        size='default'
        text={<FormattedMessage defaultMessage='Continue' id='copy.continue' />}
        type='button'
        variant='primary'
        width='full'
      />
    </Bottom>
  </Wrapper>
)

type OwnProps = {
  coin: CoinType
  handleClick: () => void
  handleClose: () => void
  isActiveRewardsWithdrawalEnabled: boolean
}

export default Warning
