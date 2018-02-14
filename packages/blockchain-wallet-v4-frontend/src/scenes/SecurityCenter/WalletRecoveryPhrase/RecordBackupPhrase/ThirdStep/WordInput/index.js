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
    margin-bottom: 5px;
  }
`
const validateWord = index => (value, allValues, props) => {
  return equals(toLower(value), toLower(props.phrase[index])) ? undefined : 'Invalid'
}

const languageHelper = (num) => {
  switch (num) {
    case 0: return '1st'
    case 1: return '2nd'
    case 2: return '3rd'
    case 3: return '4th'
    case 4: return '5th'
    case 5: return '6th'
    case 6: return '7th'
    case 7: return '8th'
    case 8: return '9th'
    case 9: return '10th'
    case 10: return '11th'
    case 11: return '12th'
  }
}

const WordInput = props => {
  const { index } = props

  return (
    <Container>
      <Text size='13px' weight={300}>
        {`${languageHelper(index)} word`}
      </Text>
      <Field name={`word${index}`} component={TextBox} validate={[required, validateWord(index)]} />
    </Container>
  )
}

WordInput.defaultProps = {
  index: PropTypes.number.isRequired,
  phrase: PropTypes.array.isRequired
}

export default WordInput
