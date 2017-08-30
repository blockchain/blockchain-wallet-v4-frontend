import React from 'react'
import styled from 'styled-components'
import { contains } from 'ramda'

import { DefaultColor, TextInput, Text } from 'blockchain-info-components'

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

const authorizedKeys = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+']
const handleKeyPress = event => { if (!contains(event.key, authorizedKeys)) { event.preventDefault() } }

const PhoneNumberBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <TextInput {...field.input} errorState={errorState} placeholder={field.placeholder} onKeyPress={handleKeyPress} />
      {field.meta.touched && field.meta.error && <Error size='13px' weight={300} color='mahogany'>{field.meta.error}</Error>}
    </Container>
  )
}

export default PhoneNumberBox
