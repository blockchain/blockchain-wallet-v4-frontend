import styled from 'styled-components'

const SecurityContainer = styled.div`
  display: grid;
  grid-template-columns: 12% 73% 15%;
  width: 95%;
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 4px;
  padding: 20px;
`

export default SecurityContainer
