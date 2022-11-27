import React from 'react'
import styled from 'styled-components'

import { Icon as BcIcon, SpinningLoader } from 'blockchain-info-components'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`

export const TextFilterWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin: 16px 0;

  > div:first-child {
    width: 100%;
  }
`

export const SearchIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

export const NoResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 42px 0 20px;
`

export const TokenList = styled.div`
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

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 28px 0;
`

export const Loading = () => (
  <LoadingWrapper>
    <SpinningLoader width='36px' height='36px' borderWidth='4px' />
  </LoadingWrapper>
)
