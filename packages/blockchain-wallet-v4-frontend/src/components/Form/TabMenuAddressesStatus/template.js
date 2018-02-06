import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuAddressesStatus = props => {
  const { handleClick, value } = props
  return (
    <TabMenu>
      <TabMenuItem selected={value === 'bitcoin'} onClick={() => handleClick('bitcoin')}>
        <FormattedMessage id='components.form.tabmenuaddresses.bitcoin' defaultMessage='Bitcoin' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'bitcoin_cash'} onClick={() => handleClick('bitcoin_cash')}>
        <FormattedMessage id='components.form.tabmenuaddresses.bitcoin_cash' defaultMessage='Bitcoin Cash' />
      </TabMenuItem>
    </TabMenu>
  )
}

TabMenuAddressesStatus.propTypes = {
  value: PropTypes.oneOf(['bitcoin', 'bitcoin_cash']),
  onClick: PropTypes.func
}

export default TabMenuAddressesStatus
