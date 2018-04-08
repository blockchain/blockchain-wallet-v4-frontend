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
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const PasswordBox = (field) => {
  const errorState = getErrorState(field.meta)
  const scoreVisible = field.score ? field.input.value.length > 0 : false

  return (
    <Container>
      <PasswordInput {...field.input} errorState={errorState} />
      { scoreVisible ? <PasswordScore value={field.input.value} /> : <div /> }
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Container>
  )
}

PasswordBox.propTypes = {
  score: PropTypes.number
}

PasswordBox.defaultProps = {
  score: false
}

export default PasswordBox
