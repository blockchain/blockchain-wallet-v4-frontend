import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { Image, Modal, SkeletonRectangle } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { BottomContainer, ButtonContainer, CloseIcon, EthIcon, TopContainer } from './styles'
import { TokenAllowanceProps } from './types'

const TokenAllowance = ({
  balance,
  baseToken,
  gasEstimate,
  handleApprove,
  handleClose,
  isLoading,
  isNotAsked,
  truncatedAddress
}: TokenAllowanceProps) => (
  <Modal size='small' style={{ padding: '24px' }}>
    <Flex justifyContent='flex-end'>
      <CloseIcon onClick={handleClose}>
        <IconCloseCircleV2 color={PaletteColors['grey-400']} label='close' size='large' />
      </CloseIcon>
    </Flex>
    <Padding top={3} />
    <Flex justifyContent='center'>
      <Image name='dex-token-allowance' height='88px' width='88px' />
    </Flex>
    <Padding top={1.5} />
    <Flex justifyContent='center'>
      <Text color={SemanticColors.title} textAlign='center' variant='title3'>
        <FormattedMessage
          defaultMessage='Allow {token}?'
          id='modals.dex.token_allowance.title'
          values={{
            token: baseToken
          }}
        />
      </Text>
    </Flex>
    <Padding top={0.5} />
    <Flex>
      <Text color={SemanticColors.body} textAlign='center' variant='body1'>
        <FormattedMessage
          defaultMessage='To complete the swap, allow permission to use your {token}. You only have to do this once per token.'
          id='modals.dex.token_allowance.description'
          values={{ token: baseToken }}
        />
      </Text>
    </Flex>
    <Padding top={1} />
    <Flex flexDirection='column' gap={1}>
      <TopContainer>
        <Flex alignItems='center' gap={16}>
          <Image name='dex-gas' />
          <Flex flexDirection='column' gap={4} justifyContent='space-around'>
            <Text color={SemanticColors.title} variant='body2'>
              <FormattedMessage
                defaultMessage='Estimated fee'
                id='modals.dex.token_allowance.top-container.estimated-fee'
              />
            </Text>
            <Text color={SemanticColors.body} variant='paragraph1'>
              Ethereum
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems='flex-end' flexDirection='column' gap={4} justifyContent='space-around'>
          {isLoading || isNotAsked ? (
            <SkeletonRectangle bgColor='white' height='22px' width='60px' />
          ) : (
            <Flex gap={4}>
              <Text color={SemanticColors.title} textAlign='center' variant='paragraph2'>
                ~
              </Text>
              <FiatDisplay coin='ETH' color='grey900' cursor='inherit' size='16px' weight={600}>
                {gasEstimate}
              </FiatDisplay>
            </Flex>
          )}
          {isLoading || isNotAsked ? (
            <SkeletonRectangle bgColor='white' height='22px' width='60px' />
          ) : (
            <>
              <CoinDisplay coin='ETH' color='grey700' cursor='inherit' size='14px' weight={600}>
                {gasEstimate}
              </CoinDisplay>
            </>
          )}
        </Flex>
      </TopContainer>
      <BottomContainer>
        <Flex alignItems='center' gap={16}>
          <EthIcon name='ETH' />
          <Flex flexDirection='column' gap={4} justifyContent='space-around'>
            <Text color={SemanticColors.title} variant='body2'>
              DeFi Wallet
            </Text>
            <Text color={SemanticColors.body} variant='paragraph1'>
              {truncatedAddress}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems='flex-end' flexDirection='column' gap={4} justifyContent='space-around'>
          {isLoading || isNotAsked ? (
            <SkeletonRectangle bgColor='white' height='22px' width='60px' />
          ) : (
            <Flex gap={4}>
              <Text color={SemanticColors.title} textAlign='center' variant='paragraph2'>
                ~
              </Text>
              <FiatDisplay coin='ETH' color='grey900' cursor='inherit' size='16px' weight={600}>
                {balance}
              </FiatDisplay>
            </Flex>
          )}
          {isLoading || isNotAsked ? (
            <SkeletonRectangle bgColor='white' height='22px' width='60px' />
          ) : (
            <>
              <CoinDisplay coin='ETH' color='grey700' cursor='inherit' size='14px' weight={600}>
                {balance}
              </CoinDisplay>
            </>
          )}
        </Flex>
      </BottomContainer>
    </Flex>
    <Padding top={2} />
    <ButtonContainer>
      <Button
        as='button'
        onClick={handleClose}
        size='default'
        state='initial'
        text={<FormattedMessage defaultMessage='Decline' id='copy.decline' />}
        type='button'
        variant='minimal'
        width='full'
      />
      <Button
        as='button'
        onClick={handleApprove}
        size='default'
        state='initial'
        text={<FormattedMessage defaultMessage='Approve' id='copy.approve' />}
        type='button'
        variant='primary'
        width='full'
      />
    </ButtonContainer>
  </Modal>
)

export default TokenAllowance
