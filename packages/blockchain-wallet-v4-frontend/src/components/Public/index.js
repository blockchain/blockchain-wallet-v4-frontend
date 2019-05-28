import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);

  @media (min-width: 768px) {
    width: 480px;
  }
`
