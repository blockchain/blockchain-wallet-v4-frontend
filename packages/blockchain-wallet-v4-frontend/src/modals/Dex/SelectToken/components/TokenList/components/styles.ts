import styled from 'styled-components'

import { Icon as BcIcon } from 'blockchain-info-components'

export const NoResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 42px 0 20px;
`

export const TokenListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 350px;
  overflow-y: scroll;
`

export const TokenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 16px 0;
  &:hover {
    cursor: pointer;
  }
`

export const TokenIcon = styled(BcIcon)`
  width: 40px;
`

export const TokenDetails = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`

export const TokenBalanceColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 28px 0;
`
