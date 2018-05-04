import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Field } from 'redux-form'
import { toLower, equals } from 'ramda'

import { Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  width: 100px;
  div:first-of-type {
    margin-bottom: 30x;
  }
`
const Error = styled.label`
  position: absolute;
  top: ${props => props.errorBottom ? '35px' : '60px'};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 300;
  color: ${props => props.theme['error']};
`

const validateWord = index => (value, allValues, props) => {
  return equals(toLower(value), toLower(props.recoveryPhrase[index])) ? undefined : <Error errorBottom={props.errorBottom}>Invalid</Error>
}

const languageHelper = (num) => {
  switch (num) {
    case 0: return `${num + 1}st`
    case 1: return `${num + 1}nd`
    case 2: return `${num + 1}rd`
    default: return `${num + 1}th`
  }
}

const WordInput = props => {
  const { index } = props
  return (
    <Container>
      <Text size='13px' weight={300}>
        {`${languageHelper(index)} word`}
      </Text>
      <Field name={`word${index}`} component={TextBox} validate={[required, validateWord(index)]} center />
    </Container>
  )
}

WordInput.defaultProps = {
  index: PropTypes.number.isRequired,
  phrase: PropTypes.array.isRequired
}

export default WordInput
