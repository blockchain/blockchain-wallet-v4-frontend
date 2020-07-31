import styled from 'styled-components'

const MultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${props => props.theme.grey800};
  margin-left: 16px;
`

export default MultiRowContainer
