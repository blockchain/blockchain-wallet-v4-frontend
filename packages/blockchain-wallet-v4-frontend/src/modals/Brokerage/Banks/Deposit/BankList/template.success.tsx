import { AddNewButton } from 'components/Brokerage'
import React from 'react'

import { BankDWStepType } from 'data/types'
import { BankTransferAccountType } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as _P } from '.'

type OwnProps = { bankTransferAccounts: BankTransferAccountType[] }
type Props = _P & OwnProps

const BankList = (props: Props) => {
  return (
    <FlyoutWrapper>
      {props.bankTransferAccounts.map(account => (
        <div
          onClick={() => {
            props.brokerageActions.setBankDetails({ account })
            props.brokerageActions.setDWStep({
              dwStep: BankDWStepType.ENTER_AMOUNT
            })
          }}
        >
          {account.details && account.details.bankName}
        </div>
      ))}
      <AddNewButton data-e2e='DepositAddNewPaymentMethod' onClick={() => {}}>
        + Add New
      </AddNewButton>
    </FlyoutWrapper>
  )
}

export default BankList
