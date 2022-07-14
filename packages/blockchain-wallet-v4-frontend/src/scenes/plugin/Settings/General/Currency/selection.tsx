import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { Flex } from 'components/Flex'

import List from './list'

const Selection = () => {
  return (
    <Flex flexDirection='column' alignItems='stretch' data-e2e='prefsLocalCurrencyInput'>
      <Field name='currency' component={List} />
    </Flex>
  )
}

export default reduxForm({ form: 'settingCurrency' })(Selection)
