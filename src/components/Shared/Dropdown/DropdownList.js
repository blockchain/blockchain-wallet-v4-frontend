import styled from 'styled-components'

const grayLighter = '#eceeef'

const DropdownList = styled.div`
  position: absolute;
  display: ${props => props.opened ? 'flex' : 'none'};
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  order: 1;
  width: 100%;
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
  margin-top: -1px;
  background-color: white;
  border: 1px solid ${grayLighter};
  z-index: 100;
`

export default DropdownList
