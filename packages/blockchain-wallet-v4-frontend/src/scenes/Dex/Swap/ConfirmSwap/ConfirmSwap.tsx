import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

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
const GoBackIcon = styled.div`
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

const ConfirmSwap = ({ formActions, formValues, modalActions, quoteR, walletCurrency }: Props) => {
  return (
    <>
      <Header>
        <div>
          <GoBackIcon
            onClick={() => formActions.change(DEX_SWAP_FORM, 'step', DexSwapSteps.ENTER_DETAILS)}
          >
            <Icon label='go back' color='grey400' size='md'>
              <IconArrowLeft />
            </Icon>
          </GoBackIcon>
          <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
            <FormattedMessage id='copy.confirm_swap' defaultMessage='Confirm Swap' />
          </Text>
        </div>
        <div>
          <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
            14 seconds left
          </Text>
        </div>
      </Header>
      <SwapWrapper>
        <SwapPair
          coin={formValues?.[DexSwapSideEnum.BASE]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.BASE}
          quoteLocked
        />
        <FlipPairButton quoteLocked />
        <SwapPair
          coin={formValues?.[DexSwapSideEnum.COUNTER]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.COUNTER}
          quoteLocked
        />
      </SwapWrapper>
      <BaseRateAndFees
        swapDetailsOpen
        walletCurrency={walletCurrency}
        quoteR={quoteR}
        quoteLocked
      />
      <QuoteDetails
        handleSettingsClick={() =>
          modalActions.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' })
        }
        swapDetailsOpen
        walletCurrency={walletCurrency}
        quoteR={quoteR}
      />
      <Button data-e2e='dexConfirmSwapBtn' fullwidth jumbo nature='primary'>
        <FormattedMessage id='copy.confirm_swap' defaultMessage='Confirm Swap' />
      </Button>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm,
  quoteR: selectors.components.dex.getSwapQuote(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ConfirmSwap)
