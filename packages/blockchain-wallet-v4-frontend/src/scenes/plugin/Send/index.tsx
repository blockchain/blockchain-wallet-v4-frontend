import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

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
  const [step, setStep] = useState<number>(AvailableSteps.SelectAddress)
  const [coin, setCoin] = useState<string>(AvailableCoins.ETH)

  const { sendActions } = props
  // indicates if recents wallets are shown
  const isRecentsWalletsShown: boolean = step === AvailableSteps.SelectAddress
  // indicates if first and second steps are shown
  const isFirstStepShown: boolean = step === AvailableSteps.FirstStep
  const isSecondStepShown: boolean = step === AvailableSteps.SecondStep

  // changes step
  const changeStep = (step: AvailableSteps) => {
    setStep(step)
  }

  useEffect(() => {
    sendActions.initialized(coin)
  }, [coin])

  // changes coin
  const changeCoin = (coin: string) => {
    setCoin(coin)
  }

  return (
    <>
      {isRecentsWalletsShown && (
        <SelectAddress changeStep={changeStep} step={step} coin={coin} {...props} />
      )}
      {isFirstStepShown && (
        <FirstStep changeStep={changeStep} changeCoin={changeCoin} coin={coin} {...props} />
      )}
      {isSecondStepShown && <SecondStep changeStep={changeStep} coin={coin} {...props} />}
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(null, mapDispatchToProps)(Send)
