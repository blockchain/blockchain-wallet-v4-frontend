import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { convertCoinToFiat } from '@core/exchange'
import { coinToString, fiatToString } from '@core/exchange/utils'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Divider } from 'components/Divider'
import { Flex } from 'components/Flex'
import Flyout, { duration } from 'components/Flyout'
import { FlyoutListTile } from 'components/FlyoutListTile'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { Padding } from 'components/Padding'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ModalName, SwapBaseCounterTypes } from 'data/types'
import {
  getCoinColor,
  useCoinRates,
  useCurrency,
  useOpenReceiveModal,
  useOpenSellModal,
  useOpenSendCryptoModal,
  useOpenSwapModal,
  useWalletsForCoin
} from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { CloseIconContainer } from './ViewPrivateKeyWalletFlyout.styles'
import { ViewPrivateKeyWalletFlyoutComponent } from './ViewPrivateKeyWalletFlyout.types'

export const ViewPrivateKeyWalletFlyout: ViewPrivateKeyWalletFlyoutComponent = ({
  close,
  coin,
  position,
  total,
  userClickedOutside
}) => {
  const currency = useCurrency()
  const [isOpen, setOpen] = useState<boolean>(true)
  const openSendCryptoModal = useOpenSendCryptoModal()
  const openReceiveModal = useOpenReceiveModal()
  const openSwapModal = useOpenSwapModal()
  const openSellModal = useOpenSellModal()

  const { data: coinAddressesData, isLoading: isLoadingAddressData } = useWalletsForCoin({ coin })
  const { data: rates, isLoading: isLoadingCoinRates } = useCoinRates({ coin })

  const privateKeyWallet = useMemo(() => {
    return coinAddressesData?.filter((account) => account.type === 'ACCOUNT')[0]
  }, [coinAddressesData])

  const hasFunds = useMemo(() => {
    if (!privateKeyWallet || privateKeyWallet.balance === undefined) return false

    return privateKeyWallet.balance > 0
  }, [privateKeyWallet])

  const handleClose = useCallback(async () => {
    setOpen(false)

    await new Promise((resolve) => {
      setTimeout(() => {
        close?.call(ModalName.VIEW_PRIVATE_KEY_WALLET)

        setTimeout(resolve, 0)
      }, duration)
    })
  }, [close])

  const totalFiat = useMemo(() => {
    if (!privateKeyWallet || !rates) return

    const { balance } = privateKeyWallet

    return fiatToString({
      unit: currency,
      value: convertCoinToFiat({
        coin,
        currency,
        isStandard: false,
        rates,
        value: balance
      })
    })
  }, [coin, currency, privateKeyWallet, rates])

  const totalCrypto = useMemo(() => {
    if (!privateKeyWallet) return

    const { balance } = privateKeyWallet

    return coinToString({
      unit: { symbol: coin },
      value: convertBaseToStandard(coin, balance)
    })
  }, [coin, privateKeyWallet])

  const isLoading = useMemo(
    () => isLoadingAddressData || isLoadingCoinRates,
    [isLoadingAddressData, isLoadingCoinRates]
  )

  const closeButton = useMemo(
    () => (
      <CloseIconContainer onClick={handleClose}>
        <Icon data-e2e='bankDetailsCloseIcon' name='close' size='20px' color='grey600' />
      </CloseIconContainer>
    ),
    [handleClose]
  )

  const coinColor = getCoinColor(coin) || 'grey200'

  if (isLoading) {
    return (
      <Flyout
        position={position}
        isOpen={isOpen}
        userClickedOutside={userClickedOutside}
        onClose={handleClose}
        data-e2e='privateKeyModal'
        total={total}
      >
        <Flex style={{ height: '100%' }} flexDirection='column'>
          <Padding horizontal={40} top={40} bottom={32}>
            <Flex justifyContent='flex-end'>{closeButton}</Flex>
          </Padding>

          <Flex alignItems='center' justifyContent='center' flexGrow={1}>
            <SpinningLoader width='24px' height='24px' borderWidth='4px' />
          </Flex>
        </Flex>
      </Flyout>
    )
  }

  const sellListTile = (
    <FlyoutListTile
      disabled={!hasFunds}
      onClick={() => {
        if (!privateKeyWallet) return

        openSellModal({
          coin: privateKeyWallet.coin,
          origin: 'CoinPageHoldings'
        })
      }}
      icon={<Icon name='minus' size='20px' />}
      iconColor={coinColor}
      title={
        <FormattedMessage id='viewPrivateKeyWalletFlyout.sellButton.title' defaultMessage='Sell' />
      }
      subtitle={
        <FormattedMessage
          id='viewPrivateKeyWalletFlyout.sellButton.description'
          defaultMessage='Convert Your Crypto to Cash'
        />
      }
    />
  )

  const sendListTile = (
    <FlyoutListTile
      disabled={!hasFunds}
      onClick={() =>
        openSendCryptoModal({
          coin,
          initialValue: { account: privateKeyWallet },
          origin: 'CoinPageHoldings'
        })
      }
      icon={<Icon name='arrow-top-right' size='16px' />}
      iconColor={coinColor}
      title={
        <FormattedMessage id='viewPrivateKeyWalletFlyout.sendButton.title' defaultMessage='Send' />
      }
      subtitle={
        <FormattedMessage
          id='viewPrivateKeyWalletFlyout.sendButton.description'
          defaultMessage='Transfer {coin} to Other Wallets'
          values={{ coin }}
        />
      }
    />
  )

  const receiveListTile = (
    <FlyoutListTile
      onClick={() => {
        if (!privateKeyWallet) return

        openReceiveModal({
          baseCoin: privateKeyWallet.coin,
          coin: privateKeyWallet.coin,
          label: privateKeyWallet.label,
          type: privateKeyWallet.type
        })
      }}
      icon={<Icon name='arrow-top-right' size='16px' style={{ transform: 'rotate(180deg)' }} />}
      iconColor={coinColor}
      title={
        <FormattedMessage
          id='viewPrivateKeyWalletFlyout.receiveButton.title'
          defaultMessage='Receive'
        />
      }
      subtitle={
        <FormattedMessage
          id='viewPrivateKeyWalletFlyout.receiveButton.description'
          defaultMessage='Receive {coin} to your account'
          values={{ coin }}
        />
      }
    />
  )

  const swapListTile = (
    <FlyoutListTile
      disabled={!hasFunds}
      onClick={() => {
        if (!privateKeyWallet || privateKeyWallet.balance === undefined) return

        openSwapModal({
          balance: privateKeyWallet.balance,
          baseCoin: privateKeyWallet.coin,
          coin: privateKeyWallet.coin,
          label: privateKeyWallet.label,
          type: SwapBaseCounterTypes.ACCOUNT
        })
      }}
      icon={<Icon name='arrows-horizontal' size='10px' />}
      iconColor={coinColor}
      title={
        <FormattedMessage id='viewPrivateKeyWalletFlyout.swapButton.title' defaultMessage='Swap' />
      }
      subtitle={
        <FormattedMessage
          id='viewPrivateKeyWalletFlyout.swapButton.description'
          defaultMessage='Exchange {coin} for Another Crypto'
          values={{ coin }}
        />
      }
    />
  )

  return (
    <Flyout
      position={position}
      isOpen={isOpen}
      userClickedOutside={userClickedOutside}
      onClose={handleClose}
      data-e2e='privateKeyModal'
      total={total}
    >
      <div style={{ fontFeatureSettings: "'zero' on, 'ss01' on" }}>
        <Padding horizontal={40} top={40} bottom={32}>
          <Flex justifyContent='space-between' alignItems='center' gap={16}>
            <Flex gap={16} alignItems='center'>
              <IconCircularBackground color={coinColor} size='large'>
                <Icon name='key' size='10px' color='white' />
              </IconCircularBackground>

              <Text weight={600} size='20px' lineHeight='30px' color='grey900'>
                {privateKeyWallet?.label}
              </Text>
            </Flex>

            {closeButton}
          </Flex>
        </Padding>

        <Padding horizontal={40} bottom={40}>
          <Flex flexDirection='column' gap={8}>
            <Text weight={600} size='24px' lineHeight='32.4px' color='grey900'>
              {totalFiat}
            </Text>

            <Text weight={600} size='20px' lineHeight='30px' color='grey700'>
              {totalCrypto}
            </Text>
          </Flex>
        </Padding>

        {hasFunds ? (
          <>
            <Divider />
            {sendListTile}
            <Divider />
            {receiveListTile}
            <Divider />
            {swapListTile}
            <Divider />
            {sellListTile}
            <Divider />
          </>
        ) : (
          <>
            <Divider />
            {receiveListTile}
            <Divider />
            {sendListTile}
            <Divider />
            {swapListTile}
            <Divider />
            {sellListTile}
            <Divider />
          </>
        )}
      </div>
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.VIEW_PRIVATE_KEY_WALLET, { transition: duration })

export default enhance(ViewPrivateKeyWalletFlyout)
