import React, { useRef } from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, SemanticColors, Text } from '@blockchain-com/constellation'

import { CoinType, FiatType } from '@core/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { useOnClickOutside } from 'services/misc'

import { BalanceDropdownContainer, CoinToggleButton } from './AccountSummary.model'

const BalanceDropdown = ({
  coin,
  earningBalance,
  handleBalanceDropdown,
  handleCoinToggled,
  isCoinDisplayed,
  totalBondingDeposits,
  totalUnbondingDeposits,
  walletCurrency
}: OwnProps) => {
  const ref = useRef(null)
  useOnClickOutside(ref, handleBalanceDropdown)
  const renderRows = (balance: string, isStaking: boolean, isUnbonding: boolean) => (
    <Flex justifyContent='space-between' gap={8}>
      <Text as='p' color={SemanticColors.title} variant='paragraph2'>
        {isStaking ? (
          <FormattedMessage defaultMessage='Active' id='copy.active' />
        ) : isUnbonding ? (
          <FormattedMessage defaultMessage='Unbonding' id='copy.unbonding' />
        ) : (
          <FormattedMessage defaultMessage='Bonding' id='copy.bonding' />
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
  )
  return (
    <BalanceDropdownContainer ref={ref}>
      {renderRows(totalBondingDeposits, false, false)}
      {renderRows(earningBalance, true, false)}
      {renderRows(totalUnbondingDeposits, false, true)}
      <CoinToggleButton onClick={handleCoinToggled}>
        <FormattedMessage
          defaultMessage='Show in {currency}'
          id='modals.staking.balancedropdown.button'
          values={{
            currency: isCoinDisplayed ? walletCurrency : coin
          }}
        />
      </CoinToggleButton>
    </BalanceDropdownContainer>
  )
}

export default BalanceDropdown

type OwnProps = {
  coin: CoinType
  earningBalance: string
  handleBalanceDropdown: () => void
  handleCoinToggled: () => void
  isCoinDisplayed: boolean
  totalBondingDeposits: string
  totalUnbondingDeposits: string
  walletCurrency: FiatType
}
