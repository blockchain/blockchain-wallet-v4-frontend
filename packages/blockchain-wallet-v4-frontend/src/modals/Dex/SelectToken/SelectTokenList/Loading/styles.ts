import styled from 'styled-components'

export const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 28px 0;
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
