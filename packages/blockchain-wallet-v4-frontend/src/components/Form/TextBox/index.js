import React from 'react'
import styled from 'styled-components'

import { Icon, Text, TextInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: ${props => props.height};
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  height: 15px;
  top: ${props => (props.errorBottom ? props.height : '-20px')};
  right: ${({ sendVerificationInput }) =>
    sendVerificationInput ? '140px' : 0};
`

const WarningIcon = styled(Icon)`
  position: absolute;
  margin: auto 0;
  right: 16px;
  top: 14px;
`

const SendTextInput = styled(TextInput)`
  padding-right: 152px;
`

const getErrorState = ({ touched, invalid }) => {
  return touched && invalid ? 'invalid' : 'initial'
}

const TextBox = field => {
  const {
    autoComplete,
    autoFocus,
    borderRightNone,
    center,
    className,
    disabled,
    disableSpellcheck,
    errorBottom,
    height,
    icon,
    input,
    maxLength,
    meta,
    noLastPass,
    placeholder,
    sendVerificationInput
  } = field
  const { initial, active, touched, error, warning } = meta
  const errorState = getErrorState(meta)

  return (
    <Container className={className} height={height}>
      {sendVerificationInput ? (
        <SendTextInput
          {...input}
          active={active}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          borderRightNone={borderRightNone}
          center={center}
          data-e2e={field['data-e2e']}
          disabled={disabled}
          disableSpellcheck={disableSpellcheck}
          errorState={errorState}
          height={height}
          icon={icon}
          initial={initial}
          maxLength={maxLength}
          noLastPass={noLastPass}
          placeholder={placeholder}
        />
      ) : (
        <TextInput
          {...input}
          active={active}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          borderRightNone={borderRightNone}
          center={center}
          data-e2e={field['data-e2e']}
          disabled={disabled}
          disableSpellcheck={disableSpellcheck}
          errorState={errorState}
          height={height}
          icon={icon}
          initial={initial}
          maxLength={maxLength}
          noLastPass={noLastPass}
          placeholder={placeholder}
        />
      )}

      {touched && error && (
        <>
          <Error
            size='12px'
            weight={500}
            color='error'
            height={height}
            errorBottom={errorBottom}
            data-e2e='textBoxError'
            sendVerificationInput={sendVerificationInput}
          >
            {error}
          </Error>
          {noLastPass && (
            <WarningIcon name='alert-filled' color='red600' size='20px' />
          )}
        </>
      )}
      {touched && !error && warning && (
        <Error size='12px' weight={400} color='sent' errorBottom={errorBottom}>
          {warning}
        </Error>
      )}
    </Container>
  )
}

TextBox.defaultProps = {
  height: '48px'
}

export default TextBox
