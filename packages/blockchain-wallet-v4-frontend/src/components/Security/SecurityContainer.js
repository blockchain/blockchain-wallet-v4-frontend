import styled from 'styled-components'

const SecurityContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 95%;
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 4px;
  padding: 20px;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

export default SecurityContainer
