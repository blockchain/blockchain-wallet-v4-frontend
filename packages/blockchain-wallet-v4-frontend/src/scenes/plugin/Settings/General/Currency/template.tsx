import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'

import { SettingsHeading } from '../..'
import Selection from './selection'

const Currency = (props) => {
  const dispatch = useDispatch()
  const newCurrency = useSelector((state) =>
    formValueSelector('settingCurrency')(state, 'currency')
  )
  useEffect(() => {
    const formActions = bindActionCreators(actions.form, dispatch)
    dispatch(
      formActions.initialize('settingCurrency', {
        currency: props.currency
      })
    )
  }, [])

  useEffect(() => {
    const { currency } = props
    if (!isNil(newCurrency) && !equals(currency, newCurrency)) {
      const settingsActions = bindActionCreators(actions.modules.settings, dispatch)
      dispatch(settingsActions.updateCurrency(newCurrency, true))
    }
  }, [props.currency, props.newCurrency])
  return (
    <div>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.plugin.settings.currency.title'
          defaultMessage='Local currency'
        />
      </SettingsHeading>
      <Selection />
    </div>
  )
}

export default Currency
