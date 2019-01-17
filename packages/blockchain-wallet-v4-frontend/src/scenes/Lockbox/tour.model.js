import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

export const TOUR_STEPS = [
  {
    target: '.tour-step1',
    content: (
      <React.Fragment>
        <Text size='20px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.title'
            defaultMessage='Welcome to your Lockbox!'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.content'
            defaultMessage="Lockbox is organized by asset. Select an asset to view it's transaction history."
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step2',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.title'
            defaultMessage='Asset List'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.content'
            defaultMessage='These are the assets available to your Lockbox.  Your balances are shown by default.  Clicking on an asset with filter the transaction list to show just that asset.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step3',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.title'
            defaultMessage='Transaction Search'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.content'
            defaultMessage='Here you can search for any transaction made with your Lockbox by entering coin names, addresses or descriptions.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step4',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.title'
            defaultMessage='App Manager'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.content'
            defaultMessage='Want to add, update or remove applications?  Click here to manage all applications on your device.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step5',
    content: (
      <React.Fragment>
        <Text size='18px' weight={400} style={{ marginBottom: '16px' }}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.title'
            defaultMessage='Lockbox Settings'
          />
        </Text>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.content'
            defaultMessage='Clicking here will bring you to the settings page where you can rename your device, install firmware updates, verify your devices authenticity and much more!'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  }
]

const TooltipBody = styled.div`
  position: relative;
  min-width: 300px;
  max-width: 400px;
  background-color: ${props => props.theme['white']};
  border-radius: 4px;
`
const TooltipContent = styled.div`
  color: ${props => props.theme['white']};
  padding: 20px;
`
const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme['white']};
  padding: 6px 20px 20px;
`
const StepChangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

export const TourTooltip = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps
}) => {
  return (
    <div {...tooltipProps}>
      <TooltipBody>
        {step.content && <TooltipContent>{step.content}</TooltipContent>}
        <TooltipFooter isLastStep={isLastStep}>
          {!isLastStep && (
            <ClickableText size='13px' weight={300} {...skipProps}>
              <FormattedMessage
                id='scenes.lockbox.tour.skip'
                defaultMessage='Skip Tour'
              />
            </ClickableText>
          )}
          <StepChangeWrapper>
            {index > 0 && (
              <Button
                width='70px'
                height='38px'
                nature='empty-secondary'
                style={{ marginRight: '8px' }}
                {...backProps}
              >
                <FormattedMessage
                  id='scenes.lockbox.tour.back'
                  defaultMessage='Back'
                />
              </Button>
            )}
            <Button
              width='70px'
              height='38px'
              nature='primary'
              {...primaryProps}
            >
              {isLastStep ? (
                <FormattedMessage
                  id='scenes.lockbox.tour.finish'
                  defaultMessage='Finish'
                />
              ) : (
                <FormattedMessage
                  id='scenes.lockbox.tour.next'
                  defaultMessage='Next'
                />
              )}
            </Button>
          </StepChangeWrapper>
        </TooltipFooter>
      </TooltipBody>
    </div>
  )
}
