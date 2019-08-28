import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, TextAreaInput } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
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

const TextArea = field => {
  const errorState = getErrorState(field.meta)

  return (
    <Container>
      <TextAreaInput
        {...field.input}
        errorState={errorState}
        placeholder={field.placeholder}
        rows={field.rows}
        data-e2e={field['data-e2e']}
      />
      {field.meta.touched && field.meta.error && (
        <Error size='12px' weight={400} color='error'>
          {field.meta.error}
        </Error>
      )}
    </Container>
  )
}

TextArea.defaultProps = {
  rows: 3
}

TextArea.propTypes = {
  rows: PropTypes.number
}

export default TextArea
