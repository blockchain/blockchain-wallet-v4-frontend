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
import FiatDisplay from 'components/Display/FiatDisplay'

import { CloseIcon, EthIcon, HorizontalLine } from './TokenAllowance.styles'
import { TokenAllowanceProps } from './TokenAllowance.types'

const TokenAllowance = ({
  baseToken,
  gasEstimate,
  handleApprove,
  handleClose,
  isLoading,
  isNotAsked
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
    <Flex>
      <Text color={SemanticColors.title} textAlign='center' variant='title3'>
        <FormattedMessage
          defaultMessage='Allow Blockchain.com DEX to use your {token}?'
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
          defaultMessage='To complete the swap, give the Blockchain.com Dex smart contracts permission to use your {token}. You only have to do this once per token.'
          id='modals.dex.token_allowance.description'
          values={{ token: baseToken }}
        />
      </Text>
    </Flex>
    <Padding top={1} />
    <Flex flexDirection='column'>
      <Padding horizontal={0.5} vertical={1}>
        <Flex flexDirection='column' justifyContent='center' gap={4}>
          <Flex alignItems='center' gap={4}>
            <EthIcon name='ETH' />
            {isLoading || isNotAsked ? (
              <SkeletonRectangle bgColor='white' height='22px' width='60px' />
            ) : (
              <>
                <Text color={SemanticColors.title} textAlign='center' variant='paragraph2'>
                  ~
                </Text>
                <FiatDisplay coin='ETH' color='grey900' cursor='inherit' size='14px' weight={600}>
                  {gasEstimate}
                </FiatDisplay>
              </>
            )}
          </Flex>
          <Flex>
            <Text color={SemanticColors.body} textAlign='center' variant='paragraph1'>
              <FormattedMessage
                defaultMessage='Estiamted Fee'
                id='modals.dex.token_allowance.estimated_fee'
              />
            </Text>
          </Flex>
        </Flex>
      </Padding>
      <HorizontalLine />
    </Flex>
    <Padding horizontal={0.5} vertical={1}>
      <Flex flexDirection='column' gap={4}>
        <Flex justifyContent='space-between'>
          <Flex>
            <Text color={SemanticColors.body} variant='caption1'>
              <FormattedMessage defaultMessage='Wallet' id='copy.wallet' />
            </Text>
          </Flex>
          <Flex>
            <Text color={SemanticColors.body} variant='caption1'>
              <FormattedMessage defaultMessage='Network' id='copy.network' />
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent='space-between'>
          <Flex>
            <Text color={SemanticColors.title} variant='body1'>
              <FormattedMessage defaultMessage='DeFi Wallet' id='copy.defi-wallet' />
            </Text>
          </Flex>
          <Flex alignItems='center' gap={4}>
            <EthIcon name='ETH' />
            <Text color={SemanticColors.body} variant='body1'>
              <FormattedMessage defaultMessage='Ethereum' id='copy.ethereum' />
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Padding>
    <Padding top={2} />
    <Flex gap={16}>
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
    </Flex>
  </Modal>
)

export default TokenAllowance
