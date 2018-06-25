import React from 'react'
import styled from 'styled-components'

import { CheckBoxInput, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 25px;
`
const Error = styled(Text)`
  display: block;
  height: 15px;
`
const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const CheckBox = ({ children, ...field }) => {
  const errorState = getErrorState(field.meta)
  const checked = field.input.value || false

  return (
    <Wrapper>
      <Container>
        <CheckBoxInput {...field.input} disabled={field.disabled} checked={checked} errorState={errorState}>
          { children }
        </CheckBoxInput>
      </Container>
      {field.meta.touched && field.meta.error && !field.hideErrors && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Wrapper>
  )
}

export default CheckBox
