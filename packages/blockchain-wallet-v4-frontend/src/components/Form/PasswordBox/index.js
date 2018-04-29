import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, PasswordInput } from 'blockchain-info-components'
import PasswordScore from './PasswordScore'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: -20px;
  right: 0;
  padding: 5px 0px 5px 0px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const PasswordBox = (field) => {
  const errorState = getErrorState(field.meta)
  const scoreVisible = field.score ? field.input.value.length > 0 : false

  return (
    <Container>
      <PasswordInput {...field.input} controlledBorderColor={field.borderColor} errorState={errorState} />
      { scoreVisible ? <PasswordScore value={field.input.value} /> : <div /> }
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Container>
  )
}

PasswordBox.propTypes = {
  score: PropTypes.bool
}

PasswordBox.defaultProps = {
  score: false
}

export default PasswordBox
