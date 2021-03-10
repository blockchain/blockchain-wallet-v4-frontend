import React from 'react'
import styled from 'styled-components'

import { Icon, NumberInput, Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 48px;
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: ${props => (props.errorBottom ? 'initial' : '-18px')};
  left: ${props => (props.errorLeft ? '0' : 'initial')};
  bottom: ${props => (props.errorBottom ? '-18px' : 'initial')};
  right: 0;
  height: 15px;
`
const CustomIcon = styled(Icon)`
  position: absolute;
  right: 12px;
  top: 14px;
`
const getErrorState = meta => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}

const NumberBox = field => {
  const errorState = getErrorState(field.meta)

  return (
    <Container className={field.className}>
      <NumberInput
        {...field.input}
        errorState={errorState}
        autoFocus={field.autoFocus}
        placeholder={field.placeholder}
        disabled={field.disabled}
        data-e2e={field['data-e2e']}
      />
      {field.meta.touched && field.meta.error && field.errorIcon && (
        <CustomIcon name={field.errorIcon} color='error' size='18px' />
      )}
      {field.meta.touched && field.meta.error && (
        <Error
          size='12px'
          weight={500}
          color='error'
          {...field}
          data-e2e={`${field['data-e2e']}Error`}
        >
          {field.meta.error}
        </Error>
      )}
      {field.meta.touched && !field.meta.error && field.meta.warning && (
        <Error size='12px' weight={400} color='sent' {...field}>
          {field.meta.warning}
        </Error>
      )}
    </Container>
  )
}

export default NumberBox
