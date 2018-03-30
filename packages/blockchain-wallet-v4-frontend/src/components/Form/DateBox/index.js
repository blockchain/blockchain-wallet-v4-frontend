import React from 'react'
import styled from 'styled-components'

import { Text, DateInput } from 'blockchain-info-components'

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
  top: -18px;
  right: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const DateBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <DateInput {...field.input} errorState={errorState} placeholder={field.placeholder} />
      {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
    </Container>
  )
}

export default DateBox
