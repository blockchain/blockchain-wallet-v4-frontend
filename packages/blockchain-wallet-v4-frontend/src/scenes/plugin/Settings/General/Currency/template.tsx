import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { actions } from 'data'

import Selection from './selection'

const CurrencySettingsHeading = styled(Text)`
  font-size: 20px;
  margin: 34px 0 17px;
  color: ${(props) => props.theme.white};
`

const Currency = (props) => {
  const newCurrency = useSelector((state) =>
    formValueSelector('settingCurrency')(state, 'currency')
  )
  useEffect(() => {
    props.formActions.initialize('settingCurrency', {
      currency: props.currency
    })
  }, [])

  useEffect(() => {
    const { currency } = props
    if (!isNil(newCurrency) && !equals(currency, newCurrency)) {
      props.settingsActions.updateCurrency(newCurrency, true)
    }
  }, [props.currency, props.newCurrency])
  return (
    <div>
      <CurrencySettingsHeading>
        <FormattedMessage
          id='scenes.plugin.settings.currency.title'
          defaultMessage='Local currency'
        />
      </CurrencySettingsHeading>
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
