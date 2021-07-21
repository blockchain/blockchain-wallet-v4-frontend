import { BaseFieldProps, Field } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { OrangeCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'

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
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
`
export const ArrowIcon = styled(Icon)`
  margin-right: 20px;
`
export const BalanceWrapper = styled.div`
  display: flex;
  margin-top: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
export const BalanceItem = styled.div`
  width: 100%;
  &:last-child {
    margin-left: 32px;
  }
`
export const MaxAmountContainer = styled.div`
  display: flex;
  margin: 24px 0 8px;
`
export const AmountAvailContainer = styled.div`
  cursor: pointer;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.grey000};
`
export const Spacer = styled.div`
  height: 48px;
  border-right: 1px solid ${(props) => props.theme.grey000};
`
export const Bottom = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`
export const CustomFormLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 10px;
`

export const CustomField = styled(Field)<BaseFieldProps & { coin: CoinType; displayCoin: boolean }>`
  > input {
    padding-left: ${(props) => `${props.coin.length * 14}px`};
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
export const NetworkFee = styled.div`
  display: flex;
  flex-direction: column;
`
export const Availability = styled.div`
  margin-top: 24px;
`
export const ButtonContainer = styled.div<{ isOpacityApplied?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  opacity: ${({ isOpacityApplied }) => (isOpacityApplied ? 0.25 : 1)};
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
export const CustomOrangeCartridge = styled(OrangeCartridge)`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-top: 24px;
`
export const CartrigeText = styled.div`
  display: inline;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.orange800};
`
