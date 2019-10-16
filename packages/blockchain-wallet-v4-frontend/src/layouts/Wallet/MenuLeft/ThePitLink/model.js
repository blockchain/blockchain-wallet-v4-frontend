import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Text } from 'blockchain-info-components'
import {
  TooltipBody,
  TooltipContent,
  TooltipFooter,
  CloseTourIcon
} from 'components/Tour'

export const PitTooltip = props => {
  const { skipProps, step, tooltipProps } = props
  return (
    <TooltipBody {...tooltipProps}>
      <CloseTourIcon
        color='grey400'
        data-e2e='modalCloseButton'
        name='close'
        size='16px'
        weight={600}
        {...skipProps}
      />
      {step.content && <TooltipContent>{step.content}</TooltipContent>}
      <TooltipFooter>
        <Button width='110px' height='48px' nature='primary' fullwidth>
          <LinkContainer to='/thepit'>
            <Text color='white' size='14px' weight={600}>
              <FormattedMessage
                id='the.pit.tooltip.checkitout'
                defaultMessage='Check It Out'
              />
            </Text>
          </LinkContainer>
        </Button>
      </TooltipFooter>
    </TooltipBody>
  )
}
