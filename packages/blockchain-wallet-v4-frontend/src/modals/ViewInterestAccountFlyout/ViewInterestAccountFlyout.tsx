import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { convertCoinToFiat } from '@core/exchange'
import { coinToString, fiatToString } from '@core/exchange/utils'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Divider } from 'components/Divider'
import { Flex } from 'components/Flex'
import Flyout, { duration } from 'components/Flyout'
import { FlyoutListTile } from 'components/FlyoutListTile'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { Padding } from 'components/Padding'
import { actions } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ModalName } from 'data/types'
import { getCoinColor, useCoinRates, useCurrency, useWalletsForCoin } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { CloseIconContainer } from './ViewInterestAccountFlyout.styles'
import { ViewInterestAccountFlyoutComponent } from './ViewInterestAccountFlyout.types'

export const ViewInterestAccountFlyout: ViewInterestAccountFlyoutComponent = ({
  close,
  coin,
  position,
  total,
  userClickedOutside
}) => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const dispatch = useDispatch()
  const currency = useCurrency()
  const coinColor = getCoinColor(coin) || 'grey200'
  const { data: coinAddressesData, isLoading: isLoadingAddressData } = useWalletsForCoin({ coin })
  const { data: rates, isLoading: isLoadingCoinRates } = useCoinRates({ coin })

  const interestAccount = useMemo(() => {
    return coinAddressesData?.filter((account) => account.type === 'INTEREST')[0]
  }, [coinAddressesData])

  const isLoading = useMemo(
    () => isLoadingAddressData || isLoadingCoinRates,
    [isLoadingAddressData, isLoadingCoinRates]
  )

  const hasFunds = useMemo(() => {
    if (!interestAccount || interestAccount.balance === undefined) return false

    return interestAccount.balance > 0
  }, [interestAccount])

  const totalFiat = useMemo(() => {
    if (!interestAccount || !rates) return

    const { balance } = interestAccount

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
  }, [coin, currency, interestAccount, rates])

  const totalCrypto = useMemo(() => {
    if (!interestAccount) return

    const { balance } = interestAccount

    return coinToString({
      unit: { symbol: coin },
      value: convertBaseToStandard(coin, balance)
    })
  }, [coin, interestAccount])

  const handleClose = useCallback(async () => {
    setOpen(false)

    await new Promise((resolve) => {
      setTimeout(() => {
        close?.call(ModalName.VIEW_PRIVATE_KEY_WALLET)

        setTimeout(resolve, 0)
      }, duration)
    })
  }, [close])

  const closeButton = (
    <CloseIconContainer onClick={handleClose}>
      <Icon data-e2e='bankDetailsCloseIcon' name='close' size='20px' color='grey600' />
    </CloseIconContainer>
  )

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
                {interestAccount?.label}
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

        <Divider />

        <FlyoutListTile
          disabled={!hasFunds}
          icon={<Icon name='arrow-down' size='20px' />}
          iconColor={coinColor}
          onClick={() =>
            dispatch(actions.components.interest.showInterestModal({ coin, step: 'DEPOSIT' }))
          }
          title={
            <FormattedMessage
              id='viewInterestAccountFlyout.addButton.title'
              defaultMessage='Add {coin}'
              values={{
                coin
              }}
            />
          }
          subtitle={
            <FormattedMessage
              id='viewInterestAccountFlyout.addButton.description'
              defaultMessage='Add {coin} to Rewards Account'
              values={{ coin }}
            />
          }
        />

        <Divider />

        <FlyoutListTile
          disabled={!hasFunds}
          icon={<Icon name='arrow-up' size='20px' />}
          iconColor={coinColor}
          onClick={() =>
            dispatch(actions.components.interest.showInterestModal({ coin, step: 'WITHDRAWAL' }))
          }
          title={
            <FormattedMessage
              id='viewInterestAccountFlyout.withdrawButton.title'
              defaultMessage='Withdraw'
            />
          }
          subtitle={
            <FormattedMessage
              id='viewInterestAccountFlyout.withdrawButton.description'
              defaultMessage='Withdraw {coin} from Rewards Account'
              values={{ coin }}
            />
          }
        />

        <Divider />
      </div>
    </Flyout>
  )
}

const enhance = modalEnhancer(ModalName.VIEW_INTEREST_ACCOUNT, { transition: duration })

export default enhance(ViewInterestAccountFlyout)
