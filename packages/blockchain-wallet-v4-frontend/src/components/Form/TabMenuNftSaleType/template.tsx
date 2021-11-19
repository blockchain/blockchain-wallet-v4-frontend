import React from 'react'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuNftSaleTypeTemplate = (props) => {
  const { handleClick, value } = props

  return (
    <TabMenu>
      <TabMenuItem
        selected={value === 'fixed-price'}
        onClick={() => handleClick('fixed-price')}
        data-e2e='transactionTabMenuNftFixedPrice'
      >
        <FormattedMessage id='components.nfts.fixed_price' defaultMessage='Fixed Price' />
      </TabMenuItem>
      <TabMenuItem
        selected={value === 'timed-auction'}
        onClick={() => handleClick('timed-auction')}
        data-e2e='transactionTabMenuNftTimedAuction'
      >
        <FormattedMessage id='components.nfts.timed_auction' defaultMessage='Timed Auction' />
      </TabMenuItem>
    </TabMenu>
  )
}

export default TabMenuNftSaleTypeTemplate
