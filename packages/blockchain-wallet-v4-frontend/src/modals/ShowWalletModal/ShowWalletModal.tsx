import React from 'react'

import Flyout, { FlyoutChild } from 'components/Flyout'

import { ShowWalletModalComponent } from './ShowWalletModal.types'
import { FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { FormattedMessage } from 'react-intl'
import { useFlyoutOpenState } from 'components/Flyout/hooks'
import { FlyoutListItem } from 'components/Flyout/FlyoutListItem'
import { SeparatedList } from 'components/SeparatedList'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { IconChevronRight, IconSwap } from '@blockchain-com/icons'
import { Icon } from '@blockchain-com/constellation'
import { Padding } from 'components/Padding'
import { Flex } from 'components/Flex'
import { Text } from 'blockchain-info-components'

export const ShowWalletModal: ShowWalletModalComponent = ({
  close = () => null,
  userClickedOutside = false
}) => {
  const { isOpen, onPressClose } = useFlyoutOpenState({
    initialValue: true,
    onClose: () => close('SHOW_WALLET')
  })

  return (
    <Flyout isOpen={isOpen && !userClickedOutside} position={0} onClose={onPressClose} total={1}>
      <FlyoutChild>
        <FlyoutHeader onClick={onPressClose} mode='close' data-e2e='showWalletCloseFlyout'>
          <FormattedMessage id='modals.showWallet.title' defaultMessage='Private Key Wallet' />
        </FlyoutHeader>

        <FlyoutContent mode='top'>
          <SeparatedList>
            <Padding horizontal={40} bottom={40}>
              <Flex flexDirection='column' gap={8}>
                <Text weight={600} color='grey900' size='24px' lineHeight='32px'>
                  $7,926.43
                </Text>

                <Text weight={600} color='grey600' size='20px' lineHeight='30px'>
                  0.00039387 BTC
                </Text>
              </Flex>
            </Padding>

            <FlyoutListItem
              onClick={() => null}
              icon={
                <IconCircularBackground color='orange100'>
                  <Icon color='orange600' label='send' size='sm'>
                    <IconSwap />
                  </Icon>
                </IconCircularBackground>
              }
              title={<FormattedMessage id='modals.showWallet.send.title' defaultMessage='Send' />}
              subtitle={
                <FormattedMessage
                  id='modals.showWallet.send.subtitle'
                  defaultMessage='Receive BTC to your account'
                />
              }
              endIcon={
                <Icon label='chevron-right' color='grey400' size='md'>
                  <IconChevronRight />
                </Icon>
              }
            />

            <FlyoutListItem
              onClick={() => null}
              icon={
                <IconCircularBackground color='orange100'>
                  <Icon color='orange600' label='send' size='sm'>
                    <IconSwap />
                  </Icon>
                </IconCircularBackground>
              }
              title={
                <FormattedMessage id='modals.showWallet.receive.title' defaultMessage='Receive' />
              }
              subtitle={
                <FormattedMessage
                  id='modals.showWallet.receive.subtitle'
                  defaultMessage='Receive BTC to your account'
                />
              }
              endIcon={
                <Icon label='chevron-right' color='grey400' size='md'>
                  <IconChevronRight />
                </Icon>
              }
            />

            <FlyoutListItem
              onClick={() => null}
              icon={
                <IconCircularBackground color='orange100'>
                  <Icon color='orange600' label='send' size='sm'>
                    <IconSwap />
                  </Icon>
                </IconCircularBackground>
              }
              title={<FormattedMessage id='modals.showWallet.swap.title' defaultMessage='Swap' />}
              subtitle={
                <FormattedMessage
                  id='modals.showWallet.swap.subtitle'
                  defaultMessage='Exchange BTC for Another Crypto'
                />
              }
              endIcon={
                <Icon label='chevron-right' color='grey400' size='md'>
                  <IconChevronRight />
                </Icon>
              }
            />

            <FlyoutListItem
              onClick={() => null}
              icon={
                <IconCircularBackground color='orange100'>
                  <Icon color='orange600' label='send' size='sm'>
                    <IconSwap />
                  </Icon>
                </IconCircularBackground>
              }
              title={<FormattedMessage id='modals.showWallet.sell.title' defaultMessage='Sell' />}
              subtitle={
                <FormattedMessage
                  id='modals.showWallet.sell.subtitle'
                  defaultMessage='Convert Your Crypto to Cash'
                />
              }
              endIcon={
                <Icon label='chevron-right' color='grey400' size='md'>
                  <IconChevronRight />
                </Icon>
              }
            />
          </SeparatedList>
        </FlyoutContent>
      </FlyoutChild>
    </Flyout>
  )
}
