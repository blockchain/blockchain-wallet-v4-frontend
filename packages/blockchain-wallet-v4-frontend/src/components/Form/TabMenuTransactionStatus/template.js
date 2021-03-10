import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuTransactionStatus = props => {
  const { handleClick, statuses, value } = props

  return (
    <TabMenu>
      {statuses.indexOf('') > -1 && (
        <TabMenuItem
          selected={value === ''}
          onClick={() => handleClick('')}
          data-e2e='transactionTabMenuAll'
        >
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.all'
            defaultMessage='All'
          />
        </TabMenuItem>
      )}
      {statuses.indexOf('received') > -1 && (
        <TabMenuItem
          selected={value === 'received'}
          onClick={() => handleClick('received')}
          data-e2e='transactionTabMenuReceived'
        >
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.received'
            defaultMessage='Received'
          />
        </TabMenuItem>
      )}
      {statuses.indexOf('sent') > -1 && (
        <TabMenuItem
          selected={value === 'sent'}
          onClick={() => handleClick('sent')}
          data-e2e='transactionTabMenuSent'
        >
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.sent'
            defaultMessage='Sent'
          />
        </TabMenuItem>
      )}
      {statuses.indexOf('transferred') > -1 && (
        <TabMenuItem
          selected={value === 'transferred'}
          onClick={() => handleClick('transferred')}
          data-e2e='transactionTabMenuTransferred'
        >
          <FormattedMessage
            id='components.form.tabmenutransactionstatus.transferred'
            defaultMessage='Transferred'
          />
        </TabMenuItem>
      )}
    </TabMenu>
  )
}

TabMenuTransactionStatus.propTypes = {
  value: PropTypes.oneOf(['', 'received', 'sent', 'transferred']),
  onClick: PropTypes.func
}

export default TabMenuTransactionStatus
