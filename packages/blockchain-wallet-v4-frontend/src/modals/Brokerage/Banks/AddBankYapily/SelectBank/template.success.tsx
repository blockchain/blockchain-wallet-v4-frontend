import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { AddBankStepType, BankPartners, OBInstitution } from 'data/types'

import {
  BankSearchIcon,
  BankSearchInput,
  BankSearchWrapper,
  BankWrapper,
  ModalNavWithBackArrow,
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
    <BankWrapper>
      <ModalNavWithBackArrow {...props}>
        <FormattedMessage id='copy.find_your_bank' defaultMessage='Find Your Bank' />
      </ModalNavWithBackArrow>
      <BankSearchWrapper>
        <BankSearchInput onChange={simpleSearch} placeholder='Search' type='text' />
        <BankSearchIcon />
      </BankSearchWrapper>
      {banks.map((bank) => {
        return (
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
        )
      })}
    </BankWrapper>
  )
}

export default Success
