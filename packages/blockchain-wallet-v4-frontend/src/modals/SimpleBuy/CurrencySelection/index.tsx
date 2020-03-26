import { Button, Icon, IconButton, Text } from 'blockchain-info-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { FiatType } from 'core/types'
import { FlyoutWrapper, Row } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { LinkDispatchPropsType } from '../index'
import { RootState } from 'data/rootReducer'
import { SBCurrencySelectFormType } from 'data/types'
import { selectors } from 'data'
import { TextBox } from 'components/Form'
import Currencies, {
  FiatCurrenciesType
} from 'blockchain-wallet-v4/src/exchange/currencies'
import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'

type OwnProps = {
  handleClose: () => void
}

type LinkStatePropsType = {
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
  selectedCurrency: FiatType | null
  setSelectedCurrency: (string) => void
}) => {
  return (
    <CurrencyBox
      role='button'
      onClick={() => {
        props.setSelectedCurrency(props.cur.code)
      }}
    >
      <CurrencyText>
        <Text size='16px' color='grey800' weight={600}>
          {props.cur.displayName}
        </Text>
        <Text size='14px' color='grey800' weight={500}>
          {props.cur.code}
        </Text>
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
  const [selectedCurrency, setSelectedCurrency] = useState<FiatType | null>(
    null
  )
  const currencies = Object.keys(Currencies)
  const recommendedCurrencies = ['GBP', 'EUR', 'USD']

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    props.settingsActions.updateCurrency(selectedCurrency, true)
    props.simpleBuyActions.destroyCheckout()
    props.simpleBuyActions.setStep({
      step: 'ENTER_AMOUNT',
      fiatCurrency: selectedCurrency || 'USD'
    })
  }

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <FlyoutWrapper>
          <TopText color='grey900' size='20px' weight={600}>
            <Icon
              // @phil me trying to get this icon to behave like a button with type='submit'
              onClick={() => submit}
              cursor
              name='arrow-left'
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
              setSelectedCurrency={setSelectedCurrency}
              selectedCurrency={selectedCurrency}
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
                setSelectedCurrency={setSelectedCurrency}
                selectedCurrency={selectedCurrency}
              />
            )
          })}
        {/* <Button
          fullwidth
          height="48px"
          disabled={!selectedCurrency}
          nature="primary"
          data-e2e="currencySelectNext"
          size="16px"
          type="submit"
        >
          <FormattedMessage id="modals.simplebuy.next" defaultMessage="Next" />
        </Button> */}
      </Form>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  values: selectors.form.getFormValues('sbCurrencySelection')(state)
})

const enhance = compose(
  reduxForm<{}, Props>({ form: 'sbCurrencySelection' }),
  connect(mapStateToProps)
)

export default enhance(CurrencySelection) as React.ComponentType<Props>
