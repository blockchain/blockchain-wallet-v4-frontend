import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconSettings } from '@blockchain-com/icons'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import Form from 'components/Form/Form'
import { actions, model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexSwapForm, DexSwapSideEnum, ModalName } from 'data/types'

import BaseRateAndFees from './components/BaseRateAndFees'
import FlipPairButton from './components/FlipPairButton'
import QuoteDetails from './components/QuoteDetails'
import SwapPair from './components/SwapPair'
import getData from './Dex.selectors'

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

const DexSwap = ({ formActions, formValues, modalActions }: Props) => {
  const [pairAnimate, setPairAnimate] = useState(false)
  const [isDetailsExpanded, setDetailsExpanded] = useState(false)
  const { baseToken, counterToken } = formValues || {}

  // event handlers
  const onViewSettings = () => {
    modalActions.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' })
  }
  const onFlipPairClick = () => {
    setPairAnimate(true)
    // delay form change to assist in smoother animation
    setTimeout(() => {
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
      {baseToken && counterToken && (
        <BaseRateAndFees
          swapDetailsOpen={isDetailsExpanded}
          handleDetailsToggle={onDetailsToggle}
        />
      )}
      {isDetailsExpanded && (
        <QuoteDetails handleSettingsClick={onViewSettings} swapDetailsOpen={isDetailsExpanded} />
      )}
      <Button data-e2e='swap' fullwidth jumbo nature='primary'>
        <FormattedMessage id='copy.swap' defaultMessage='Swap' />
      </Button>
    </Form>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm,
  rates: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & InjectedFormProps

const enhance = compose<React.ComponentType>(
  reduxForm({
    enableReinitialize: true,
    form: DEX_SWAP_FORM,
    initialValues: {
      [DexSwapSideEnum.BASE]: 'ETH', // TODO: change once we have multi-chain support
      [DexSwapSideEnum.COUNTER]: undefined
    }
  }),
  connector
)

export default enhance(DexSwap)
