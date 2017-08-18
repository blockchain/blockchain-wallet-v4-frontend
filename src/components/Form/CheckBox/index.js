import React from 'react'
import styled from 'styled-components'

import { CheckBoxInput } from 'blockchain-info-components'

const CheckBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  height: 40px;
`
const CheckBoxInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const CheckBoxLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CheckBoxError = styled.label`
  position: absolute;
  top: -18px;
  right: 0;
  display: block;
  height: 15px;
  font-size: 13px;
  font-weight: 300;
  color: #FF0000;
`

const CheckBox = ({ ...field, children }) => {
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
