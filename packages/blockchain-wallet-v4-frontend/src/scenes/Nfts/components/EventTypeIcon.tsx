import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'
import { IconActivity, IconCart, IconCloseCircle, IconSend, IconTag } from '@blockchain-com/icons'

import { opensea_event_types } from '.'

const EventTypeIcon: React.FC<Props> = ({ event_type }) => {
  switch (event_type) {
    case 'successful':
      return <IconCart color={PaletteColors['grey-400']} />
    case 'transfer':
      return <IconSend color={PaletteColors['grey-400']} />
    case 'bid_entered':
    case 'offer_entered':
      return <IconActivity color={PaletteColors['grey-400']} />
    case 'created':
      return <IconTag color={PaletteColors['grey-400']} />
    case 'cancelled':
    case 'bid_withdrawn':
      return <IconCloseCircle color={PaletteColors['grey-400']} />
    default:
      return null
  }
}

type Props = {
  event_type: keyof typeof opensea_event_types
}

export default EventTypeIcon
