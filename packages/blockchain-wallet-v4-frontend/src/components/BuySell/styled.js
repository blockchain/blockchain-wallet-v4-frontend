import styled from 'styled-components'
import { Button } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import { BorderBox } from 'components/IdentityVerification'

export const MethodContainer = styled.div`
  height: 65px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 25px;
  padding-left: 20px;
  border: 1px solid
    ${props =>
      props.borderDark ? props.theme['gray-2'] : props.theme['gray-1']};
  border-radius: 3px;
  background-color: ${props => props.theme['white-blue']};
`
export const SubmitButton = styled(Button)`
  border-radius: 6px;
  transition: box-shadow 0.3s;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.21);
  &:disabled {
    box-shadow: none;
  }
  &:active {
    box-shadow: none;
  }
`
export const BackButton = styled.div`
  height: 70px;
  width: 70px;
  border: 1px solid ${props => props.theme['gray-1']};
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 30px;
  cursor: pointer;
  ${media.mobile`
    height: 30px;
    width: 30px;
  `};
`
export const SellContainer = styled(BorderBox)`
  padding: 25px;
  width: 400px;
  border-radius: 6px;
`
