import React from 'react'
import {
  IconActivity,
  IconCart,
  IconCloseCircle,
  IconSend,
  IconTag,
  PaletteColors
} from '@blockchain-com/constellation'

import { opensea_event_types } from '.'

const EventTypeIcon: React.FC<Props> = ({ event_type, label, size }) => {
  switch (event_type) {
    case 'successful':
      return <IconCart color={PaletteColors['grey-400']} label={label} size={size} />
    case 'transfer':
      return <IconSend color={PaletteColors['grey-400']} label={label} size={size} />
    case 'bid_entered':
    case 'offer_entered':
      return <IconActivity color={PaletteColors['grey-400']} label={label} size={size} />
    case 'created':
      return <IconTag color={PaletteColors['grey-400']} label={label} size={size} />
    case 'cancelled':
    case 'bid_withdrawn':
      return <IconCloseCircle color={PaletteColors['grey-400']} label={label} size={size} />
    default:
      return null
  }
}

type Props = {
  event_type: keyof typeof opensea_event_types
  label: string
  size: 'small' | 'medium' | 'large'
}

export default EventTypeIcon
