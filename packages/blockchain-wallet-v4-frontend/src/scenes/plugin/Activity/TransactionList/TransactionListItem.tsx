import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { getShortTime } from '@core/transactions/eth'
import { EthProcessedTxType } from '@core/transactions/types'
import { Color, Text } from 'blockchain-info-components'
import CryptoAddress from 'components/CryptoAddress/CryptoAddress'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Expanded, Flex } from 'components/Flex'

import TransactionIcon from '../TransactionIcon/TransactionIcon'
import StatusText from './StatusText'

interface ITransactionListItemProps {
  coin: string
  item: EthProcessedTxType
  onClick(tx: EthProcessedTxType): void
  status: 'CONFIRMED' | 'PENDING'
}

const ItemWrapper = styled.div`
  padding-block: 10px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background-color: ${Color('exchangeLogin')};
  }
`

const getTransactionTitle = (type: string, coin: string) => {
  switch (type) {
    case 'sent':
      return (
        <FormattedMessage
          id='plugin.activity.transactionListItem.titleReceived'
          defaultMessage={`Sent ${coin}`} // Message should be a string literal
          values={{ coin }}
        />
      )
    case 'received':
      return (
        <FormattedMessage
          id='plugin.activity.transactionListItem.titleReceived'
          defaultMessage={`Receive ${coin}`} // Message should be a string literal
          values={{ coin }}
        />
      )
    default:
      return ''
  }
}

const TransactionListItem: React.FC<ITransactionListItemProps> = ({
  coin,
  item,
  onClick,
  status
}) => {
  const handleItemClick = () => {
    onClick(item)
  }

  return (
    <ItemWrapper onClick={handleItemClick}>
      <Flex gap={20}>
        <Flex alignItems='center' justifyContent='center'>
          <TransactionIcon size='sm' type={item.type} />
        </Flex>

        <Expanded>
          <Flex flexDirection='column'>
            <Flex justifyContent='space-between'>
              <Text size='16px' lineHeight='150%' color='white' weight={600}>
                {getTransactionTitle(item.type, coin)}
              </Text>

              <CoinDisplay size='16px' lineHeight='150%' color='white' weight={600} coin={coin}>
                {item.amount}
              </CoinDisplay>
            </Flex>

            <Flex justifyContent='space-between'>
              <Text size='12px' lineHeight='150%' color='grey400' weight={500}>
                {getShortTime(new Date(Number(item.time) * 1000))} •{' '}
                <CryptoAddress>{item.type === 'sent' ? item.to : item.from}</CryptoAddress>
              </Text>
              <Text size='12px' lineHeight='150%' color='grey400' weight={500}>
                <FiatDisplay size='12px' lineHeight='18px' color='grey400' weight={500} coin={coin}>
                  {item.amount}
                </FiatDisplay>
              </Text>
            </Flex>

            <StatusText status={status} />
          </Flex>
        </Expanded>
      </Flex>
    </ItemWrapper>
  )
}

export default TransactionListItem
