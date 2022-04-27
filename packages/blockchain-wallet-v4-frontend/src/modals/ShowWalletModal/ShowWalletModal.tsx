import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRight, IconSwap } from '@blockchain-com/icons'
import { useWallet } from 'hooks'

import Flyout, { FlyoutChild } from 'components/Flyout'
import { FlyoutListItem } from 'components/Flyout/FlyoutListItem'
import { useFlyoutOpenState } from 'components/Flyout/hooks'
import { FlyoutContent, FlyoutHeader } from 'components/Flyout/Layout'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { SeparatedList } from 'components/SeparatedList'

import { WalletBalanceCard } from './components'
import { ShowWalletModalComponent } from './ShowWalletModal.types'

export const ShowWalletModal: ShowWalletModalComponent = ({
  close = () => null,
  userClickedOutside = false,
  address,
  coin
}) => {
  const { isOpen, onPressClose } = useFlyoutOpenState({
    initialValue: true,
    onClose: () => close('SHOW_WALLET')
  })

  const { data, isLoading } = useWallet({
    address,
    coin
  })

  return (
    <Flyout isOpen={isOpen && !userClickedOutside} position={0} onClose={onPressClose} total={1}>
      <FlyoutChild>
        <FlyoutHeader onClick={onPressClose} mode='close' data-e2e='showWalletCloseFlyout'>
          <FormattedMessage id='modals.showWallet.title' defaultMessage='Private Key Wallet' />
        </FlyoutHeader>

        <FlyoutContent mode='top'>
          <SeparatedList>
            {!isLoading ? (
              <WalletBalanceCard title='$7,926.43' subtitle='0.00039387 BTC' />
            ) : (
              <span>loading</span>
            )}

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
