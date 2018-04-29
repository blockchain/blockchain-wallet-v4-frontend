import React from 'react'
import styled from 'styled-components'

import { Text, TextInput } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 120px;
`
const Image = styled.img`
  height: 60px;
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  height: 50px;
  width: 100%;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -10px;
  right: 0;
  height: 15px;
`
const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const CaptchaBox = (field) => {
  const errorState = getErrorState(field.meta)

  return (
    <Wrapper>
      <Image src={field.captchaUrl} />
      <Container>
        <TextInput {...field.input} errorState={errorState} />
        {field.meta.touched && field.meta.error && <Error size='12px' weight={300} color='error'>{field.meta.error}</Error>}
      </Container>
    </Wrapper>
  )
}

export default CaptchaBox
