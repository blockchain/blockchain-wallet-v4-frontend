import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: 55px;
`
const TextAreaInput = styled.textarea`
  &::-webkit-input-placeholder { color: ${props => props.theme.grayLighter} }
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: #555555;
  background-color: #FFFFFF;
  background-image: none;
  outline-width: 0;
  user-select: text;
  resize: none;
  border: 1px solid ${props => props.errorState === 'initial' ? '#CCCCCC' : props.errorState === 'invalid' ? '#990000' : '#006600'};
`
const TextAreaError = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const TextArea = (field) => {
  let errorState = !field.meta.touched ? 'initial' : (field.meta.invalid ? 'invalid' : 'valid')
  return (
    <TextAreaContainer>
      <TextAreaInput {...field.input} errorState={errorState} placeholder={field.placeholder} rows={field.rows} />
      {field.meta.touched && field.meta.error && <TextAreaError>{field.meta.error}</TextAreaError>}
    </TextAreaContainer>
  )
}

TextArea.defaultProps = {
  rows: 2
}

TextArea.propTypes = {
  rows: PropTypes.number,
  placeholder: PropTypes.string
}

export default TextArea
