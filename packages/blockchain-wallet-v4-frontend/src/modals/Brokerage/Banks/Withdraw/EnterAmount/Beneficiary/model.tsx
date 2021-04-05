import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, Image } from 'blockchain-info-components'
import { BankTransferAccountType } from 'blockchain-wallet-v4/src/types'
import { Title, Value } from 'components/Flyout'
import { getBankLogoImageName } from 'services/images'

import { Props as _P } from '.'

type Props = _P & {
  transferAccount?: BankTransferAccountType
}

export const BeneficiaryIcon = (props: Props) => {
  switch (true) {
    case !!props.beneficiary: {
      return <Icon name='bank-filled' color='blue600' />
    }
    case !!props.transferAccount: {
      return (
        <Image
          name={getBankLogoImageName(props.transferAccount?.details.bankName)}
        />
      )
    }
    default: {
      return <Icon name='plus-in-circle-filled' color='blue600' />
    }
  }
}

export const BeneficiaryName = (props: Props) => {
  if (props.beneficiary) {
    return (
      <>
        {' '}
        <Value asTitle>{props.beneficiary.name}</Value>
        <Title asValue>{props.beneficiary.address}</Title>
      </>
    )
  } else if (props.transferAccount) {
    const {
      accountNumber,
      bankAccountType,
      bankName
    } = props.transferAccount?.details

    return (
      <>
        {' '}
        <Value asTitle>{bankName}</Value>
        <Title asValue capitalize>
          {`${bankAccountType} Account ${accountNumber}`}
        </Title>
      </>
    )
  } else {
    return (
      <Value asTitle>
        <FormattedMessage id='buttons.add_bank' defaultMessage='Add a Bank' />
      </Value>
    )
  }
}
