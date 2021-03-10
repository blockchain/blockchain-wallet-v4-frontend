import React from 'react'
import locale from 'browser-locale'
import styled from 'styled-components'

import { DateInput, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: auto;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`
const getErrorState = meta => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const DateBox = field => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <DateInput {...field.input} errorState={errorState} locale={locale()} />
      {field.meta.touched && field.meta.error && (
        <Error size='12px' weight={500} color='error'>
          {field.meta.error}
        </Error>
      )}
    </Container>
  )
}

export default DateBox
