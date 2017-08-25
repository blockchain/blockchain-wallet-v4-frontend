import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'

import { SelectBox } from 'components/Form'
import { languagesSortedByName } from 'services/LanguageService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`
const Settings = (props) => {
  const { handleClick, language } = props
  return (
    <Wrapper>
      <Field name='language' component={SelectBox} elements={[{ group: '', items: languagesSortedByName.map(x => ({ text: x.name, value: x.language })) }]}
        input={{ onBlur: function () { }, onChange: handleClick, onFocus: function () { }, value: language }}
        label={language} />
    </Wrapper>
  )
}

Settings.propTypes = {
  language: PropTypes.string.isRequired
}

export default Settings
