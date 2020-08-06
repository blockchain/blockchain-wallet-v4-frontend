import { Icon } from 'blockchain-info-components'
import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Props } from '.'
import { Title, Value } from 'components/Flyout'

export const BeneficiaryIcon = (props: Props) => {
  switch (true) {
    case !!props.beneficiary: {
      return <Icon name='bank-filled' color='blue600' />
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
        <Title asValue>{props.beneficiary.agent.account}</Title>
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
