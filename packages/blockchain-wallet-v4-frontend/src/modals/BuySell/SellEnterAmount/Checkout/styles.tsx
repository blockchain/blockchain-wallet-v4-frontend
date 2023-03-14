import React, { ReactChild } from 'react'
import { GreyBlueCartridge } from 'blockchain-wallet-v4-frontend/src/modals/Earn/Interest/DepositForm/model'
import styled from 'styled-components'

import { BSOrderActionType } from '@core/types'
import { Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'

import { Row } from '../../../Swap/EnterAmount/Checkout'

export const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`
export const LiftedActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`
export const AnchoredActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
export const CustomForm = styled(Form)`
  height: 100%;
  display: flex;
  flex-direction: column;
`
export const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
export const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`
export const Amounts = styled.div`
  margin: 0 0 24px 0;
  display: flex;
  justify-content: center;
`
export const QuoteActionContainer = styled.div`
  height: 32px;
`
export const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const ActionsItem = styled.div`
  display: flex;
  flex-direction: column;
`

export const MaxAvailableWrapper = styled.div<{ orderType: BSOrderActionType }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CartridgeWrapper = styled.div`
  display: flex;
`

export const ButtonContainer = styled.div`
  margin-top: 24px;
`

export const Cartridge = ({ children, error }: { children: ReactChild; error: boolean }) => {
  return (
    <GreyBlueCartridge
      style={{ marginLeft: 0 }}
      role='button'
      data-e2e={error ? 'sbEnterAmountMaxError' : 'sbEnterAmountMax'}
    >
      {children}
    </GreyBlueCartridge>
  )
}
