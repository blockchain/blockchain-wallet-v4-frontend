import React from 'react'
import styled from 'styled-components'

const CheckBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  height: 40px;
`
const CheckBoxInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const CheckBoxInput = styled.input.attrs({
  type: 'checkbox'
})`
  display: block;
  width: 20px;
  height: 20px;
`
const CheckBoxLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CheckBoxError = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const CheckBox = ({ ...field, children }) => {
  console.log(field, children)
  return (
    <CheckBoxContainer>
      <CheckBoxInputContainer>
        <CheckBoxInput {...field.input} />
        { children && (
          <CheckBoxLabelContainer>
            {children}
          </CheckBoxLabelContainer>
        )}
      </CheckBoxInputContainer>
      {field.meta.touched && field.meta.error && <CheckBoxError>{field.meta.error}</CheckBoxError>}
    </CheckBoxContainer>
  )
}

export default CheckBox
