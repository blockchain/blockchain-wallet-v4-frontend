import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { LinkDispatchPropsType } from '../index'
import { RootState } from 'data/rootReducer'
import { SBCurrencySelectFormType } from 'data/types'
import { selectors } from 'data'
import { TextBox } from 'components/Form'
import Currencies, {
  CurrenciesType
} from 'blockchain-wallet-v4/src/exchange/currencies'
import React from 'react'
import styled from 'styled-components'

type OwnProps = {
  handleClose: () => void
}

type LinkStatePropsType = {
  values?: SBCurrencySelectFormType
}

type Props = OwnProps & LinkDispatchPropsType

const TopText = styled(Text)`
  display: flex;
  width: 100%;
  align-items: center;
`

const SubTitleText = styled(Text)`
  margin: 24px 0;
`

const CurrencyBox = styled.div`
  padding: 24px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.grey100};
  margin-top: 16px;
`

const Seperator = styled.div`
  width: 100%;
  height: 2px;
  margin: 40px 0;
  background-color: ${props => props.theme.grey000};
`

const searchHasMatch = (
  cur: CurrenciesType[keyof CurrenciesType],
  values?: SBCurrencySelectFormType
) => {
  if (!values) return true
  if (values && !values.search) return true
  const { displayName, code } = cur

  if (displayName.toLowerCase().includes(values.search.toLowerCase()))
    return true
  if (code.toLowerCase().includes(values.search.toLowerCase())) return true

  return false
}

const CurrencySelection: React.FC<
  InjectedFormProps<{}, Props> & Props & LinkStatePropsType
> = props => {
  const currencies = Object.keys(Currencies)
  const recommendedCurrencies = ['GBP', 'EUR', 'USD']

  return (
    <FlyoutWrapper>
      <TopText color='grey900' size='20px' weight={600}>
        <Icon
          onClick={props.handleClose}
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
          defaultMessage='Select the local currency for your wallet'
        />
      </SubTitleText>
      <Form>
        <Field name='search' component={TextBox} />
        {recommendedCurrencies.map(currency => {
          const cur: CurrenciesType[keyof CurrenciesType] = Currencies[currency]

          if (!searchHasMatch(cur, props.values)) return
          return (
            <CurrencyBox
              onClick={() => props.settingsActions.updateCurrency(cur.code)}
            >
              <Text size='16px' color='grey800' weight={600}>
                {cur.displayName}
              </Text>
              <Text size='14px' color='grey800' weight={500}>
                {cur.code}
              </Text>
            </CurrencyBox>
          )
        })}
        {!props.values && <Seperator />}
        {currencies
          .filter(currency => recommendedCurrencies.indexOf(currency) === -1)
          .map(currency => {
            const cur: CurrenciesType[keyof CurrenciesType] =
              Currencies[currency]
            if (cur.base !== 'CENT') return
            if (!searchHasMatch(cur, props.values)) return

            return (
              <CurrencyBox
                onClick={() => props.settingsActions.updateCurrency(cur.code)}
              >
                <Text size='16px' color='grey800' weight={600}>
                  {cur.displayName}
                </Text>
                <Text size='14px' color='grey800' weight={500}>
                  {cur.code}
                </Text>
              </CurrencyBox>
            )
          })}
      </Form>
    </FlyoutWrapper>
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
