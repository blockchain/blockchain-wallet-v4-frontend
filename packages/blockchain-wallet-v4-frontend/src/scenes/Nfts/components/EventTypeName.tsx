import React from 'react'
import { FormattedMessage } from 'react-intl'

const EventTypeName: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <FormattedMessage id='copy.sale' defaultMessage='Sale' />
    case 'transfer':
      return <FormattedMessage id='copy.transfer' defaultMessage='Transfer' />
    case 'offer_entered':
      return <FormattedMessage id='copy.offer_entered' defaultMessage='Offer Made' />
    case 'created':
      return <FormattedMessage id='copy.created' defaultMessage='Created' />
    default:
      return null
  }
}

type Props = {
  event_type: 'successful' | 'transfer' | 'offer_entered' | 'created'
}

export default EventTypeName
