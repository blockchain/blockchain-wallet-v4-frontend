import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text, TextInput } from 'blockchain-info-components'

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
  top: -18px;
  right: 0;
  height: 15px;
`
const RefreshLink = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 4px 0;
`
const RefreshIcon = styled(Icon)`
  margin-right: 2px;
  &:hover {
    cursor: pointer;
  }
`
const getErrorState = meta => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const CaptchaBox = field => {
  const { bgColor, borderNone, meta } = field
  const { invalid, touched } = meta
  const errorState = getErrorState(field.meta)

  return (
    <Wrapper>
      <Image src={field.captchaUrl} />
      <RefreshLink onClick={field.fetchNewCaptcha} size='11px' weight={400}>
        <RefreshIcon name='refresh' color='blue600' size='11px' weight={600} />
        <FormattedMessage
          id='scenes.reset2fa.thirdstep.newCaptcha'
          defaultMessage='Refresh'
          smaller
          uppercase
        />
      </RefreshLink>
      <Container>
        <TextInput
          bgColor={bgColor}
          borderNone={
            borderNone ? (invalid && touched ? null : borderNone) : null
          }
          {...field.input}
          errorState={errorState}
        />
        {field.meta.touched && field.meta.error && (
          <Error size='12px' weight={500} color='error'>
            {field.meta.error}
          </Error>
        )}
      </Container>
    </Wrapper>
  )
}

export default CaptchaBox
