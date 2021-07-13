import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Tooltip, TooltipHost, TooltipIcon } from 'blockchain-info-components'

import { OwnProps as Props } from '.'

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
        {lockTime === 0 || lockTime === 1 ? (
          <FormattedMessage
            id='modals.withdraw.tooltip_info_day'
            defaultMessage='The remaining balance will be available to be withdrawn within 1 day.'
          />
        ) : (
          <FormattedMessage
            id='modals.withdraw.tooltip_info'
            defaultMessage='The remaining balance will be available to be withdrawn within {days} days.'
            values={{ days: lockTime }}
          />
        )}
      </Tooltip>
    </>
  )
}

export default LockTime
