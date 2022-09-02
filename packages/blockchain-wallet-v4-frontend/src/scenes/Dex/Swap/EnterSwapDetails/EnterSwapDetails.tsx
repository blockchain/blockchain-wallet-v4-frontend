import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconSettings, PaletteColors } from '@blockchain-com/constellation'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Remote } from '@core'
import { Button, Text } from 'blockchain-info-components'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexSwapForm, DexSwapSideEnum, DexSwapSteps, ModalName } from 'data/types'

import BaseRateAndFees from '../components/BaseRateAndFees'
import FlipPairButton from '../components/FlipPairButton'
import QuoteDetails from '../components/QuoteDetails'
import SwapPair from '../components/SwapPair'

const { DEX_SWAP_FORM } = model.components.dex

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`
const SettingsIcon = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    cursor: pointer;
  }
`
const SwapWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
  > :nth-child(3) {
    margin-top: 8px;
  }
`
const ErrorText = styled(Text)`
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.red600};
  text-align: center;
`

const EnterSwapDetails = ({
  formActions,
  formValues,
  isAuthenticated,
  modalActions,
  quoteR,
  walletCurrency
}: Props) => {
  const [pairAnimate, setPairAnimate] = useState(false)
  const [isDetailsExpanded, setDetailsExpanded] = useState(false)
  const { baseToken, counterToken, counterTokenAmount } = formValues || {}
  // TODO: useRemote hook
  const hasQuote = Remote.Success.is(quoteR)
  const hasQuoteError = Remote.Failure.is(quoteR)

  // event handlers
  const onViewSettings = () => {
    modalActions.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' })
  }
  const onFlipPairClick = () => {
    setPairAnimate(true)
    // delay form change to assist in smoother animation
    setTimeout(() => {
      formActions.initialize(DEX_SWAP_FORM, {
        baseToken: counterToken,
        baseTokenAmount: counterTokenAmount,
        counterToken: baseToken
      })
      formActions.change(DEX_SWAP_FORM, 'flipPairs', undefined)
      setPairAnimate(false)
    }, 400)
  }
  const onDetailsToggle = () => {
    setDetailsExpanded(!isDetailsExpanded)
  }

  return (
    <>
      <Header>
        <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon onClick={onViewSettings}>
          <IconSettings label='settings' color={PaletteColors['grey-400']} size='medium' />
        </SettingsIcon>
      </Header>
      <SwapWrapper>
        <SwapPair
          animate={pairAnimate}
          coin={formValues?.[DexSwapSideEnum.BASE]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.BASE}
        />
        <FlipPairButton onFlipPairClick={onFlipPairClick} />
        <SwapPair
          animate={pairAnimate}
          coin={formValues?.[DexSwapSideEnum.COUNTER]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.COUNTER}
        />
      </SwapWrapper>
      {hasQuote && (
        <BaseRateAndFees
          handleDetailsToggle={onDetailsToggle}
          swapDetailsOpen={isDetailsExpanded}
          walletCurrency={walletCurrency}
          quoteR={quoteR}
        />
      )}
      {isDetailsExpanded && (
        <QuoteDetails
          handleSettingsClick={onViewSettings}
          swapDetailsOpen={isDetailsExpanded}
          walletCurrency={walletCurrency}
          quoteR={quoteR}
        />
      )}
      <Button
        data-e2e='dexInitSwapBtn'
        disabled={!hasQuote}
        // disabled={!isAuthenticated || !hasQuote}
        fullwidth
        jumbo
        nature='primary'
        onClick={() => formActions.change(DEX_SWAP_FORM, 'step', DexSwapSteps.CONFIRM_SWAP)}
      >
        {isAuthenticated ? (
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        ) : (
          <FormattedMessage id='copy.login_to_swap' defaultMessage='Signin to Continue' />
        )}
      </Button>
      {hasQuoteError && (
        <ErrorText>
          <FormattedMessage
            id='dex.quote_failure'
            defaultMessage='Failed to obtain quote. Please refresh and try again.'
          />
        </ErrorText>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm,
  isAuthenticated: selectors.auth.isAuthenticated(state),
  quoteR: selectors.components.dex.getSwapQuote(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(EnterSwapDetails)
