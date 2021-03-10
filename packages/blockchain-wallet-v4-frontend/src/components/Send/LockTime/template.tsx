import React from 'react'
import { FormattedMessage } from 'react-intl'

import { CustomBlueCartridge } from './../index'
import { OwnProps as Props } from '.'

const LockTime = (props: Props & { lockTime: number }) => {
  const { coin, lockTime, withdrawable } = props
  return (
    <CustomBlueCartridge>
      {withdrawable ? (
        <FormattedMessage
          id='modals.send.firststep.amt_greater_than_custody_withdraw'
          defaultMessage='Your available balance is {withdrawable} {coin}. The remaining balance will be available to be withdrawn within {lockTime} days.'
          values={{
            coin,
            lockTime,
            withdrawable
          }}
        />
      ) : (
        <FormattedMessage
          id='modals.send.firststep.available_in_x_days'
          defaultMessage='Your {coin} will be available to be withdrawn within {lockTime} days.'
          values={{ coin, lockTime }}
        />
      )}
    </CustomBlueCartridge>
  )
}

export default LockTime
