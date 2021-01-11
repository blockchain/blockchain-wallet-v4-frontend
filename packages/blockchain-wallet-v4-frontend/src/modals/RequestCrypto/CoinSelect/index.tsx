import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'

import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const SelectCoinWrapper = styled.div`
  margin: 24px 0;
  width: 40%;
`

class RequestCoinSelect extends React.PureComponent<InjectedFormProps & Props> {
  render () {
    const { coin, requestableCoins } = this.props

    return (
      <Wrapper>
        <Text size='24px' color='grey900' weight={600}>
          <FormattedMessage
            id='modals.requestcrypto.coinselect.title'
            defaultMessage='Receive Crypto'
          />
        </Text>
        <Text
          size='16px'
          color='grey600'
          weight={500}
          style={{ marginTop: '10px' }}
        >
          <FormattedMessage
            id='modals.requestcrypto.coinselect.subtitle'
            defaultMessage='Select and share your address or QR code to receive crypto from anyone around the world.'
          />
        </Text>
        <SelectCoinWrapper>
          <Field
            component={SelectBoxCoin}
            height='32px'
            name='coin'
            props={{
              additionalOptions: [{ text: 'All Wallets', value: 'ALL' }],
              limitTo: requestableCoins.map(coin => ({
                text: coin,
                value: coin
              }))
            }}
            type='request'
          />
        </SelectCoinWrapper>
        <button onClick={() => this.setState({ step: 'SHOW_ADDRESS' })}>
          Next
        </button>
        <p>{coin}</p>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: { coin: ownProps.coin || 'ALL' }
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector> & OwnProps

const enhance = compose<any>(
  connector,
  reduxForm({
    form: 'requestCrypto',
    enableReinitialize: true
  })
)

export default enhance(RequestCoinSelect)
