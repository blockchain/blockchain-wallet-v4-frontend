import styled from 'styled-components'

export const HomeBalanceTable = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const HomeBalanceRow = styled.div`
  flex: auto;
  display: flex;
  padding: 20px 0px;
  flex-direction: column;
  justify-content: center;
  min-height: 40px;
  &:first-child {
    flex: 1;
    display: block;
    padding: 15px 0px;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
  @media (max-width: 480px) {
    min-height: auto;
    padding: 15px 0px;
  }
`
