import React from 'react'
import {
  IconActivity,
  IconCart,
  IconCheckCircle,
  IconCloseCircle,
  IconSend
} from '@blockchain-com/icons'

import { opensea_event_types } from '.'

const EventTypeIcon: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <IconCart />
    case 'transfer':
      return <IconSend />
    case 'bid_entered':
    case 'offer_entered':
      return <IconActivity />
    case 'created':
      return <IconCheckCircle />
    case 'bid_withdrawn':
      return <IconCloseCircle />
    default:
      return null
  }
}

type Props = {
  event_type: keyof typeof opensea_event_types
}

export default EventTypeIcon
