import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'

import { SettingsHeading } from '../..'
import Selection from './selection'

const Updated = styled(Text)`
  max-width: 280px;
  color: #98a1b2;
`

const Currency = (props) => {
  useEffect(() => {
    props.formActions.initialize('settingCurrency', {
      currency: props.currency
    })
  }, [])

  useEffect(() => {
    const { currency, newCurrency } = props
    if (!isNil(newCurrency) && !equals(currency, newCurrency)) {
      props.settingsActions.updateCurrency(newCurrency)
    }
  })
  return (
    <div>
      <SettingsHeading>
        <FormattedMessage
          id='scenes.plugin.settings.currency.title'
          defaultMessage='Local currency'
        />
      </SettingsHeading>
      <Updated>Updated Tue May 31 2022 11:44:04 GMT+0100 (British Summer Time)</Updated>
      <Selection />
    </div>
  )
}

const mapStateToProps = (state) => ({
  newCurrency: formValueSelector('settingCurrency')(state, 'currency')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Currency)
