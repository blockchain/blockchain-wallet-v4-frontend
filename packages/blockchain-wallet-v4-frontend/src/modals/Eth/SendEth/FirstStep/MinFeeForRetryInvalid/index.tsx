import { ErrorCartridge } from 'components/Cartridge'
import { FormattedMessage } from 'react-intl'
import React from 'react'

const MinFeeForRetryInvalid: React.FC = () => {
  return (
    <ErrorCartridge>
      <FormattedMessage
        id='modals.sendeth.firststep.min_fee_for_retry'
        defaultMessage='Please use a higher fee to retry your transaction.'
      />
    </ErrorCartridge>
  )
}

export default MinFeeForRetryInvalid
