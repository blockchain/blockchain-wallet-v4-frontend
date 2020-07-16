import { FlyoutWrapper } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '../index'
import { SBFormPaymentMethod } from 'data/components/simpleBuy/types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 7px;
`
const PaymentsWrapper = styled.div`
  border-top: 1px solid ${props => props.theme.grey000};
`

// const IconContainer = styled.div`
//   width: 38px;
//   height: 32px;
//   border-radius: 16px;
//   background-color: ${props => props.theme.blue000};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

export type Props = OwnProps & SuccessStateType

class Payments extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  getType = (value: SBFormPaymentMethod) => {
    switch (value.type) {
      case 'BANK_ACCOUNT':
        return 'Bank Wire Transfer'
      case 'PAYMENT_CARD':
        return 'Add a Credit or Debit Card'
      case 'USER_CARD':
        return value && value.card
          ? value.card.label
            ? value.card.label
            : value.card.type
          : 'Add a Credit or Debit Card'
      case 'FUNDS':
        return ''
    }
  }

  //   getIcon = (value: SBCheckoutFormValuesType): ReactElement => {
  //     switch (value.type) {
  //       case 'BANK_ACCOUNT':
  //         return (
  //           <IconContainer>
  //             <Icon size='18px' color='blue600' name='bank-filled' />
  //           </IconContainer>
  //         )
  //       case 'PAYMENT_CARD':
  //         return (
  //           <IconContainer>
  //             <Icon size='16px' color='blue600' name='credit-card-sb' />
  //           </IconContainer>
  //         )
  //       case 'USER_CARD':
  //         let cardType = CARD_TYPES.find(
  //           card => card.type === (value.card ? value.card.type : '')
  //         )
  //         return (
  //           <img
  //             height='18px'
  //             width='auto'
  //             src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
  //           />
  //         )
  //       case 'FUNDS':
  //         return <></>
  //     }
  //   }

  renderElements = () => {
    const availableCards = this.props.cards.filter(
      card => card.state === 'ACTIVE'
    )
    const defaultCardMethod = this.props.paymentMethods.methods.find(
      m => m.type === 'PAYMENT_CARD'
    )
    const cardMethods = availableCards.map(card => ({
      text: card.card
        ? card.card.label
          ? card.card.label
          : card.card.type
        : 'Credit or Debit Card',
      value: {
        ...card,
        type: 'USER_CARD',
        limits: defaultCardMethod
          ? defaultCardMethod.limits
          : { min: '1000', max: '500000' }
      }
    }))
    const defaultMethods = this.props.paymentMethods.methods.map(value => ({
      text: this.getType(value),
      value
    }))
    // TODO: remove when adding FUNDS type
    const defaultMethodsNoFunds = defaultMethods.filter(
      method => method.value.type !== 'FUNDS'
    )

    const itemsss = {
      group: '',
      items: [...cardMethods, ...defaultMethodsNoFunds]
    }
    // eslint-disable-next-line
    console.log('itemsss', itemsss)

    // eslint-disable-next-line
    console.log('availableCards', availableCards)
    // eslint-disable-next-line
    console.log('defaultMethodsNoFunds', defaultMethodsNoFunds)

    // return [
    //   {
    //     group: '',
    //     items: [...cardMethods, ...defaultMethodsNoFunds]
    //   }
    // ]
  }

  render () {
    return (
      <Wrapper>
        <Form>
          <FlyoutWrapper>
            <TopText color='grey800' size='20px' weight={600}>
              <Icon
                cursor
                name='arrow-left'
                size='20px'
                color='grey600'
                style={{ marginRight: '24px' }}
                role='button'
                onClick={() =>
                  this.props.simpleBuyActions.setStep({
                    step: 'ENTER_AMOUNT',
                    fiatCurrency: this.props.fiatCurrency || 'USD',
                    pair: this.props.pair
                  })
                }
              />
              <div style={{ marginLeft: '28px' }}>
                <FormattedMessage
                  id='modals.simplebuy.paymentmethods'
                  defaultMessage='Payment Methods'
                />
              </div>
            </TopText>
          </FlyoutWrapper>
          {this.renderElements()}

          <PaymentsWrapper>
            <div>
              <FormattedMessage
                id='modals.simplebuy.depositcash_description'
                defaultMessage='Send funds directly from your bank to your Blockchain.com Wallet. Once we receive the manual transfer, use that cash to buy crypto.'
              />
            </div>
          </PaymentsWrapper>
        </Form>
      </Wrapper>
    )
  }
}

export default reduxForm<{}, Props>({
  form: 'sbPaymentMethods',
  destroyOnUnmount: false
})(Payments)
