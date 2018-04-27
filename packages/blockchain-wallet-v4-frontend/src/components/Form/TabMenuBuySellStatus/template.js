import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuBuySellStatus = props => {
  const { handleClick, value } = props

  return (
    <TabMenu>
      <TabMenuItem style={{ paddingLeft: '0px' }}selected={value === 'buy'} onClick={() => handleClick('buy')}>
        <FormattedMessage id='components.form.tabmenubuysell.buy' defaultMessage='Buy' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'sell'} onClick={() => handleClick('sell')}>
        <FormattedMessage id='components.form.tabmenubuysell.sell' defaultMessage='Sell' />
      </TabMenuItem>
      <TabMenuItem selected={value === 'order_history'} onClick={() => handleClick('order_history')}>
        <FormattedMessage id='components.form.tabmenubuysell.order_history' defaultMessage='Order History' />
      </TabMenuItem>
    </TabMenu>
  )
}

TabMenuBuySellStatus.propTypes = {
  value: PropTypes.oneOf(['buy', 'sell', 'order_history', '']),
  onClick: PropTypes.func
}

export default TabMenuBuySellStatus
