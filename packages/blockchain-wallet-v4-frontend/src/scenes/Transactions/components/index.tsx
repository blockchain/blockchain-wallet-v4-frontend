import styled from 'styled-components'

export const TransactionRow = styled.div`
  width: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey000} !important;
  box-sizing: border-box;
  padding: 14px;
  padding-left: 0px;
  margin-left: 14px;
`