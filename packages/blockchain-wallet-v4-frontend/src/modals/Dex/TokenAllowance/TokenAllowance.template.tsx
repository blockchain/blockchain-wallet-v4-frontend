import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import { compose } from 'redux'

import { Image, Modal } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/modals/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { CloseIcon, EthIcon, HorizontalLine } from './TokenAllowance.styles'

const TokenAllowance = () => {
  const dispatch = useDispatch()

  return (
    <Modal size='small' style={{ padding: '24px' }}>
      <Flex justifyContent='flex-end'>
        <CloseIcon onClick={() => dispatch(actions.modals.closeModal())}>
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
              token: 'BTC'
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
            values={{ token: 'BTC' }}
          />
        </Text>
      </Flex>
      <Padding top={1} />
      <Flex flexDirection='column'>
        <Padding horizontal={0.5} vertical={1}>
          <Flex alignItems='center' justifyContent='space-between'>
            <Flex flexDirection='column' justifyContent='center' gap={4}>
              <Flex alignItems='center' gap={4}>
                <EthIcon name='ETH' />
                <Text color={SemanticColors.title} textAlign='center' variant='paragraph2'>
                  ~$0.08
                </Text>
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
            <Flex>
              <Button
                as='button'
                onClick={() => {}}
                size='small'
                state='initial'
                text={<FormattedMessage defaultMessage='Edit' id='copy.edit' />}
                type='button'
                variant='minimal'
                width='auto'
              />
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
          onClick={() => {}}
          size='default'
          state='initial'
          text={<FormattedMessage defaultMessage='Decline' id='copy.decline' />}
          type='button'
          variant='minimal'
          width='full'
        />
        <Button
          as='button'
          onClick={() => {}}
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
}

export default compose<React.ComponentType>(ModalEnhancer(ModalName.DEX_TOKEN_ALLOWANCE))(
  TokenAllowance
)
