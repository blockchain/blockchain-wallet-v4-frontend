import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

export const Wrapper = styled.div`
  width: 100%;
`
export const Coin = styled.div`
  display: flex;
  align-items: center;
`
export const CoinIcon = styled(Icon)`
  font-size: 32px;
  margin-right: 16px;
`
export const CoinName = styled(Text)`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
`

export const Amount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  > div:last-child {
    margin-top: 5px;
  }
`

export const FundSubTitle = styled(Text)`
  color: ${(props) => props.theme.grey600};
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
`
