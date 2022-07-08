import React from 'react'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import SelectBoxLanguages from 'components/Form/SelectBoxLanguages'

import List from './list'

export const SelectWrapper = styled.div`
  margin-top: 42px;
`

const Selection = () => {
  return (
    <div data-e2e='prefsWalletLanguageInput'>
      <SelectWrapper>
        <Field name='language' component={List} />
      </SelectWrapper>
    </div>
  )
}

export default reduxForm({ form: 'settingLanguage' })(Selection)
