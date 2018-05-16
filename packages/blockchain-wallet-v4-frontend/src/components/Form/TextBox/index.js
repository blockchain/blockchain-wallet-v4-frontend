import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => props.errorBottom ? '40px' : '-20px'};
  right: 0;
`
const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const TextBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <TextInput {...field.input} borderRightNone={field.borderRightNone} autoFocus={field.autoFocus} errorState={errorState} initial={field.meta.initial} placeholder={field.placeholder} center={field.center} />
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error' errorBottom={field.errorBottom}>{field.meta.error}</Error>}
    </Container>
  )
}

export default TextBox
