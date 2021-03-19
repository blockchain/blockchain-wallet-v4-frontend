import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { NavText, SimpleBankRow } from '../../../components'
import { SuccessStateType as _SS } from '.'

type OwnProps = _SS
const Success = (props: OwnProps) => {
  return (
    <FlyoutWrapper>
      <NavText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-back'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={() => {}}
        />
        <FormattedMessage
          id='copy.find_your_bank'
          defaultMessage='Find Your Bank'
        />
      </NavText>
      {props.bankCredentials.attributes.institutions.map(institution => {
        return (
          <div>
            <SimpleBankRow institution={institution} />
            <span>{institution.name}</span>
          </div>
        )
      })}
    </FlyoutWrapper>
  )
}

export default Success
