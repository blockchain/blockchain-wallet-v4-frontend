import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconSettings } from '@blockchain-com/icons'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { Button, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexChain, DexSwapForm, DexSwapSideEnum, ModalName } from 'data/types'
import { useRemote } from 'hooks'

import BaseRateAndFees from './components/BaseRateAndFees'
import FlipPairButton from './components/FlipPairButton'
import QuoteDetails from './components/QuoteDetails'
import SwapPair from './components/SwapPair'

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
const LoginInfoText = styled(Text)`
  margin-top: 24px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
`
const ErrorText = styled(Text)`
  margin-top: 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.red600};
  text-align: center;
`

const DexSwap = ({
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
  const hasQuote = !Remote.NotAsked.is(quoteR)
  const hasQuoteError = Remote.Failure.is(quoteR)
  const { data: currentChain } = useRemote(selectors.components.dex.getCurrentChain)

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
    <Form>
      <Header>
        <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon onClick={onViewSettings}>
          <Icon label='settings' color='grey400' size='md'>
            <IconSettings />
          </Icon>
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
      {hasQuote && !hasQuoteError && (
        <BaseRateAndFees
          currentChain={currentChain}
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
      <Button data-e2e='swap' disabled={!isAuthenticated} fullwidth jumbo nature='primary'>
        <FormattedMessage id='copy.swap' defaultMessage='Swap' />
      </Button>
      {Remote.Failure.is(quoteR) && (
        <ErrorText>Failed to obtain quote. Please refresh and try again.</ErrorText>
      )}
      {!isAuthenticated && hasQuote && !hasQuoteError && (
        <LoginInfoText>
          <FormattedMessage
            id='copy.login_to_swap'
            defaultMessage='Signin to complete your Swap!'
          />
        </LoginInfoText>
      )}
    </Form>
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

export type Props = ConnectedProps<typeof connector> &
  InjectedFormProps & {
    currentChain: DexChain | undefined
  }

const enhance = compose<React.ComponentType>(
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    form: DEX_SWAP_FORM
  }),
  connector
)

export default enhance(DexSwap)
