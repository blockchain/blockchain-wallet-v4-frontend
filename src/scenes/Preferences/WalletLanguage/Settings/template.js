import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import { Form, SelectBox } from 'components/Form'
import { languages, languagesSortedByName, getLanguageName, convertCultureCodeToLanguage, convertLanguageToCultureCode } from 'services/LanguageService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`
const Settings = (props) => {
  const { toggled, handleToggle, handleClick, language, submitting, invalid } = props

  if (toggled) {
    return (
      <Wrapper>
        <Form>
          <SelectBox />
        </Form>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Field name='language' component={SelectBox} elements={[{group: '', items: languagesSortedByName.map(x => ({text: x.name, value: x.language}))}]}
          input={{onBlur: function () {}, onChange: function () {}, onFocus: function () {}, value: 1}}
          label={languages.find(lang => lang.language === language).name} />
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}

Settings.defaultProps = {
  toggled: false
}

export default Settings
