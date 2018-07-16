import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuTransactionStatus = props => {
  const { handleClick, statuses, value } = props

  return (
    <TabMenu>
      {
        statuses.indexOf('') > -1 && <TabMenuItem selected={value === ''} onClick={() => handleClick('')}>
          <FormattedMessage id='components.form.tabmenutransactionstatus.all' defaultMessage='All' />
        </TabMenuItem>
      }
      {
        statuses.indexOf('received') > -1 && <TabMenuItem selected={value === 'received'} onClick={() => handleClick('received')}>
          <FormattedMessage id='components.form.tabmenutransactionstatus.received' defaultMessage='Received' />
        </TabMenuItem>
      }
      {
        statuses.indexOf('sent') > -1 && <TabMenuItem selected={value === 'sent'} onClick={() => handleClick('sent')}>
          <FormattedMessage id='components.form.tabmenutransactionstatus.sent' defaultMessage='Sent' />
        </TabMenuItem>
      }
      {
        statuses.indexOf('transferred') > -1 && <TabMenuItem selected={value === 'transferred'} onClick={() => handleClick('transferred')}>
          <FormattedMessage id='components.form.tabmenutransactionstatus.transferred' defaultMessage='Transferred' />
        </TabMenuItem>
      }
    </TabMenu>
  )
}

TabMenuTransactionStatus.propTypes = {
  value: PropTypes.oneOf(['', 'received', 'sent', 'transferred']),
  onClick: PropTypes.func
}

export default TabMenuTransactionStatus
