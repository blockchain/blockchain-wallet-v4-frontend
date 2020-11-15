import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { OwnProps as Props } from '.'
import { Tooltip, TooltipHost, TooltipIcon } from 'blockchain-info-components'

const TooltipWrapper = styled.div`
  padding-top: 1px;
`

const LockTime = (props: Props) => {
  const { lockTime } = props
  return (
    <>
      <TooltipWrapper>
        <TooltipHost id='info_tooltip'>
          <TooltipIcon name='info' color='grey400' size='14px' />
        </TooltipHost>
      </TooltipWrapper>
      <Tooltip id='info_tooltip'>
        <FormattedMessage
          id='modals.withdraw.tooltip_info'
          defaultMessage='The remaining balance will be available to be withdrawn within {days} days.'
          values={{ days: lockTime }}
        />
      </Tooltip>
    </>
  )
}

export default LockTime
