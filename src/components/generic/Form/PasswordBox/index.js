import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import PasswordScore from './PasswordScore'

const PasswordBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-height: 60px;
`
const PasswordBoxInput = styled.input.attrs({
  type: 'password'
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: #555555;
  background-color: #FFFFFF;
  background-image: none;
  outline-width: 0;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};
`
const PasswordBoxError = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const PasswordBox = (field) => {
  let errorState = !field.meta.touched ? 'initial' : (field.meta.invalid ? 'invalid' : 'valid')
  let scoreVisible = field.score ? field.input.value.length > 0 : false
  return (
    <PasswordBoxContainer>
      <PasswordBoxInput {...field.input} errorState={errorState} />
      { scoreVisible ? <PasswordScore value={field.input.value} /> : <div /> }
      {field.meta.touched && field.meta.error && <PasswordBoxError>{field.meta.error}</PasswordBoxError>}
    </PasswordBoxContainer>
  )
}

PasswordBox.defaultProps = {
  score: false
}

PasswordBox.PropTypes = {
  score: PropTypes.number
}

export default PasswordBox
