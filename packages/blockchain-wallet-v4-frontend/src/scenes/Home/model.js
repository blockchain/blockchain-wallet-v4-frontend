import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'

const TooltipBody = styled.div`
  position: relative;
  width: 100%;
  max-width: 256px;
  background-color: ${props => props.theme['white']};
  border-radius: 8px;
  box-shadow: 0 0 15px ${({ theme }) => theme['gray-3']};
  padding: 32px;

  > span:first-child {
    position: absolute;
    top: 24px;
    right: 24px;

    &:hover {
      cursor: pointer;
    }
  }
`
const TooltipContent = styled.div`
  color: ${props => props.theme['white']};
  margin-bottom: 24px;
  text-align: center;
`
const TooltipFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props =>
    props.isLastStep ? 'flex-end' : 'space-between'};
  align-content: center;
  align-items: center;
  color: ${props => props.theme['white']};
`

const StepImg = styled(Image)`
  margin-bottom: 32px;
`

const StepTitle = styled(Text)`
  font-size: 20px;
  text-align: center;
  margin-bottom: 8px;
  line-height: 24px;
`

const StepContent = styled(Text)`
  line-height: 24px;
`

export const TourTooltip = props => {
  return (
    <TooltipBody {...props.tooltipProps}>
      <Icon
        color='grey-600'
        name='close'
        size='16px'
        weight={600}
        {...props.skipProps}
      />
      {props.step.content && (
        <TooltipContent>{props.step.content}</TooltipContent>
      )}
      <TooltipFooter isLastStep={props.isLastStep}>
        <Button
          width='110px'
          height='48px'
          nature='primary'
          fullwidth
          {...props.primaryProps}
        >
          {props.isLastStep ? (
            <FormattedMessage id='wallet.tour.finish' defaultMessage='Close' />
          ) : (
            <FormattedMessage id='wallet.tour.next' defaultMessage='Next' />
          )}
        </Button>
      </TooltipFooter>
    </TooltipBody>
  )
}

export const TOUR_STEPS = [
  {
    target: '.wallet-intro-tour-step-1',
    content: (
      <>
        <StepImg name='intro-bank-gif' width='40px' height='40px' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='wallet.tour.stepone.title'
            defaultMessage='View Your Portfolio!'
          />
        </StepTitle>
        <StepContent color='grey600' size='14px' weight={500}>
          <FormattedMessage
            id='wallet.tour.stepone.content'
            defaultMessage="Keep track of your crypto balances from your Wallet's dashboard. Your Wallet currently supports Bitcoin, Ether, Bitcoin Cash, Stellar XLM and USD PAX."
          />
        </StepContent>
      </>
    ),
    placement: 'right',
    disableBeacon: true
  },
  {
    target: '.wallet-intro-tour-step-2',
    content: (
      <>
        <StepImg name='intro-receive-gif' width='40px' height='40px' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='wallet.tour.steptwo.title'
            defaultMessage='Request'
          />
        </StepTitle>
        <StepContent size='14px' weight={500}>
          <FormattedMessage
            id='wallet.tour.steptwo.content-1'
            defaultMessage="To receive crypto, all the Sender needs is your crypto's address. You can find these addresses here."
          />
        </StepContent>
      </>
    ),
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '.wallet-intro-tour-step-3',
    content: (
      <>
        <StepImg name='intro-send-gif' width='40px' height='40px' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='wallet.tour.stepthree.title'
            defaultMessage='Send'
          />
        </StepTitle>
        <StepContent size='14px' weight={500}>
          <FormattedMessage
            id='wallet.tour.stepthree.addfilters'
            defaultMessage='Send crypto anywhere, anytime. All you need is the recipients crypto address.'
          />
        </StepContent>
      </>
    ),
    placement: 'bottom',
    disableBeacon: true
  },
  {
    target: '.wallet-intro-tour-step-4',
    content: (
      <>
        <StepImg name='intro-swap-gif' width='40px' height='40px' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='wallet.tour.stepfour.title'
            defaultMessage='Swap'
          />
        </StepTitle>
        <StepContent size='14px' weight={500}>
          <FormattedMessage
            id='wallet.tour.stepfour.content'
            defaultMessage='Trade crypto with low fees and  quick settlement.'
          />
        </StepContent>
      </>
    ),
    placement: 'right',
    disableBeacon: true
  },
  {
    target: '.wallet-intro-tour-step-5',
    content: (
      <>
        <StepImg name='intro-cart-gif' width='40px' height='40px' />
        <StepTitle size='20px' weight={600}>
          <FormattedMessage
            id='wallet.tour.stepfive.title'
            defaultMessage='Buy & Sell'
          />
        </StepTitle>
        <StepContent size='14px' weight={500}>
          <FormattedMessage
            id='wallet.tour.stepfive.content'
            defaultMessage='Jumpstart your crypto portfolio by easily buying and selling Bitcoin.'
          />
        </StepContent>
      </>
    ),
    placement: 'right',
    disableBeacon: true
  }
]
