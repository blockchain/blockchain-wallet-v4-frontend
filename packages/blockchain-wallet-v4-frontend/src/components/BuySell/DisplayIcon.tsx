import styled from 'styled-components'

const DisplayIcon = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 500;
  max-width: 32px;
  color: ${(props) => props.theme.grey800};
`

export default DisplayIcon
