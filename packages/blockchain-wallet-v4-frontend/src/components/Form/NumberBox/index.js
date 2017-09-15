import React from 'react'
import styled from 'styled-components'

import { Error } from 'components/Form'
import { NumberInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const NumberBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <NumberInput {...field.input} errorState={errorState} placeholder={field.placeholder} />
      {field.meta.touched && field.meta.error && <Error size='13px' weight={300} color='error'>{field.meta.error}</Error>}
    </Container>
  )
}

export default NumberBox
