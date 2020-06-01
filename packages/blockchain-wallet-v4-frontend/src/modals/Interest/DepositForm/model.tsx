import { BaseFieldProps, Field } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import { CustomCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, FormLabel } from 'components/Form'

export const SendingWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`
export const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const Top = styled(FlyoutWrapper)`
  padding-bottom: 0;
`
export const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
export const CustomFormLabel = styled(FormLabel)`
  margin-top: 24px;
  display: flex;
`
export const CustomField = styled(Field)<BaseFieldProps>`
  > input {
    padding-left: 42px;
  }
  > div:last-child {
    display: none;
  }
`
export const AmountFieldContainer = styled.div`
  display: flex;
  position: relative;
`
export const PrincipalCcyAbsolute = styled.div`
  position: absolute;
  top: 16px;
  left: 12px;
`

export const MaxAmountContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 5px 0;
`
export const FiatMaxContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${props => props.theme.grey000};
`
export const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 28px;
`
export const CalculatorHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const CalculatorDesc = styled(Text)`
  margin: 6px 0 8px;
`
export const CalculatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  background-color: ${props => props.theme.greyFade000};
  border: 1px solid ${({ theme }) => theme.grey000};
  box-sizing: border-box;
  border-radius: 8px;
`

export const AmountError = styled.div`
  margin: 2px 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

export const GreyBlueCartridge = styled(CustomCartridge)`
  background-color: ${props => props.theme.white};
  border: 1px solid ${props => props.theme.grey100};
  color: ${props => props.theme.blue600};
  cursor: pointer;
  margin-left: 10px;
`
export const InterestTermWrapper = styled.div`
  display: flex;
`
export const InterestTermContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-right: 1px solid ${({ theme }) => theme.grey000};
  margin-right: 16px;
  width: 114px;
  height: 48px;

  &:last-child {
    border-right: 1px solid transparent;
    margin-right: 0;
  }
`
export const TermsContainer = styled.div`
  margin: -3px 0 24px 0;

  & > * {
    display: inline-block;
  }
`
export const AgreementContainer = styled.div`
  margin-top: -3px;

  & > * {
    display: inline-block;
  }
`
export const ArrowIcon = styled(Icon)`
  margin-right: 20px;
`
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  > button {
    padding: 15px !important;
  }
`

export const ToggleCoinFiat = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
  cursor: pointer;
`
