import { PaletteColors } from '@blockchain-com/constellation'
import { BaseFieldProps, Field } from 'redux-form'
import styled from 'styled-components'

import { CoinType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { CustomCartridge } from 'components/Cartridge'
import Form from 'components/Form/Form'

export const FORM_NAME = 'stakingDepositForm'

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
export const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`
export const CustomFormLabel = styled.div`
  margin: 24px 0 10px 0;
  display: flex;
  justify-content: space-between;
`
export const CustomField = styled(Field)<BaseFieldProps & { coin: CoinType }>`
  > input {
    padding-left: ${({ coin }) => (coin.length > 3 ? '50px' : '46px')};
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
  left: 16px;
`
export const ErrorText = styled(Text)`
  display: inline-flex;
  font-weight: 500;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 32px;
  background-color: ${PaletteColors['red-000']};
  color: ${PaletteColors['red-800']};
  margin-bottom: 16px;
`
export const FiatMaxContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 0px 6px;
  border-radius: 10px;
  background-color: ${PaletteColors['grey-000']};
`
export const AmountError = styled.div`
  margin: 2px 5px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const GreyBlueCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.white};
  border: 1px solid ${PaletteColors['grey-100']};
  color: ${PaletteColors['blue-600']};
  cursor: pointer;
  margin-left: 10px;
  min-width: 100px;
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
export const ToggleCoinFiat = styled.div`
  display: inline;
`
export const ToggleFiatText = styled(Text)<{ displayCoin: boolean }>`
  font-size: 14px;
  font-weight: 500;
  padding-right: 5px;
  cursor: pointer;
  display: inline;
  color: ${(props) => (props.displayCoin ? props.theme.grey800 : props.theme.blue600)};
`

export const ToggleCoinText = styled(Text)<{ displayCoin: boolean }>`
  font-size: 14px;
  font-weight: 500;
  padding-left: 5px;
  cursor: pointer;
  display: inline;
  color: ${(props) => (props.displayCoin ? props.theme.blue600 : props.theme.grey800)};
`
export const InfoText = styled.div`
  display: inline;
`
export const NetworkFeeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${PaletteColors['grey-100']};
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
`
export const NetworkAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`
