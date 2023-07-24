import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import Form from 'components/Form/Form'

export const FORM_NAME = 'stakingWithdrawalForm'

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

export const NetworkFee = styled.div`
  display: flex;
  flex-direction: column;
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

export const CloseIconContainer = styled.div`
  cursor: pointer;
`
export const TopText = styled(Text)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`
export const PercentageButton = styled.div<{ selected?: boolean }>`
  border: 1px solid #dfe3eb;
  border-radius: 42px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  width: 20%;
  margin: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? props.theme.blue000 : null)};
`
export const CustomErrorCartridge = styled(ErrorCartridge)`
  cursor: pointer;
`
export const QuoteActionContainer = styled.div`
  height: 32px;
`

export const emptyEarnBalanceObject = {
  balance: '0',
  bondingDeposits: '0',
  earningBalance: '0',
  fiatAmount: '0',
  locked: '0',
  pendingDeposit: '0',
  pendingInterest: '0',
  pendingWithdrawal: '0',
  totalInterest: '0',
  totalRewards: '0',
  unbondingWithdrawals: '0'
}
