import React from 'react'
import { IconActivity, IconCart, IconCheckCircle, IconSend } from '@blockchain-com/icons'

const EventTypeIcon: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <IconCart />
    case 'transfer':
      return <IconSend />
    case 'offer_entered':
      return <IconActivity />
    case 'created':
      return <IconCheckCircle />
    default:
      return null
  }
}

type Props = {
  event_type: 'successful' | 'transfer' | 'offer_entered' | 'created'
}

export default EventTypeIcon
