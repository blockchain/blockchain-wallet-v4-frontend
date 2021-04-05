import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

const TooltipBody = styled.div`
  position: relative;
  min-width: 300px;
  max-width: 400px;
  background-color: ${props => props.theme.white};
  border-radius: 4px;
`
const TooltipContent = styled.div`
  color: ${props => props.theme.white};
  padding: 20px;
`
const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme.white};
  padding: 6px 20px 20px;
`
const StepChangeWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
const StepTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 16px;
`
export const TourTooltip = ({
  backProps,
  closeProps,
  continuous,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps
}) => {
  return (
    <div {...tooltipProps}>
      <TooltipBody>
        {step.content && <TooltipContent>{step.content}</TooltipContent>}
        <TooltipFooter isLastStep={isLastStep}>
          {!isLastStep && (
            <ClickableText size='13px' weight={400} {...skipProps}>
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
                <FormattedMessage id='buttons.back' defaultMessage='Back' />
              </Button>
            )}
            <Button
              width='110px'
              height='38px'
              nature='primary'
              {...primaryProps}
            >
              {isLastStep ? (
                <FormattedMessage
                  id='scenes.lockbox.tour.finish'
                  defaultMessage='Finish Tour'
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

export const TOUR_STEPS = [
  {
    target: '.tour-step1',
    content: (
      <React.Fragment>
        <StepTitle weight={500}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.title'
            defaultMessage='Welcome to your Lockbox!'
          />
        </StepTitle>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepone.content'
            defaultMessage="This is the dashboard for your Lockbox. Below is the list of all transactions made with your Lockbox. Let's learn more about these assets."
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    offset: 4,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step2',
    content: (
      <React.Fragment>
        <StepTitle weight={500}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.title'
            defaultMessage='Asset List'
          />
        </StepTitle>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.lockbox.tour.steptwo.content'
            defaultMessage='Here are the assets supported by your Lockbox. The balances of each asset are displayed on each card. Clicking on a card will filter the transaction list below to just that asset.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    offset: 4,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step3',
    content: (
      <React.Fragment>
        <StepTitle weight={500}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.title'
            defaultMessage='Transaction Search'
          />
        </StepTitle>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepthree.addfilters'
            defaultMessage='Here you can search for any transaction made with your Lockbox by entering coin names, addresses or descriptions. Asset filters, applied by clicking the asset cards above, will also show here.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom',
    offset: 4,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step4',
    content: (
      <React.Fragment>
        <StepTitle weight={500}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.title'
            defaultMessage='App Manager'
          />
        </StepTitle>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfour.content'
            defaultMessage='Want to add, update or remove applications?  Clicking here will open the app manager and allow you to change and update the apps on your device.'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    offset: 4,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  },
  {
    target: '.tour-step5',
    content: (
      <React.Fragment>
        <StepTitle weight={500}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.title'
            defaultMessage='Lockbox Settings'
          />
        </StepTitle>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='scenes.lockbox.tour.stepfive.content'
            defaultMessage='Clicking here will bring you to the settings page where you can rename your device, install firmware updates, verify your devices authenticity and much more!'
          />
        </Text>
      </React.Fragment>
    ),
    placement: 'bottom-end',
    offset: 4,
    disableBeacon: true,
    disableOverlayClose: true,
    hideCloseButton: true,
    showSkipButton: true
  }
]
