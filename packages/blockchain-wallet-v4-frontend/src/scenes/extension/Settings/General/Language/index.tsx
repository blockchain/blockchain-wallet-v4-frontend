import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { getLanguage } from '@core/redux/settings/selectors'
import { Text } from 'blockchain-info-components'
import { actions } from 'data'

import { SettingsHeading } from '../..'
import Selection from './selection'

const Language = (props) => {
  useEffect(() => {
    props.formActions.initialize('settingLanguage', {
      language: props.language
    })
  }, [])

  useEffect(() => {
    const { language, newLanguage } = props
    if (!isNil(newLanguage) && !equals(language, newLanguage)) {
      props.settingsActions.updateLanguage(newLanguage)
      props.preferencesActions.setLanguage(newLanguage, true)
    }
  })

  return (
    <div data-e2e='prefsWalletLanguage'>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.settings.preferences.walletlanguage.success.title'
          defaultMessage='Wallet Language'
        />
      </SettingsHeading>
      <Text>Select your language</Text>
      <Selection />
    </div>
  )
}

const mapStateToProps = (state) => ({
  language: getLanguage(state),
  newLanguage: formValueSelector('settingLanguage')(state, 'language')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Language)
