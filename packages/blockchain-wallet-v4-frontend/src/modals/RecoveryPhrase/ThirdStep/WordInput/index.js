import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import { toLower, equals } from 'ramda'

import { Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 55px;

  & > :first-child {
    width: 100px;
  }
  & > :last-child {
    width: 350px;
  }
`
const validateWord = index => (value, allValues, props) => {
  return equals(toLower(value), toLower(props.mnemonic[index]))
    ? undefined
    : 'Invalid'
}

const WordInput = props => {
  const { index } = props

  return (
    <Container>
      <Text size='14px' weight={300}>
        <FormattedMessage
          id='modals.recoveryphrase.thirdstep.word'
          defaultMessage='Word {number} :'
          values={{ number: index + 1 }}
        />
      </Text>
      <Field
        name={`word${index}`}
        component={TextBox}
        validate={[required, validateWord(index)]}
      />
    </Container>
  )
}

WordInput.defaultProps = {
  index: PropTypes.number.isRequired,
  mnemonic: PropTypes.array.isRequired
}

export default WordInput
