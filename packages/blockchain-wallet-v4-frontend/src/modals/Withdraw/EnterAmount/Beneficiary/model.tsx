import { Icon, Image } from 'blockchain-info-components'
import React from 'react'

import { Props as _P } from '.'
import { BankTransferAccountType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { getBankLogoImageName } from 'services/ImagesService'
import { Title, Value } from 'components/Flyout'

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
      bankName,
      bankAccountType,
      accountNumber
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
