import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxTheme } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
`
const Settings = (props) => {
  const { handleClick } = props

  return (
    <Wrapper>
      <Field name='theme' component={SelectBoxTheme} callback={handleClick} />
    </Wrapper>
  )
}

Settings.propTypes = {
  theme: PropTypes.string.isRequired
}

export default reduxForm({ form: 'settingTheme' })(Settings)
