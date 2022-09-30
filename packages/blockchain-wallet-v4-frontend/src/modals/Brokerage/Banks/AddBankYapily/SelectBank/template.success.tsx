import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import FlyoutContainer from 'components/Flyout/Container'
import FlyoutContent from 'components/Flyout/Content'
import FlyoutHeader from 'components/Flyout/Header'
import { AddBankStepType, BankPartners, OBInstitution } from 'data/types'

import {
  BankSearchIcon,
  BankSearchInput,
  BankSearchWrapper,
  SimpleBankRow
} from '../../../../components'
import { LinkDispatchPropsType, OwnProps, SuccessStateType } from '.'

type Props = LinkDispatchPropsType & OwnProps & SuccessStateType

const Success = (props: Props) => {
  const { partner } = props.bankCredentials
  const institutions =
    partner === BankPartners.YAPILY ? props.bankCredentials.attributes.institutions : []
  const [banks, setBanks] = useState<OBInstitution[]>(institutions)

  const simpleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const searchResults = institutions.filter((bank) =>
      bank.name.toLowerCase().match(value.toLowerCase())
    )
    setBanks(searchResults)
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader
        mode='back'
        data-e2e='OpenBankingSelectBankBackButton'
        onClick={props.handleClose}
      >
        <FormattedMessage id='copy.find_your_bank' defaultMessage='Find Your Bank' />
      </FlyoutHeader>
      <FlyoutContent mode='top'>
        <BankSearchWrapper>
          <BankSearchInput onChange={simpleSearch} placeholder='Search' type='text' />
          <BankSearchIcon />
        </BankSearchWrapper>
        {banks.map((bank) => (
          <SimpleBankRow
            key={bank.id}
            institution={bank}
            onClick={() => {
              props.setYapilyBankId(bank.id)
              props.brokerageActions.setAddBankStep({
                addBankStep: AddBankStepType.ADD_BANK_AUTHORIZE
              })
            }}
          />
        ))}
      </FlyoutContent>
    </FlyoutContainer>
  )
}

export default Success
