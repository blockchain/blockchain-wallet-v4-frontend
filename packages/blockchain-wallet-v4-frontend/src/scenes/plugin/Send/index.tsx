import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import SelectAddress from './SelectAddress'

// defines available steps to send amount
export enum AvailableSteps {
  SelectAddress,
  FirstStep,
  SecondStep
}

// TODO: finalize with erc20 tokens list
export enum AvailableCoins {
  ETH = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT'
}

const Send = (props) => {
  const { step } = props
  const [coin, setCoin] = useState<string>(AvailableCoins.ETH)

  const { sendActions } = props
  // indicates if recents wallets are shown
  const isRecentsWalletsShown: boolean = step === AvailableSteps.SelectAddress
  // indicates if first and second steps are shown
  const isFirstStepShown: boolean = step === AvailableSteps.FirstStep
  const isSecondStepShown: boolean = step === AvailableSteps.SecondStep

  useEffect(() => {
    sendActions.initialized(coin)
  }, [coin])

  // changes coin
  const changeCoin = (coin: string) => {
    setCoin(coin)
  }

  return (
    <>
      {isRecentsWalletsShown && <SelectAddress step={step} coin={coin} {...props} />}
      {isFirstStepShown && <FirstStep changeCoin={changeCoin} coin={coin} {...props} />}
      {isSecondStepShown && <SecondStep coin={coin} {...props} />}
    </>
  )
}

const mapStateToProps = (state) => ({
  step: selectors.components.sendEth.getStep(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Send)
