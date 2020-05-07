import { equals } from 'ramda'
import { FormattedMessage } from 'react-intl'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { WrappedFieldProps } from 'redux-form'
import React, { useState } from 'react'
import styled from 'styled-components'

type Props = WrappedFieldProps

const CustomTabMenu = styled(TabMenu)`
  width: 232px;
  margin-bottom: 12px;
`

const TabMenuTimeFrame: React.FC<Props> = () => {
  const [tab, setTab] = useState<'long' | 'short'>('long')
  const handleTimeFrameChange = (tab: 'long' | 'short') => {
    setTab(tab)
  }
  return (
    <CustomTabMenu>
      <TabMenuItem
        width='50%'
        data-e2e='longTerm'
        selected={equals(tab, 'long')}
        onClick={() => handleTimeFrameChange('long')}
      >
        <FormattedMessage
          id='modals.interest.deposit.longterm'
          defaultMessage='Long-term'
        />
      </TabMenuItem>
      <TabMenuItem
        width='50%'
        data-e2e='shortTerm'
        selected={equals(tab, 'short')}
        onClick={() => handleTimeFrameChange('short')}
      >
        <FormattedMessage
          id='modals.interest.deposit.shortterm'
          defaultMessage='Short-term'
        />
      </TabMenuItem>
    </CustomTabMenu>
  )
}

export default TabMenuTimeFrame
