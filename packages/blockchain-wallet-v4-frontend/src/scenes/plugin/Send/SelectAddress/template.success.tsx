import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconClose } from '@blockchain-com/icons'
import Recents from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/SelectAddress/Recents'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { isValidAddress } from '@core/utils/eth'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import TextBox from 'components/Form/TextBox'
import { actions, model } from 'data'
import { getPayment } from 'data/components/sendEth/selectors'
import { required, validEthAddressValue } from 'services/forms'

const Wrapper = styled(Flex)`
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  color: ${(props) => props.theme.white};

  #sendEthAddressInput {
    padding: 12px 16px;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
    caret-color: ${(props) => props.theme.blue600};
    color: ${(props) => props.theme.grey400};
    background-color: transparent;
  }
`

const IconWrapper = styled(Flex)`
  justify-content: flex-end;
  margin-bottom: 32px;
  color: ${(props) => props.theme.grey400};
`

const InputWrapper = styled(Flex)`
  color: ${(props) => props.theme.grey400};
  margin: 17px auto;
  width: 100%;

  & input {
    background-color: transparent;
  }

  & #sendEthAddressInput {
    top: 50px;
    left: 0;
    padding: 0;
    color: ${(props) => props.theme.red400};
  }
`

const Title = styled(Text)`
  color: ${(props) => props.theme.white};
  font-size: 20px;
  line-height: 30px;
  font-weight: 700;
`

const Success: React.FC<Props> = (props) => {
  const { coin, from, history, sendActions } = props
  const [address, setAddress] = useState<string>('')

  // Defines validation wallet address time delay in milliseconds
  const VALIDATION_TIME_DELAY = 500

  // changes and validates wallet address
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
    if (isValidAddress(e.target.value)) {
      sendActions.sendEthSetFirstStep()
    }
  }

  // Sets selected address from recents list
  const selectSearchedAddress = (addressValue: string) => {
    setAddress(addressValue)
    if (isValidAddress(addressValue)) {
      setTimeout(() => {
        sendActions.sendEthUpdateTo(addressValue)
        sendActions.sendEthSetFirstStep()
      }, VALIDATION_TIME_DELAY)
    }
  }

  const goBack = () => {
    history.goBack(-1)
  }

  return (
    <Wrapper>
      <IconWrapper>
        <IconClose height='24px' width='24px' cursor='pointer' onClick={goBack} />
      </IconWrapper>
      <Title>
        <FormattedMessage id='scenes.plugin.send.title' defaultMessage='Send to' />
      </Title>
      <InputWrapper>
        <Field
          coin={coin}
          onChange={handleChange}
          value={address}
          component={TextBox}
          dataE2e='sendEthAddressInput'
          id='sendEthAddressInput'
          exclude={from ? [from.label] : []}
          includeAll={false}
          includeExchangeAddress
          isCreatable
          isValidNewOption={() => false}
          includeCustodial={false}
          forceCustodialFirst
          name='to'
          noOptionsMessage={() => null}
          placeholder='Search, public address (0x), or ENS '
          validate={[required, validEthAddressValue]}
        />
      </InputWrapper>
      <Recents searchedAddress={address} selectSearchedAddress={selectSearchedAddress} {...props} />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  payment: getPayment(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendActions: bindActionCreators(actions.components.sendEth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  amount: string
  coin: string
  from: {
    label: string
    type: string
  }
  handleSubmit
  history: {
    goBack: (value: number) => void
  }
  step: number
  to
}

type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: model.components.sendEth.FORM
  }),
  connector
)

export default enhance(Success) as React.ComponentType<OwnProps>
