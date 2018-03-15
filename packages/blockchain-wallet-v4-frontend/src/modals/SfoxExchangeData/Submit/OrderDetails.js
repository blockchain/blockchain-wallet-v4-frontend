import styled from 'styled-components'

export const OrderDetailsTable = styled.div`
  width: 100%;
  padding: 0px 15px;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
  & > :last-child { border-bottom: none; }
`

export const OrderDetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 0px;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
