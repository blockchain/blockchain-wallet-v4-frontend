import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { IconClose } from '@blockchain-com/icons'
import { AvailableSteps } from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send'
import Recents from 'blockchain-wallet-v4-frontend/src/scenes/plugin/Send/SelectAddress/Recents'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { model } from 'data'
import { getPayment } from 'data/components/sendEth/selectors'
import { required, validEthAddress } from 'services/forms'

import AddressInput from './AddressInput'

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
  .invalid-wallet-address {
    border: 1px solid ${(props) => props.theme.red400};
  }
`

const Title = styled(Text)`
  color: ${(props) => props.theme.white};
  font-size: 20px;
  line-height: 30px;
  font-weight: 700;
`

const Success: React.FC<Props> = (props) => {
  const { changeStep, coin, from, history } = props

  // changes and validates wallet address
  const changeAddress = () => {
    changeStep(AvailableSteps.FirstStep)
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
          component={AddressInput}
          dataE2e='sendEthAddressInput'
          id='sendEthAddressInput'
          exclude={from ? [from.label] : []}
          includeAll={false}
          includeExchangeAddress
          changeAddress={changeAddress}
          isCreatable
          isValidNewOption={() => false}
          includeCustodial={false}
          forceCustodialFirst
          name='to'
          noOptionsMessage={() => null}
          placeholder='Search, public address (0x), or ENS '
          validate={[required, validEthAddress]}
        />
      </InputWrapper>
      <Recents {...props} />
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  payment: getPayment(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  amount: string
  changeStep: (step: AvailableSteps) => void
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
