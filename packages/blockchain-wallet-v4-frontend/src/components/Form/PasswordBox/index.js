import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { PasswordInput, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const PasswordContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: -20px;
  right: 0;
`

const getErrorState = ({ invalid, touched }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const PasswordBox = (field) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)
  const {
    autoFocus,
    borderColor,
    disabled,
    input,
    meta,
    noLastPass,
    placeholder,
    showVisibilityToggle
  } = field
  const { active, error, touched } = meta
  const errorState = getErrorState(meta)

  return (
    <Container>
      <PasswordContainer>
        <PasswordInput
          {...input}
          active={active}
          autoFocus={autoFocus}
          controlledBorderColor={borderColor}
          data-e2e={field['data-e2e']}
          disabled={disabled}
          errorState={errorState}
          isPasswordVisible={isPasswordVisible}
          noLastPass={noLastPass}
          placeholder={placeholder}
          setPasswordVisible={setPasswordVisible}
          showVisibilityToggle={showVisibilityToggle}
        />
      </PasswordContainer>
      {touched && error && (
        <Error size='12px' weight={500} color='error' data-e2e='passwordsNotMatchError'>
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
