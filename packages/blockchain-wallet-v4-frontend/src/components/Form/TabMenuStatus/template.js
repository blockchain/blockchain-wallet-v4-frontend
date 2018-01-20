import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'

const TabMenuStatus = props => {
  const { handleClick, value, statuses } = props

  return (
    <TabMenu>
      {
        statuses.map((status, i) => {
          return (
            <TabMenuItem key={i} selected={value === status} onClick={() => handleClick(status)}>
              <FormattedMessage id={'components.form.TabMenuStatus' + status} defaultMessage={status === '' ? 'all' : status} />
            </TabMenuItem>
          )
        })
      }
    </TabMenu>
  )
}

TabMenuStatus.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func
}

export default TabMenuStatus
