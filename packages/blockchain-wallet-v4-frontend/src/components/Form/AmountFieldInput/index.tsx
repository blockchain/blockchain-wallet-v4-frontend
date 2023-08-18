import React, { FocusEventHandler, useCallback, useRef, useState } from 'react'
import { Row } from 'blockchain-wallet-v4-frontend/src/modals/Swap/EnterAmount/Checkout'
import { Field } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import { formatTextAmount } from 'services/forms'

const AmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`

const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 12px;
  justify-content: center;
  align-items: center;
  border: 0;
  width: 100%;

  & #amount-row {
    max-width: 90%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;

    & > input {
      color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
    }
  }
`

const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const AmountFieldInput: React.FC<Props> = ({
  amountError,
  coin,
  fiatCurrency,
  fix,
  name,
  onChange,
  onToggleFix,
  quote,
  showCounter,
  showToggle,
  ...rest
}) => {
  const [fontRatio, setRatio] = useState(1)
  const initialFocus = useRef<boolean>(false)

  const normalizeAmount = (value, prevValue, allValues) => {
    if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
    return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setRatio(Math.min(fontSizeRatio, 1))
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 2]
    currencyNode.style.fontSize = `${fontSizeNumber * (fontRatio - 0.3)}px`
  }

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (initialFocus.current === false && event.target.value === '0') {
        event.target.value = ''
      }

      initialFocus.current = true
    },
    [initialFocus]
  )

  return (
    <AmountContainer>
      <AmountRow isError={!!amountError}>
        <div id='amount-row'>
          {fix === 'FIAT' && (
            <Text size='56px' color={amountError ? 'red400' : 'textBlack'} weight={500}>
              {Currencies[fiatCurrency].units[fiatCurrency].symbol}
            </Text>
          )}
          <Field
            autoComplete='off'
            data-e2e={rest['data-e2e']}
            name={name}
            // @ts-ignore
            component={AmountTextBox}
            normalize={normalizeAmount}
            onChange={onChange}
            onFocus={handleOnFocus}
            // eslint-disable-next-line
            onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
            maxFontSize='56px'
            placeholder='0'
            // leave fiatActive always to avoid 50% width in HOC?
            fiatActive
            haveError={!!amountError}
            autoFocus
            hideError
          />

          {fix === 'CRYPTO' && (
            <Text size='56px' color={amountError ? 'red400' : 'textBlack'} weight={500}>
              {coin}
            </Text>
          )}
          {showToggle ? (
            <Icon
              color='blue600'
              cursor
              style={{ marginLeft: '12px' }}
              name='up-down-chevron'
              onClick={onToggleFix}
              role='button'
              size='24px'
              data-e2e='sendSwitchIcon'
            />
          ) : null}
        </div>
      </AmountRow>
      <QuoteRow>
        {showCounter ? (
          <>
            <Text
              color={amountError ? 'red400' : 'grey600'}
              size='14px'
              weight={500}
              data-e2e='sendQuoteAmount'
            >
              {fix === 'FIAT' && coin} {quote} {fix === 'CRYPTO' && fiatCurrency}
            </Text>
          </>
        ) : null}
      </QuoteRow>
    </AmountContainer>
  )
}

export type Props = {
  amountError: string | boolean
  'data-e2e': string
  fiatCurrency: string
  fix: 'FIAT' | 'CRYPTO'
  name: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & (
  | // FIAT <=> COIN TOGGLE
  {
      coin: string
      fiatCurrency: string
      onToggleFix: () => void
      showToggle: true
    }
  // ONLY FIAT
  | {
      coin?: never
      fiatCurrency: string
      onToggleFix?: never
      showToggle: false
    }
) &
  (
    | {
        quote: string
        showCounter: true
      }
    | { quote?: never; showCounter: false }
  )

export default AmountFieldInput
