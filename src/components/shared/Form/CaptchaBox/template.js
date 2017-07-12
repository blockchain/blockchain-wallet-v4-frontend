import React from 'react'
import styled from 'styled-components'

const CaptchaBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
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
  display: block;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const CaptchaBox = (field) => {
  let errorState = !field.meta.touched ? 'initial' : (field.meta.invalid ? 'invalid' : 'valid')
  return (
    <CaptchaBoxContainer>
      <CaptchaImage src={field.captchaUrl} />
      <CaptchaBoxInput {...field.input} errorState={errorState} />
      {field.meta.touched && field.meta.error && <CaptchaBoxError>{field.meta.error}</CaptchaBoxError>}
    </CaptchaBoxContainer>
  )
}

export default CaptchaBox
