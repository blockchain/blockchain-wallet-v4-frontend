import styled from 'styled-components'

const SelectBarHeader = styled.div`
  font-size: ${props => props.selected ? 14 : 18}px;
  font-weight: 300;
  opacity: ${props => props.selected ? 0.5 : 1};
  margin-bottom: 10px;
  transition: ${props => `font-size ${props.timing}, opacity ${props.timing}`};
`

export default SelectBarHeader
