import styled from 'styled-components'
import media from 'services/ResponsiveService'
import { Button, Image, Text } from 'blockchain-info-components'
import { FaqMessage, FormGroup } from 'components/Form'

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
  width: 100%;
`

export const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
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
  font-weight: 400;
  margin-bottom: 15px;
`

export const ErrorWrapper = styled.div`
  margin-top: 5px;
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
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
    props.error ? props.theme['error'] : props.theme['gray-3']};
  a {
    cursor: pointer;
    color: ${props => props.theme['brand-secondary']};
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
    font-weight: 300;
    font-size: 14px;
  }
`

export const BorderBox = styled.div`
  border: 1px solid ${props => props.theme['gray-1']};
  padding: 30px;
`

/**
 * Not a real input, just for value display
 */
export const FieldMimic = styled.div`
  height: 28px;
  border: 1px solid #cccccc;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
  justify-content: space-between;
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
`

export const IdentityVerificationHeader = styled(PartnerHeader)`
  font-weight: 400;
  ${media.mobile`
    font-weight: 400;
  `};
`

export const IdentityVerificationSubHeader = styled(PartnerSubHeader)`
  font-weight: 200;
`

export const FaqFormMessage = styled(FaqMessage)`
  position: absolute;
  margin-top: 30px;
  width: 60%;
  left: 105%;
`

export const FaqFormGroup = styled(FormGroup)`
  position: relative;
  margin-bottom: 24px;
  max-width: 800px;
  width: 60%;
  ${media.mobile`
    width: 100%;
  `};
`

export const Label = styled(Text)`
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 12px;
`

export const BackButton = styled(Button)`
  color: ${props => props.theme['white']};
  background-color: ${props => props.theme['gray-2']};
  border-color: ${props => props.theme['gray-2']};
`

export const IdentityVerificationImage = styled(Image)`
  margin-top: 40px;
  margin-bottom: 40px;
`
