import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useDispatch, useSelector } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { getLanguage } from '@core/redux/settings/selectors'
import { Text } from 'blockchain-info-components'
import { actions } from 'data'

import { SettingsHeading } from '../..'
import Selection from './selection'

const Language = () => {
  const dispatch = useDispatch()
  const language = useSelector(getLanguage)
  const newLanguage = useSelector((state) =>
    formValueSelector('settingLanguage')(state, 'language')
  )
  useEffect(() => {
    const formActions = bindActionCreators(actions.form, dispatch)
    dispatch(
      formActions.initialize('settingLanguage', {
        language
      })
    )
  }, [])

  useEffect(() => {
    const settingsActions = bindActionCreators(actions.modules.settings, dispatch)
    const preferencesActions = bindActionCreators(actions.preferences, dispatch)
    if (!isNil(newLanguage) && !equals(language, newLanguage)) {
      dispatch(settingsActions.updateLanguage(newLanguage))
      dispatch(preferencesActions.setLanguage(newLanguage, true))
    }
  }, [language, newLanguage])

  return (
    <div data-e2e='prefsWalletLanguage'>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.settings.preferences.walletlanguage.success.title'
          defaultMessage='Wallet Language'
        />
      </SettingsHeading>
      <Text>
        <FormattedMessage
          id='scenes.settings.preferences.walletlanguage.success.subtitle'
          defaultMessage='Select your language'
        />
      </Text>
      <Selection />
    </div>
  )
}

export default Language
