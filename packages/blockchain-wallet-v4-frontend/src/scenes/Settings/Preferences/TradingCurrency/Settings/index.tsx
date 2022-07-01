import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'

import { WalletFiatType } from '@core/types'
import SelectBox from 'components/Form/SelectBox'
import { SettingSelectBoxWrapper } from 'components/Setting'
import { actions } from 'data'
import { UserDataType } from 'data/types'
import { debounce } from 'utils/helpers'

const getCurrencyElements = (currencies: Array<WalletFiatType>) => [
  {
    group: '',
    items: currencies.map((currency: WalletFiatType) => ({
      text: currency,
      value: currency
    }))
  }
]

const SettingsContainer = (props: Props) => {
  const { newCurrency } = props

  useEffect(() => {
    props.formActions.initialize('settingTradingCurrency', {
      currency: props.userData.currencies.preferredFiatTradingCurrency
    })
  }, [])

  const updateCurrency = (currency: string) => {
    props.settingsActions.setTradingCurrency(currency)
  }

  return (
    <SettingSelectBoxWrapper data-e2e='prefsTradingCurrencyInput'>
      <Field
        name='currency'
        elements={getCurrencyElements(props.userData.currencies.usableFiatCurrencies)}
        component={SelectBox}
        label='Select State'
        defaultValue={newCurrency}
        onChange={debounce((event) => {
          updateCurrency(event)
        }, 200)}
      />
    </SettingSelectBoxWrapper>
  )
}

const mapStateToProps = (state) => ({
  newCurrency: formValueSelector('settingTradingCurrency')(state, 'currency')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  userData: UserDataType
}

export type Props = ConnectedProps<typeof connector> & OwnProps

const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: 'settingTradingCurrency'
  }),
  connector
)

export default enhance(SettingsContainer) as React.ComponentClass
