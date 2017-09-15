import React from 'react'
import styled from 'styled-components'

import { CheckBoxInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 50px;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 35px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const CheckBox = ({ ...field, children }) => {
  const errorState = getErrorState(field.meta)

  return (
    <Wrapper>
      <Container>
        <CheckBoxInput {...field.input} errorState={errorState}>
          { children }
        </CheckBoxInput>
      </Container>
    </Wrapper>
  )
}

export default CheckBox
