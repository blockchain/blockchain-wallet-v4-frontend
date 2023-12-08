import styled from 'styled-components'

import { Icon, ModalBody, Text } from 'blockchain-info-components'

export const BalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin: 16px 0 72px;
  & > div:first-child {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
  & > div:last-child {
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`

export const BalanceRow = styled.div`
  flex: auto;
  display: flex;
  padding: 20px 10px;
  flex-direction: column;
  justify-content: center;
  background-color: ${(props) => props.theme.grey000}
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`

export const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  & > div:last-child {
    margin-top: 5px;
  }
`
export const CoinNames = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  & > div:last-child {
    margin-top: 5px;
  }
`

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Coin = styled.div`
  display: flex;
  align-items: center;
`
export const CoinName = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.grey800};
`
export const CoinSymbol = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.grey600};
`
export const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`

export const Body = styled(ModalBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`
