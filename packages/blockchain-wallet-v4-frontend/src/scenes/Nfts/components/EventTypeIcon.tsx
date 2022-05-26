import React from 'react'
import { colors } from '@blockchain-com/constellation'
import { IconActivity, IconCart, IconCloseCircle, IconSend, IconTag } from '@blockchain-com/icons'

import { opensea_event_types } from '.'

const EventTypeIcon: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <IconCart color={colors.grey400} />
    case 'transfer':
      return <IconSend color={colors.grey400} />
    case 'bid_entered':
    case 'offer_entered':
      return <IconActivity color={colors.grey400} />
    case 'created':
      return <IconTag color={colors.grey400} />
    case 'cancelled':
    case 'bid_withdrawn':
      return <IconCloseCircle color={colors.grey400} />
    default:
      return null
  }
}

type Props = {
  event_type: keyof typeof opensea_event_types
}

export default EventTypeIcon
