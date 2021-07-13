import styled from 'styled-components'

import { Button, Image } from 'blockchain-info-components'
import { media } from 'services/styles'

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

export const ColLeft = styled.div`
  width: 50%;
  ${media.mobile`
    width: 100%;
  `};
`

export const ColLeftInner = styled.div`
  width: 80%;
`

export const ColRight = styled.div`
  width: 50%;
  ${media.mobile`
    width: 100%;
  `};
`

export const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`

export const InputWrapper = styled.div`
  width: 90%;
  max-width: 840px;
  margin: 0 auto;
  ${media.tablet`
    max-width: 568px;
  `};
  ${media.mobile`
    max-width: 432px;
  `};
`

export const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: ${props => props.color && props.theme[props.color]};
  ${media.mobile`
    font-size: 20px;
    font-weight: 500;
  `};
`

export const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 16px;
  ${media.mobile`
    font-size: 14px;
  `};
`

export const ButtonWrapper = styled.div`
  margin-top: 25px;
`

export const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`

export const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
`

export const ErrorWrapper = styled.div`
  margin-top: 5px;
  a {
    cursor: pointer;
    color: ${props => props.theme.blue600};
  }
`

export const ColRightInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding-left: 20%;
  ${media.mobile`
    width: 100%;
    padding-left: 0px;
  `};
`

export const EmailHelper = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: ${props =>
    props.error ? props.theme['error'] : props.theme['grey400']};
  a {
    cursor: pointer;
    color: ${props => props.theme.blue600};
  }
`
export const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
`
export const CancelWrapper = styled(CenteredWrapper)`
  a {
    color: #545456;
    font-weight: 400;
    font-size: 14px;
  }
`

export const BorderBox = styled.div`
  border: 1px solid ${props => props.theme.grey000};
  padding: 30px;
`

/**
 * Not a real input, just for value display
 */
export const FieldMimic = styled.div`
  height: 48px;
  border: 1px solid ${props => props.theme.grey000};
  padding: 0 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${props => props.width || '85%'};
  justify-content: space-between;
  border-radius: 4px;
  ${media.mobile`
    border: none;
    width: 100%;
    padding: 0px;
    flex-direction: column;
    width: fit-content;
  `};
`

export const IdentityVerificationForm = styled(Form)`
  height: 100%;
  label[for='${props => props.activeField}'] {
    color: ${props => props.theme.blue900};
  }
  label[for='${props => props.activeField}'] + div {
    .bc__control, input {
      background-color: ${({ theme }) => theme.white};
      border: 1px solid ${props =>
        props.activeFieldError ? props.theme.error : props.theme.blue600};
    }
  }
`

export const IdentityVerificationHeader = styled(PartnerHeader)`
  margin-top: 40px;
  font-weight: 500;
  position: relative;
  font-size: 24px;
  ${media.mobile`
    margin-top: 32px;
  `};
`

export const IdentityVerificationSubHeader = styled(PartnerSubHeader)`
  font-weight: 400;
  margin-top: 10px;
  ${media.mobile`
    font-size: 16px;
  `};
`

export const Label = styled.label`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 12px;
  display: block;
`

export const BackButton = styled(Button)`
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.grey200};
  border-color: ${props => props.theme.grey200};
`

export const IdentityVerificationImage = styled(Image)`
  margin-top: 40px;
  margin-bottom: 40px;
`
export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  max-width: 840px;
  margin: 0 auto;
  ${media.tablet`
    max-width: 568px;
  `};
  ${media.mobile`
    max-width: 432px;
    flex-direction: column-reverse;
    align-items: center;
    > div, button {
      width: 100%;
      text-align: center;
      &:last-child {
        margin-bottom: 14px;
      }
    }
  `};
`
