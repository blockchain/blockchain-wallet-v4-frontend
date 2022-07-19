import React from 'react'
import { useIntl } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import styled from 'styled-components'

import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { CoinDataItem } from '../../../../hooks/useSelfCustodyCoinsBalances'
import SearchInput from './SearchInput'
import SelectCoinItem from './SelectCoinItem'

const Wrapper = styled(Flex)`
  height: 100%;
`

const IconWrapper = styled(Flex)`
  cursor: pointer;
`

const SearchInputWrapper = styled(Flex)`
  margin-bottom: 27px;
  width: 100%;
`

interface ISearchCoinProps {
  coins: CoinDataItem[]
  onClose(): void
  onSelectCoin(coin: string): void
}

const SelectCoin: React.FC<ISearchCoinProps> = ({ coins, onClose, onSelectCoin }) => {
  const [searchInputValue, setSearchInputValue] = React.useState('')
  const intl = useIntl()

  const handleBackClick = () => {
    onClose()
  }

  const handelSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value)
  }

  const ethWithBalance = React.useMemo(
    () => coins.find((item) => item.coinfig.symbol === 'ETH'),
    [coins]
  )

  // It's necessary to display ETH at the top of the list in any case, regardless of whether it has a balance or not
  const ethItem =
    ethWithBalance ||
    ({
      balance: 0,
      coinfig: { ...window.coins.ETH.coinfig }
    } as unknown as CoinDataItem)

  const coinsWithoutEth = React.useMemo(
    () =>
      coins.filter((item) => item.coinfig.symbol !== 'ETH').sort((a, b) => a.balance - b.balance),
    [coins]
  )

  const items = [ethItem, ...coinsWithoutEth].filter(
    (item) =>
      item.coinfig.name.toLowerCase().includes(searchInputValue.toLowerCase()) ||
      item.coinfig.symbol.toLowerCase().includes(searchInputValue.toLowerCase())
  )

  return (
    <Wrapper flexDirection='column'>
      <Padding bottom={45}>
        <IconWrapper>
          <Icon label='go-back' size='md' color='grey600'>
            <IconArrowLeft onClick={handleBackClick} />
          </Icon>
        </IconWrapper>
      </Padding>

      <SearchInputWrapper>
        <SearchInput
          type='text'
          value={searchInputValue}
          onChange={handelSearchChange}
          placeholder={intl.formatMessage({
            defaultMessage: 'Search coin',
            id: 'plugin.activity.selectCoin.searchCoin'
          })}
        />
      </SearchInputWrapper>

      <Flex flexDirection='column'>
        {items.map((item) => (
          <SelectCoinItem
            key={item.coinfig.symbol}
            symbol={item.coinfig.symbol}
            name={item.coinfig.name}
            balance={item.balance}
            onSelect={onSelectCoin}
          />
        ))}
      </Flex>
    </Wrapper>
  )
}

export default React.memo(SelectCoin)
