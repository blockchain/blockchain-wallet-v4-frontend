import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Exchange } from '@core'
import { actions } from 'data'

import Converter from './template'

const ConverterContainer = (props) => {
  const [coin, setCoin] = useState<string>('')
  const [fiat, setFiat] = useState<string>('')

  const { closeNotEnoughCoinsTooltip, coinTicker, currency, disabled, sendActions, value } = props

  // Convers fiat to coin and returns changed props
  const convertFiatToCoin = (unit, value, currency, rates) => ({
    coin: Exchange.convertFiatToCoin({ coin: unit, currency, maxPrecision: 8, rates, value }),
    coinCode: unit,
    fiat: value
  })

  // Converts coin to fiat and returns changed props
  const convertCoinToFiat = (unit, value, currency, rates) => ({
    coin: value,
    coinCode: unit,
    fiat: Exchange.convertCoinToFiat({ coin: unit, currency, isStandard: true, rates, value })
  })

  // Changes coin and sets converted fiat to state
  const changeCoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currency, rates, unit } = props
    const convertedProps = convertCoinToFiat(unit, e.target.value, currency, rates)
    setCoin(e.target.value)
    props.onChange(convertedProps)
    setFiat(convertedProps.fiat)
    props.closeNotEnoughCoinsTooltip()
  }

  // Changes fiat and sets converted coin to state
  const changeFiat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currency, rates, unit } = props
    setFiat(e.target.value)
    const convertedProps = convertFiatToCoin(unit, e.target.value, currency, rates)
    props.onChange(convertedProps)
    setCoin(convertedProps.coin)
    props.closeNotEnoughCoinsTooltip()
  }

  useEffect(() => {
    setCoin(value.coin)
    setFiat(value.fiat)
  }, [value])

  const addMaximumBalance = () => {
    sendActions.sendEthFirstStepMaximumAmountClicked(coinTicker)
    closeNotEnoughCoinsTooltip()
  }

  return (
    <Converter
      addMaximumBalance={addMaximumBalance}
      coin={coin}
      coinTicker={coinTicker}
      fiat={fiat}
      disabled={disabled}
      currency={currency}
      changeCoin={changeCoin}
      changeFiat={changeFiat}
      data-e2e={props['data-e2e']}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

export default connect(null, mapDispatchToProps)(ConverterContainer)
