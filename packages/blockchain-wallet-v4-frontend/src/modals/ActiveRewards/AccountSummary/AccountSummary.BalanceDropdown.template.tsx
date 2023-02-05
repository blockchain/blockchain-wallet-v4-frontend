import React, { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType, FiatType } from '@core/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { useOnClickOutside } from 'services/misc'

import { BalanceDropdownContainer, CoinToggleButton } from './AccountSummary.styles'

const BalanceDropdown = ({
  activeRewardsBalance,
  coin,
  handleBalanceDropdown,
  handleCoinToggled,
  isCoinDisplayed,
  totalBondingDeposits,
  walletCurrency
}: OwnProps) => {
  const ref = useRef(null)
  useOnClickOutside(ref, handleBalanceDropdown)
  const renderRows = (balance: number, isSubscribed: boolean) => (
    <Padding vertical={1}>
      <Flex justifyContent='space-between' gap={32}>
        <Text as='p' color={SemanticColors.title} variant='paragraph2'>
          {isSubscribed ? (
            <FormattedMessage defaultMessage='Subscribed' id='copy.subscribed' />
          ) : (
            <FormattedMessage defaultMessage='On hold' id='copy.on-hold' />
          )}
        </Text>
        <Text as='p' color={SemanticColors.body} variant='paragraph1'>
          {isCoinDisplayed ? (
            <CoinDisplay
              coin={coin}
              color='grey700'
              cursor='inherit'
              size='14px'
              weight={500}
              data-e2e={`${coin} balance`}
            >
              {balance}
            </CoinDisplay>
          ) : (
            <FiatDisplay coin={coin} color='grey700' size='14px' weight={500}>
              {balance}
            </FiatDisplay>
          )}
        </Text>
      </Flex>
    </Padding>
  )
  return (
    <BalanceDropdownContainer ref={ref}>
      {renderRows(Number(activeRewardsBalance) - totalBondingDeposits, true)}
      {renderRows(totalBondingDeposits, false)}
      <CoinToggleButton onClick={handleCoinToggled}>
        <Padding vertical={0.75}>
          <Text color={SemanticColors.primary} variant='body2'>
            <FormattedMessage
              defaultMessage='Show in {currency}'
              id='modals.activeRewards.balancedropdown.button'
              values={{
                currency: isCoinDisplayed ? walletCurrency : coin
              }}
            />
          </Text>
        </Padding>
      </CoinToggleButton>
    </BalanceDropdownContainer>
  )
}

export default BalanceDropdown

type OwnProps = {
  activeRewardsBalance: string
  coin: CoinType
  handleBalanceDropdown: () => void
  handleCoinToggled: () => void
  isCoinDisplayed: boolean
  totalBondingDeposits: number
  walletCurrency: FiatType
}
