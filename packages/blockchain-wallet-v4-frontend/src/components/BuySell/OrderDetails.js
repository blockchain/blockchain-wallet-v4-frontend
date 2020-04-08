import media from 'services/ResponsiveService'
import styled from 'styled-components'

export const OrderDetailsTable = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  border: 1px solid ${props => props.theme.grey000};
  background-color: ${props => props.theme.white};
  padding: ${props => props.padding || '0px'};
  margin: 20px 0px 15px 0px;
  width: ${props => props.width || 'auto'};
  & > :last-child {
    border-bottom: none;
  }
  ${media.mobile`
    width: 90%;
    padding: 15px;
  `}
`

export const OrderDetailsRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px 15px;
  padding: ${props => (props.short ? `10px 0px` : `15px 0px`)};
  padding-top: ${props => props.noPaddingTop && '0px'};
  border-bottom: ${props =>
    props.noBorderBottom ? 'none' : `1px solid ${props.theme.grey000}`};
  border-top: ${props => props.borderTop && `1px solid ${props.theme.grey000}`};
`
