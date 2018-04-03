import React from 'react'
import styled from 'styled-components'

import { CheckBoxInput, Text } from 'blockchain-info-components'

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
const Error = styled(Text)`
  position: absolute;
  display: block;
  bottom: 5px;
  left: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const CheckBox = ({ children, ...field }) => {
  const errorState = getErrorState(field.meta)

  return (
    <Wrapper>
      <Container>
        <CheckBoxInput {...field.input} errorState={errorState}>
          { children }
        </CheckBoxInput>
      </Container>
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Wrapper>
  )
}

export default CheckBox
