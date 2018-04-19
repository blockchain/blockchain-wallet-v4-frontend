import styled from 'styled-components'

export const MethodContainer = styled.div`
  height: 65px;
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 30px;
  padding-left: 20px;
  border: 1px solid ${props => props.borderDark ? props.theme['gray-2'] : props.theme['gray-1']};
  border-radius: 3px;
  background-color: ${props => props.theme['white-blue']};
`
