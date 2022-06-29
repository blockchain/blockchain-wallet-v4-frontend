import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconSync } from '@blockchain-com/icons'
import styled from 'styled-components'

import { getRates } from '@core/redux/data/coins/selectors'
import { getCurrency } from '@core/redux/settings/selectors'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { selectors } from 'data'

const AmountWrapper = styled(Flex)`
  align-items: center;
  margin: 0 auto;
  padding: 20px 0;
  width: 100%;
  background: transparent;
`

const CurrencyWrapper = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 230px;
  height: 75px;
`

const TextWrapper = styled(Text)`
  font-size: ${(props) => props.size};
  line-height: ${(props) => props.lineHeight};
  font-weight: ${(props) => props.weight};
  color: ${(props) => props.color};
`

const Input = styled.input`
  max-width: 140px;
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  color: white;
  border: none;
  outline: none;
  background: transparent;
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 80px;
`

const Amount: React.FC<Props> = ({ coin, ...props }) => {
  const [coinValue, setCoinValue] = useState<string>('')
  const [fiatValue, setFiatValue] = useState<string>('')
  const [isCoinAndFiatReplaced, setIsCoinAndFiatReplaced] = useState<boolean>(false)

  const {
    rates: {
      data: { price }
    },
    userCurrency
  } = props

  const replaceCoinAndFiat = () => {
    setIsCoinAndFiatReplaced(!isCoinAndFiatReplaced)
  }

  const addMaximumBalance = () => {
    // TODO: add effective balance calculation.
  }

  const changeCoinValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoinValue(e.target.value)
    setFiatValue(String(Number(e.target.value) * price))
  }

  const changeFiatValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiatValue(e.target.value)
    setCoinValue(String(Number(e.target.value) / price))
  }

  useEffect(() => {
    setCoinValue('0.00')
    setFiatValue('0.00')
  }, [coin])

  const getInputSize = () => {
    let inputLength: number = coinValue.length
    if (isCoinAndFiatReplaced) {
      inputLength = fiatValue.length
    }
    return inputLength > 3 ? inputLength - 2 : 2
  }

  return (
    <AmountWrapper>
      <CurrencyWrapper>
        <Flex alignItems='center' justifyContent='center'>
          <Input
            value={isCoinAndFiatReplaced ? fiatValue : coinValue}
            onChange={isCoinAndFiatReplaced ? changeFiatValue : changeCoinValue}
            size={getInputSize()}
          />
          <TextWrapper size='16px' lineHeight='21px' weight={600} color='white'>
            {isCoinAndFiatReplaced ? userCurrency : coin}
          </TextWrapper>
        </Flex>
        <TextWrapper>
          {isCoinAndFiatReplaced ? `${coinValue} ${coin}` : `${fiatValue} ${userCurrency}`}
        </TextWrapper>
      </CurrencyWrapper>
      <Buttons>
        <IconSync color='grey400' height='32px' cursor='pointer' onClick={replaceCoinAndFiat} />
        <TextWrapper
          lineHeight='18px'
          size='12px'
          color='grey400'
          weight={500}
          cursor='pointer'
          onClick={addMaximumBalance}
        >
          <FormattedMessage id='plugin.send.max_button' defaultMessage='Max' />
        </TextWrapper>
      </Buttons>
    </AmountWrapper>
  )
}

const mapStateToProps = (state, props) => ({
  currency: getCurrency(state),
  rates: getRates(props.coin, state),
  userCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const connector = connect(mapStateToProps)

type OwnProps = {
  changeCoinValue: () => void
  coin: string
  coinValue: string
  fiatValue: string
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Amount)
