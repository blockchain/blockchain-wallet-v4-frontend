import styled from 'styled-components'

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
