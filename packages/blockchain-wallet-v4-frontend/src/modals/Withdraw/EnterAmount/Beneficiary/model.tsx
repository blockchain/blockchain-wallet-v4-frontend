import { Icon, Text } from 'blockchain-info-components'
import React from 'react'

import { FormattedMessage } from 'react-intl'
import { Props } from '.'

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
        <Text color='grey900' size='14px' weight={600}>
          {props.beneficiary.name}
        </Text>
        <Text
          color='grey600'
          size='12px'
          weight={500}
          style={{ marginTop: '4px' }}
        >
          Limit Here
        </Text>
      </>
    )
  } else {
    return (
      <Text color='grey900' size='14px' weight={600}>
        <FormattedMessage id='buttons.add_bank' defaultMessage='Add a Bank' />
      </Text>
    )
  }
}
