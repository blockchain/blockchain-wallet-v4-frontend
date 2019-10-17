import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Link, Text } from 'blockchain-info-components'
import {
  TooltipBody,
  TooltipContent,
  TooltipFooter,
  CloseTourIcon
} from 'components/Tour'

const PitTooltip = props => {
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
        {step.props.pitConnectTest === 'pit_connect_now' ? (
          <Button
            width='110px'
            height='48px'
            nature='primary'
            fullwidth
            onClick={() =>
              step.props.modalActions.showModal('LinkToPitAccount')
            }
          >
            <Text color='white' size='14px' weight={600}>
              <FormattedMessage
                id='the.pit.tooltip.connectnow'
                defaultMessage='Connect Now'
              />
            </Text>
          </Button>
        ) : step.props.pitConnectTest === 'pit_connect_trade' ? (
          <Link
            href={`${step.props.pitUrl}&utm_source=web_wallet&utm_medium=referral&utm_campaign=pit_connect_trade`}
            rel='noopener noreferrer'
            style={{ width: '100%' }}
            target='_blank'
          >
            <Button width='110px' height='48px' nature='primary' fullwidth>
              <Text color='white' size='14px' weight={600}>
                <FormattedMessage
                  id='the.pit.tooltip.checkitout'
                  defaultMessage='Check It Out'
                />
              </Text>
            </Button>
          </Link>
        ) : (
          <Button width='110px' height='48px' nature='primary' fullwidth>
            <Text color='white' size='14px' weight={600}>
              <FormattedMessage
                id='the.pit.tooltip.checkitout'
                defaultMessage='Check It Out'
              />
            </Text>
          </Button>
        )}
      </TooltipFooter>
    </TooltipBody>
  )
}

export default PitTooltip
