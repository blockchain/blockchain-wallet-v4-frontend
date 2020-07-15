import { FlyoutWrapper } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '../index'
import { SBPairType } from 'core/types'
import CryptoItem from './CryptoItem'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const Currencies = styled.div`
  border-top: 1px solid ${props => props.theme.grey000};
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`

const SubTitleText = styled(Text)`
  margin-top: 0;
`

export type Props = OwnProps & SuccessStateType

const CryptoSelector: React.FC<InjectedFormProps<{}, Props> &
  Props> = props => {
  const handleSubmit = (pair: SBPairType) => {
    props.simpleBuyActions.destroyCheckout()
    props.simpleBuyActions.setStep({
      step: 'ENTER_AMOUNT',
      fiatCurrency: props.fiatCurrency,
      pair
    })
  }

  return (
    <Wrapper>
      <Form>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.simplebuy.cryptoselect'
              defaultMessage='Buy with Cash or Card'
            />
            <Icon
              cursor
              data-e2e='sbCloseModalIcon'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={props.handleClose}
            />
          </TopText>
          <SubTitleText color='grey600' weight={500}>
            <FormattedMessage
              id='modals.simplebuy.selectcrypto'
              defaultMessage='Select the crypto you want to buy.'
            />
          </SubTitleText>
        </FlyoutWrapper>
        <Currencies>
          {props.pairs.map((value, index) => (
            <CryptoItem
              key={index}
              value={value}
              supportedCoins={props.supportedCoins}
              onClick={() => handleSubmit(value as SBPairType)}
            />
          ))}
        </Currencies>
      </Form>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({
  form: 'sbCryptoSelection',
  destroyOnUnmount: false
})(CryptoSelector)
