import React from 'react'
import styled from 'styled-components'

const CaptchaBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  height: 130px;
`
const CaptchaImage = styled.img`
  height: 60px;
  margin: 5px 0;
`
const CaptchaBoxInput = styled.input.attrs({
  type: 'text'
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
const CaptchaBoxError = styled.label`
  position: absolute;
  top: -18px;
  right: 0;
  display: block;
  height: 15px;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const CaptchaBox = (field) => {
  const { touched, invalid, error } = field.meta
  const errorState = !touched ? 'initial' : (invalid ? 'invalid' : 'valid')

  return (
    <CaptchaBoxContainer>
      <CaptchaImage src={field.captchaUrl} />
      <CaptchaBoxInput {...field.input} errorState={errorState} />
      {touched && error && <CaptchaBoxError>{error}</CaptchaBoxError>}
    </CaptchaBoxContainer>
  )
}

export default CaptchaBox
