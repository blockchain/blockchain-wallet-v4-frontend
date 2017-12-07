import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuTransactionStatus = props => {
  const { handleClick, value } = props

  return (
    <TabMenu>
      <TabMenuItem selected={value === ''} onClick={() => handleClick('')}>
        <FormattedMessage id='components.form.tabmenutransactionstatus.all' defaultMessage='All' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'received'} onClick={() => handleClick('received')}>
        <FormattedMessage id='components.form.tabmenutransactionstatus.received' defaultMessage='Received' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'sent'} onClick={() => handleClick('sent')}>
        <FormattedMessage id='components.form.tabmenutransactionstatus.sent' defaultMessage='Sent' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'transferred'} onClick={() => handleClick('transferred')}>
        <FormattedMessage id='components.form.tabmenutransactionstatus.transferred' defaultMessage='Transferred' />
      </TabMenuItem>
    </TabMenu>
  )
}

TabMenuTransactionStatus.propTypes = {
  value: PropTypes.oneOf(['', 'received', 'sent', 'transferred']),
  onClick: PropTypes.func
}

export default TabMenuTransactionStatus
