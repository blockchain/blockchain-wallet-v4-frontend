import { compose } from 'redux'
import { connect } from 'react-redux'
import { FiatType } from 'core/types'
import { FlyoutWrapper, Title, Value } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { LinkDispatchPropsType } from '../index'
import { RootState } from 'data/rootReducer'
import { SBCurrencySelectFormType } from 'data/types'
import { selectors } from 'data'
import Currencies, {
  FiatCurrenciesType
} from 'blockchain-wallet-v4/src/exchange/currencies'
import React, { useState } from 'react'
import styled from 'styled-components'

type OwnProps = {
  handleClose: () => void
}

type LinkStatePropsType = {
  defaultSelectedCurrency: FiatType
  values?: SBCurrencySelectFormType
}

type Props = OwnProps & LinkDispatchPropsType

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`

const SubTitleText = styled(Text)`
  margin-top: 24px;
`

const CurrencyBox = styled.div`
  padding: 16px;
  cursor: pointer;
  border-top: 1px solid ${props => props.theme.grey000};
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const CurrencyText = styled.div`
  padding-left: 20px;
`

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  min-width: 20px;
  background-color: white;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 20px;
`

const Seperator = styled.div`
  width: 100%;
  height: 7px;
  background-color: ${props => props.theme.grey000};
`

const CurrencyBoxComponent = (props: {
  cur: FiatCurrenciesType[FiatType]
  onClick: (string) => void
  selectedCurrency: FiatType | null
}) => {
  return (
    <CurrencyBox role='button' onClick={props.onClick}>
      <CurrencyText>
        <Title>{props.cur.code}</Title>
        <Value>{props.cur.displayName}</Value>
      </CurrencyText>
      {props.selectedCurrency === props.cur.code ? (
        <Icon name='checkmark-in-circle-filled' color='green400' size='20px' />
      ) : (
        <Circle />
      )}
    </CurrencyBox>
  )
}

const CurrencySelection: React.FC<
  InjectedFormProps<{}, Props> & Props & LinkStatePropsType
> = props => {
  const [selectedCurrency] = useState<FiatType | null>(
    props.defaultSelectedCurrency
  )
  const currencies = Object.keys(Currencies)
  const recommendedCurrencies = ['GBP', 'EUR', 'USD']

  const handleSubmit = (currency: FiatType) => {
    props.settingsActions.updateCurrency(currency, true)
    props.simpleBuyActions.destroyCheckout()
    props.simpleBuyActions.setStep({
      step: 'ENTER_AMOUNT',
      fiatCurrency: currency || 'USD'
    })
  }

  return (
    <Wrapper>
      <Form>
        <FlyoutWrapper>
          <TopText color='grey900' size='20px' weight={600}>
            <Icon
              onClick={props.handleClose}
              cursor
              name='close'
              size='20px'
              color='grey600'
              style={{ marginRight: '24px' }}
            />
            <FormattedMessage
              id='modals.simplebuy.selectcurrency'
              defaultMessage='Select Your Currency'
            />
          </TopText>
          <SubTitleText color='grey800' weight={500}>
            <FormattedMessage
              id='modals.simplebuy.localcurrency'
              defaultMessage='Select the local currency for your wallet.'
            />
          </SubTitleText>
        </FlyoutWrapper>

        {recommendedCurrencies.map(currency => {
          const cur: FiatCurrenciesType[FiatType] = Currencies[currency]
          return (
            <CurrencyBoxComponent
              cur={cur}
              selectedCurrency={selectedCurrency}
              onClick={() => handleSubmit(cur.code as FiatType)}
            />
          )
        })}
        {!props.values && <Seperator />}
        {currencies
          .filter(currency => recommendedCurrencies.indexOf(currency) === -1)
          .map(currency => {
            const cur: FiatCurrenciesType[FiatType] = Currencies[currency]
            if (cur.base !== 'CENT') return
            return (
              <CurrencyBoxComponent
                cur={cur}
                selectedCurrency={selectedCurrency}
                onClick={() => handleSubmit(cur.code as FiatType)}
              />
            )
          })}
      </Form>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  values: selectors.form.getFormValues('sbCurrencySelection')(state),
  defaultSelectedCurrency: selectors.preferences.getSBFiatCurrency(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'sbCurrencySelection' }),
  connect(mapStateToProps)
)

export default enhance(CurrencySelection) as React.ComponentType<Props>
