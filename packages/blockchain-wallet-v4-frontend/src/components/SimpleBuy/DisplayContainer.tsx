import styled from 'styled-components'

const DisplayContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
  padding: 16px 40px;
  flex-direction: row;
  cursor: pointer;
  border-bottom: 1px solid ${props => props.theme.grey000};
  transition: background-color 0.3s;
  &:hover {
    background-color: ${props => props.theme.grey000};
  }
`

export default DisplayContainer
