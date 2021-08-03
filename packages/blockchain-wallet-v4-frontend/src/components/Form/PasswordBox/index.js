import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, PasswordGauge, PasswordInput, Text } from 'blockchain-info-components'

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

const WarningIcon = styled(Icon)`
  position: absolute;
  margin: auto 0;
  right: 16px;
  top: 14px;
`

const getErrorState = ({ invalid, touched }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const PasswordBox = (field) => {
  const {
    autoFocus,
    borderColor,
    disabled,
    input,
    meta,
    noLastPass,
    passwordScore,
    showPasswordScore
  } = field
  const { active, error, touched } = meta
  const errorState = getErrorState(meta)
  const scoreVisible = showPasswordScore ? input.value.length > 0 : false

  return (
    <Container>
      <PasswordContainer>
        <PasswordInput
          {...input}
          autoFocus={autoFocus}
          disabled={disabled}
          active={active}
          controlledBorderColor={borderColor}
          errorState={errorState}
          data-e2e={field['data-e2e']}
          noLastPass={noLastPass}
        />
        {scoreVisible && <PasswordGauge score={passwordScore + 1} />}
      </PasswordContainer>
      {touched && error && (
        <>
          <Error size='12px' weight={500} color='error' data-e2e='passwordsNotMatchError'>
            {error}
          </Error>
          {noLastPass && <WarningIcon name='alert-filled' color='red600' size='20px' />}
        </>
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
