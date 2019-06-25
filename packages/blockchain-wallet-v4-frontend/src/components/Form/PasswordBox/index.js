import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { PasswordGauge, PasswordInput, Text } from 'blockchain-info-components'

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
const getErrorState = ({ touched, invalid }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const PasswordBox = field => {
  const {
    meta,
    input,
    showPasswordScore,
    disabled,
    borderColor,
    noLastPass,
    passwordScore
  } = field
  const { touched, error, active } = meta
  const errorState = getErrorState(meta)
  const scoreVisible = showPasswordScore ? input.value.length > 0 : false

  return (
    <Container>
      <PasswordInput
        {...input}
        disabled={disabled}
        active={active}
        controlledBorderColor={borderColor}
        errorState={errorState}
        data-e2e={field['data-e2e']}
        noLastPass={noLastPass}
      />
      {scoreVisible && <PasswordGauge score={passwordScore + 1} />}
      {touched && error && (
        <Error
          size='12px'
          weight={500}
          color='error'
          data-e2e='passwordsNotMatchError'
        >
          {error}
        </Error>
      )}
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
