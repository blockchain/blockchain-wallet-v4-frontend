import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { CoinType } from 'core/types'
import { Icon, Text, TextGroup } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

const AddressesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

export const Addresses = ({ to, from }) => {
  return (
    <AddressesWrapper>
      <TextGroup inline style={{ marginBottom: '5px' }}>
        <Text size='14px' color={'grey600'} weight={500}>
          <FormattedMessage id='copy.to:' defaultMessage='To: ' />
        </Text>
        <Text
          size='14px'
          color={'grey600'}
          weight={500}
          data-e2e='transactionListItemTo'
        >
          {to}
        </Text>
      </TextGroup>
      <TextGroup inline>
        <Text size='14px' color={'grey600'} weight={500}>
          <FormattedMessage id='copy.from:' defaultMessage='From: ' />
        </Text>
        <Text
          size='14px'
          color={'grey600'}
          weight={500}
          data-e2e='transactionListItemFrom'
        >
          {from}
        </Text>
      </TextGroup>
    </AddressesWrapper>
  )
}

export const TxRow = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey000} !important;
  padding: 14px;
`
export const Col = styled.div<{ width: string }>`
  width: ${props => props.width};
`
export const IconTx = ({
  coin,
  type
}: {
  coin: CoinType | 'FIAT'
  type:
    | 'BUY'
    | 'SELL'
    | 'DEPOSIT'
    | 'WITHDRAWAL'
    | 'sent'
    | 'received'
    | 'transferred'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'BUY':
      case 'SELL':
        return (
          <Icon
            size='24px'
            weight={600}
            name={type === 'BUY' ? 'plus' : 'minus'}
            color={coin.toLowerCase() as keyof DefaultTheme}
          />
        )
      case 'DEPOSIT':
      case 'WITHDRAWAL':
        return (
          <Icon
            size='20px'
            weight={600}
            color='fiat'
            name={type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        )
      case 'received':
        return (
          <Icon
            size='12px'
            weight={600}
            name={'arrow-bottom-right'}
            color={coin.toLowerCase() as keyof DefaultTheme}
          />
        )
      case 'sent':
        return (
          <Icon
            size='18px'
            weight={600}
            name={'arrow-top-right'}
            color={coin.toLowerCase() as keyof DefaultTheme}
          />
        )
      case 'transferred':
        return (
          <Icon
            size='12px'
            weight={600}
            name={'arrow-top-right-bottom-left'}
            color={coin.toLowerCase() as keyof DefaultTheme}
          />
        )
    }
  }

  return (
    <IconWrapper color={(coin.toLowerCase() + '-light') as keyof DefaultTheme}>
      {getIcon()}
    </IconWrapper>
  )
}
export const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background: ${props => props.theme[props.color]};
`
export const Row = styled(Col)`
  display: flex;
  align-items: center;
`
export const RowHeader = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  margin-top: 12px;
  color: ${props => props.theme.grey600};
`
export const RowValue = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  margin-top: 4px;
  color: ${props => props.theme.grey800};
`
export const StyledCoinDisplay = styled(CoinDisplay)`
  color: ${props => props.theme.grey800};
  justify-content: flex-end;
  font-size: 16px !important;
  font-weight: 600 !important;
`
export const StyledFiatDisplay = styled(FiatDisplay)`
  color: ${props => props.theme.grey600};
  margin-top: 4px;
  justify-content: flex-end;
`
export const StatusAndType = styled.div`
  margin-left: 16px;
`
export const Timestamp = ({ time }: { time: string | number }) => {
  return (
    <Text
      size='14px'
      weight={500}
      color='grey600'
      style={{ marginTop: '4px' }}
      data-e2e='txTimeOrStatus'
    >
      {moment(time)
        .local()
        .format('MMMM D YYYY @h:mmA')}
    </Text>
  )
}
