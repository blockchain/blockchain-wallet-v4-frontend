import moment from 'moment'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { CoinType } from 'core/types'
import { Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

export const CustodialTransactionRow = styled.div`
  width: calc(100% - 14px);
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey000} !important;
  padding: 14px;
  padding-left: 0px;
  margin-left: 14px;
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
export const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`
export const StyledFiatDisplay = styled(FiatDisplay)`
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
        .format('MMMM D YYYY @ h:mm A')}
    </Text>
  )
}
