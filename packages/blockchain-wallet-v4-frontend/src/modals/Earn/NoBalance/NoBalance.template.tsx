import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { Icon, Image } from 'blockchain-info-components'
import { FlyoutWrapper as Header } from 'components/Flyout'

import {
  Bottom,
  IconContainer,
  ImageContainer,
  Top,
  VortexContainer,
  Wrapper
} from './NoBalance.styles'
import { OwnProps } from './NoBalance.types'

const NoBalance = ({
  coin,
  displaySymbol,
  handleBuyClick,
  handleClose,
  handleReceiveClick,
  isBuySellEligible
}: OwnProps) => (
  <Wrapper>
    <Header>
      <Flex alignItems='center' justifyContent='space-between'>
        <Text color={SemanticColors.title} variant='body2'>
          <FormattedMessage id='modals.earn.no-balance.title' defaultMessage='No balance' />
        </Text>
        <IconContainer>
          <IconCloseCircleV2 color={SemanticColors.muted} onClick={handleClose} size='medium' />
        </IconContainer>
      </Flex>
    </Header>
    <Top>
      <Flex alignItems='center' flexDirection='column' gap={24}>
        <ImageContainer>
          <VortexContainer>
            <Image name='vortex' />
          </VortexContainer>
          <Icon color={coin} name={coin} size='64px' />
        </ImageContainer>
        <Flex alignItems='center' flexDirection='column' gap={8}>
          <Text color={SemanticColors.title} variant='title3'>
            <FormattedMessage
              defaultMessage='You don’t have any {coin}'
              id='modals.earn.no-balance.content.title'
              values={{ coin: displaySymbol }}
            />
          </Text>
          <Text color={SemanticColors.body} variant='body1'>
            <FormattedMessage
              defaultMessage='Buy or receive {coin} to start earning.'
              id='modals.earn.no-balance.content.subtitle'
              values={{ coin: displaySymbol }}
            />
          </Text>
        </Flex>
      </Flex>
    </Top>
    <Bottom>
      {!isBuySellEligible && (
        <Button
          onClick={handleBuyClick}
          size='default'
          text={
            <FormattedMessage
              defaultMessage='Buy {coin}'
              id='modals.earn.no-balance.buy-button'
              values={{ coin: displaySymbol }}
            />
          }
          type='button'
          variant='primary'
          width='full'
        />
      )}
      <Button
        onClick={handleReceiveClick}
        size='default'
        text={
          <FormattedMessage
            defaultMessage='Receive {coin}'
            id='modals.earn.no-balance.receive-button'
            values={{ coin: displaySymbol }}
          />
        }
        type='button'
        variant='minimal'
        width='full'
      />
    </Bottom>
  </Wrapper>
)
export default NoBalance
