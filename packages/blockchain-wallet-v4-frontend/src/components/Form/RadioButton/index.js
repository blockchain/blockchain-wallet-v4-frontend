import React from 'react'
import styled from 'styled-components'

import { RadioButtonInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
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

const RadioButton = ({ children, ...field }) => {
  const errorState = getErrorState(field.meta)

  return (
    <Wrapper>
      <Container>
        <RadioButtonInput {...field.input} props={{id: field.id}} value={field.value} errorState={errorState}>
          { children }
        </RadioButtonInput>
      </Container>
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Wrapper>
  )
}

export default RadioButton
