import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCheck, IconClose, IconHistory } from '@blockchain-com/icons'

export const statusConfig = {
  CONFIRMED: {
    color: 'green400',
    icon: <IconCheck />,
    text: <FormattedMessage id='plugin.activity.status.confirmed' defaultMessage='Confirmed' />
  },
  FAILED: {
    color: 'red400',
    icon: <IconClose />,
    text: <FormattedMessage id='plugin.activity.status.failed' defaultMessage='Failed' />
  },
  PENDING: {
    color: 'orange400',
    icon: <IconHistory />,
    text: <FormattedMessage id='plugin.activity.status.pending' defaultMessage='Pending' />
  }
}
