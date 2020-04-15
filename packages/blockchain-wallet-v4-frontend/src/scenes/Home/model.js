import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { Button } from 'blockchain-info-components'
import {
  CloseTourIcon,
  StepContent,
  StepImg,
  StepTitle,
  TooltipBody,
  TooltipContent,
  TooltipFooter
} from 'components/Tour'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { useEffect, useState } from 'react'

const { GENERAL_EVENTS } = model.analytics

const TourTooltipComponent = ({
  analyticsActions,
  routerActions,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
  ...rest
}) => {
  const [footerButtonDataE2e, setFooterButtonDataE2e] = useState('')
  const [tourTooltipDataE2e, setTourTooltipDataE2e] = useState('')

  useEffect(() => {
    switch (index) {
      case 0:
        setFooterButtonDataE2e('showWalletTourRequest')
        setTourTooltipDataE2e('walletTourPortfolio')
        analyticsActions.logEvent(GENERAL_EVENTS.WALLET_INTRO_PORTFOLIO_VIEWED)
        break
      case 1:
        setFooterButtonDataE2e('showWalletTourSend')
        setTourTooltipDataE2e('walletTourRequest')
        analyticsActions.logEvent(GENERAL_EVENTS.WALLET_INTRO_REQUEST_VIEWED)
        break
      case 2:
        setFooterButtonDataE2e('showWalletTourSwap')
        setTourTooltipDataE2e('walletTourSend')
        analyticsActions.logEvent(GENERAL_EVENTS.WALLET_INTRO_SEND_VIEWED)
        break
      case 3:
        setFooterButtonDataE2e('showWalletTourBuySell')
        setTourTooltipDataE2e('walletTourSwap')
        analyticsActions.logEvent(GENERAL_EVENTS.WALLET_INTRO_SWAP_VIEWED)
        break
      case 4:
        setFooterButtonDataE2e('closeWalletTour')
        setTourTooltipDataE2e('walletTourBuySell')
        analyticsActions.logEvent(GENERAL_EVENTS.WALLET_INTRO_BUYSELL_VIEWED)
        break
    }
  }, [index])

  return (
    <TooltipBody {...tooltipProps} data-e2e={tourTooltipDataE2e}>
      <CloseTourIcon
        color='grey400'
        data-e2e='modalCloseButton'
        name='close'
        size='16px'
        weight={600}
        {...skipProps}
      />
      {step.content && <TooltipContent>{step.content}</TooltipContent>}
      <TooltipFooter isLastStep={isLastStep}>
        <Button
          data-e2e={footerButtonDataE2e}
          width='110px'
          height='48px'
          nature='primary'
          fullwidth
          {...primaryProps}
        >
          {isLastStep ? (
            <FormattedMessage id='buttons.close' defaultMessage='Close' />
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
            id='wallet.tour.stepone.content1'
            defaultMessage="Keep track of your crypto balances from your Wallet's dashboard. Your Wallet currently supports Bitcoin, Ether, Bitcoin Cash, Stellar XLM and USD Digital."
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
            id='wallet.tour.steptwo.content-2'
            defaultMessage="To receive crypto, all the sender needs is your crypto's address. You can find these addresses here."
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
            id='wallet.tour.stepthree.content-1'
            defaultMessage="Send crypto anywhere, anytime. All you need is the recipient's crypto address."
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
            defaultMessage='Trade crypto with low fees and quick settlement.'
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
            id='wallet.tour.stepfive.content-1'
            defaultMessage='Buy Bitcoin with your credit card or bank account to kickstart your crypto portfolio.'
          />
        </StepContent>
      </>
    ),
    placement: 'right',
    disableBeacon: true
  }
]

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export const TourTooltip = connect(
  null,
  mapDispatchToProps
)(TourTooltipComponent)
