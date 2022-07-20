import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconSync } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

// @ts-ignore
import { Button, Text, TextInput } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { actions, model } from 'data'

const FiatConverterInput = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  outline: none;
  border: none;

  #pluginAmountConveter {
    max-width: 252px;
    background-color: transparent;
    border: none;
    padding: 0;
    color: white;
    font-size: 24px;
    line-height: 32px;
    caret-color: ${(props) => props.theme.blue600};

    &:focus {
      border: none;
      &::placeholder {
        color: ${(props) => props.theme.grey600};
      }
    }

    &::placeholder {
      color: white;
      font-size: 24px;
      line-height: 32px;
    }
  }
`

const Label = styled(Text)`
  max-width: 252px;
  word-break: break-word;
  font-size: 14px;
  line-height: 21px;
  color: ${(props) => props.theme.grey400};
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
`

const MaxButton = styled(Button)`
  background: transparent;
  border: none;
  outline: none;

  &:hover {
    background: transparent;
  }
`

const IconWrapper = styled.div`
  color: ${(props) => props.theme.grey400};
  cursor: pointer;
`

const Converter: React.FC<Props> = (props) => {
  const { addMaximumBalance, changeCoin, changeFiat, coin, coinTicker, currency, disabled, fiat } =
    props

  const [isCoinReplacedToFiat, setIsCoinReplacedToFiat] = useState<boolean>(true)

  // Changes currency fromt coin to fiat and back
  const changeCurrency = () => {
    setIsCoinReplacedToFiat(!isCoinReplacedToFiat)
  }

  const mainInputValue = isCoinReplacedToFiat ? coin : fiat

  return (
    <FiatConverterInput>
      <Flex flexDirection='column'>
        <Container>
          <TextInput
            id='pluginAmountConveter'
            value={mainInputValue}
            disabled={disabled}
            placeholder={`0.00 ${isCoinReplacedToFiat ? coinTicker : currency}`}
            onChange={isCoinReplacedToFiat ? changeCoin : changeFiat}
            data-e2e={`${props['data-e2e']}FiatAmount`}
            noLastPass
          />
        </Container>
        <Container>
          <Label>
            {isCoinReplacedToFiat ? fiat || '0.00' : coin || '0.00'}{' '}
            {isCoinReplacedToFiat ? currency : coinTicker}
          </Label>
        </Container>
      </Flex>
      <Buttons>
        <IconWrapper onClick={changeCurrency}>
          <IconSync height='32px' />
        </IconWrapper>
        <MaxButton
          width='40px'
          height='32px'
          data-e2e='plugin-send-max-button'
          onClick={addMaximumBalance}
        >
          <Text lineHeight='18px' size='12px' color='grey400' weight={500}>
            <FormattedMessage id='plugin.send.max_button' defaultMessage='Max' />
          </Text>
        </MaxButton>
      </Buttons>
    </FiatConverterInput>
  )
}

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type ConverterProps = {
  addMaximumBalance: () => void
  changeCoin: (e: React.ChangeEvent<HTMLInputElement>) => void
  changeFiat: (e: React.ChangeEvent<HTMLInputElement>) => void
  coin: string
  coinTicker: string
  currency: string
  disabled: boolean
  fiat: string
}

type Props = ConverterProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm({
    destroyOnUnmount: false,
    form: model.components.sendEth.FORM
  }),
  connector
)

export default enhance(Converter) as React.FC<ConverterProps>
