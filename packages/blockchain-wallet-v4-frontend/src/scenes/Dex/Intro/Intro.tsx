import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconArrowLeft, IconArrowRight } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { actions, model } from 'data'
import { DexSwapSteps } from 'data/components/dex/types'

const { DEX_INTRO_VIEWED_KEY, DEX_SWAP_FORM } = model.components.dex

const StepBubble = styled.div<{ active?: boolean }>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? props.theme.blue600 : props.theme.grey100)};
  margin: 0 5px;
  cursor: pointer;
`
const StepBubblesWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 64px 0;
  text-align: center;
`
const IntroStepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
`

// TODO: translations once copy is finalized
const DexIntro = ({ formActions }: Props) => (
  <>
    <Image width='100%' height='100px' name='nft-img-placeholder' />
    <IntroWrapper>
      <Text
        color='textBlack'
        lineHeight='32px'
        size='24px'
        weight={600}
        style={{ margin: '20px 0 8px' }}
      >
        Welcome to the DEX
      </Text>
      <Text color='grey600' lineHeight='24px' size='16px' weight={500}>
        A Decentralized Exchange (DEX) is a way to swap and exchange cryptocurrencies on-chain.
      </Text>
    </IntroWrapper>
    <IntroStepWrapper>
      <Icon label='step back' color='blue600' size='md'>
        <IconArrowLeft />
      </Icon>
      <StepBubblesWrapper>
        <StepBubble active />
        <StepBubble />
        <StepBubble />
      </StepBubblesWrapper>
      <Icon label='step forward' color='blue600' size='md'>
        <IconArrowRight />
      </Icon>
    </IntroStepWrapper>
    <Button
      data-e2e='startTrading'
      fullwidth
      jumbo
      nature='primary'
      onClick={() => {
        localStorage.setItem(DEX_INTRO_VIEWED_KEY, 'true')
        formActions.change(DEX_SWAP_FORM, 'step', DexSwapSteps.ENTER_DETAILS)
      }}
    >
      Start Trading
    </Button>
  </>
)

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(DexIntro)
