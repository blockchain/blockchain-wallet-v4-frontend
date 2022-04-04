import React, { useCallback, useState } from 'react'
import { Row } from 'blockchain-wallet-v4-frontend/src/modals/Swap/EnterAmount/Checkout'
import { Field } from 'redux-form'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { Icon, Text } from 'blockchain-info-components'
import { AmountTextBox } from 'components/Exchange'
import { formatTextAmount } from 'services/forms'

const AmountRow = styled(Row)<{ isError: boolean }>`
  position: relative;
  padding: 24px;
  justify-content: center;
  border: 0;
  > input {
    color: ${(props) => (props.isError ? 'red400' : 'textBlack')};
  }
`

const QuoteRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const AmountFieldInput: React.FC<Props> = ({
  amtError,
  coin,
  fix,
  name,
  onToggleFix,
  quote,
  showCounter,
  walletCurrency
}) => {
  const [fontRatio, setRatio] = useState(1)

  const normalizeAmount = (value, prevValue, allValues) => {
    if (Number.isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
    return formatTextAmount(value, allValues && allValues.fix === 'FIAT')
  }

  const resizeSymbol = (isFiat, inputNode, fontSizeRatio, fontSizeNumber) => {
    if (Number(fontSizeRatio) > 0) {
      setRatio(fontSizeRatio > 1 ? 1 : fontSizeRatio)
    }
    const amountRowNode = inputNode.closest('#amount-row')
    const currencyNode = isFiat
      ? amountRowNode.children[0]
      : amountRowNode.children[amountRowNode.children.length - 1]
    currencyNode.style.fontSize = `${fontSizeNumber * (fontRatio - 0.3)}px`
  }

  return (
    <div>
      <AmountRow id='amount-row' isError={!!amtError}>
        {fix === 'FIAT' && (
          <Text size='56px' color={amtError ? 'red400' : 'textBlack'} weight={500}>
            {Currencies[walletCurrency].units[walletCurrency].symbol}
          </Text>
        )}
        <Field
          data-e2e='sendAmountInput'
          name={name}
          // @ts-ignore
          component={AmountTextBox}
          normalize={normalizeAmount}
          // eslint-disable-next-line
          onUpdate={resizeSymbol.bind(null, fix === 'FIAT')}
          maxFontSize='56px'
          placeholder='0'
          // leave fiatActive always to avoid 50% width in HOC?
          fiatActive
          haveError={!!amtError}
          {...{
            autoFocus: true,
            hideError: true
          }}
        />
        {fix === 'CRYPTO' && (
          <Text size='56px' color={amtError ? 'red400' : 'textBlack'} weight={500}>
            {coin}
          </Text>
        )}
      </AmountRow>
      {showCounter ? (
        <QuoteRow>
          <div />
          <Text
            color={amtError ? 'red400' : 'grey600'}
            size='14px'
            weight={500}
            data-e2e='sendQuoteAmount'
          >
            {fix === 'FIAT' && coin} {quote} {fix === 'CRYPTO' && walletCurrency}
          </Text>
          <Icon
            color='blue600'
            cursor
            name='up-down-chevron'
            onClick={onToggleFix}
            role='button'
            size='24px'
            data-e2e='sendSwitchIcon'
          />
        </QuoteRow>
      ) : (
        <Icon
          color='blue600'
          cursor
          name='up-down-chevron'
          onClick={onToggleFix}
          role='button'
          size='24px'
          data-e2e='sendSwitchIcon'
        />
      )}
    </div>
  )
}

type Props = {
  amtError: string | false
  coin: string
  fix: 'FIAT' | 'CRYPTO'
  name: string
  onChange?: () => void
  onToggleFix: () => void
  quote: string
  showCounter?: boolean
  validate: (formValues: any, props: any) => { amount: string | boolean }
  validate_terms_of_service: 'validate_IS_PASSED_TO_reduxForm'
  walletCurrency: string
}

export default AmountFieldInput
