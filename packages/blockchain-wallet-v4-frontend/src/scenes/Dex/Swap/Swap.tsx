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
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { DexSwapForm, DexSwapSideEnum, ModalName } from 'data/types'

import PairFlipButton from './components/PairFlipButton'
import SwapPair from './components/SwapPair'

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
  const [animate, setAnimate] = useState(false)

  const onFlipPairClick = () => {
    setAnimate(true)
    setTimeout(() => {
      // TODO: improve logic, move to better spot
      if (formValues) {
        const { baseToken, baseTokenAmount, counterToken, counterTokenAmount } = formValues

        // flip sides
        formActions.change('dexSwap', 'baseToken', counterToken)
        formActions.change('dexSwap', 'counterToken', baseToken)
        // flip values
        formActions.change('dexSwap', 'baseTokenAmount', counterTokenAmount)
        formActions.change('dexSwap', 'counterTokenAmount', baseTokenAmount)
      }
      setAnimate(false)
    }, 400)
  }

  return (
    <Form>
      <Header>
        <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon
          onClick={() => {
            modalActions.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' })
          }}
        >
          <Icon label='settings' color='grey400' size='md'>
            <IconSettings />
          </Icon>
        </SettingsIcon>
      </Header>
      <SwapWrapper>
        <SwapPair
          animate={animate}
          coin={formValues?.[DexSwapSideEnum.BASE]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.BASE}
        />
        {/* @ts-ignore */}
        <PairFlipButton animate={animate} onFlipPairClick={onFlipPairClick} />
        <SwapPair
          animate={animate}
          coin={formValues?.[DexSwapSideEnum.COUNTER]}
          formValues={formValues}
          swapSide={DexSwapSideEnum.COUNTER}
        />
      </SwapWrapper>
      <Button data-e2e='swap' disabled fullwidth jumbo nature='primary'>
        <FormattedMessage id='copy.swap' defaultMessage='Swap' />
      </Button>
    </Form>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('dexSwap')(state) as DexSwapForm
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & InjectedFormProps

const enhance = compose<React.ComponentType>(
  reduxForm({
    form: 'dexSwap',
    initialValues: {
      [DexSwapSideEnum.BASE]: undefined,
      [DexSwapSideEnum.COUNTER]: undefined
    }
  }),
  connector
)

export default enhance(DexSwap)
