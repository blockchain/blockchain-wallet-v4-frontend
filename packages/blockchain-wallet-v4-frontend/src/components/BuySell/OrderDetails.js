import styled from 'styled-components'

export const OrderDetailsTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
  & > :last-child {
    border-bottom: none;
  }
`

export const OrderDetailsRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 15px;
  padding: ${props => (props.short ? `10px 0px` : `15px 0px`)};
  border-bottom: ${props =>
    props.noBorderBottom ? 'none' : `1px solid ${props.theme['gray-2']}`};
`
