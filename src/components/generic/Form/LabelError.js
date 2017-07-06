import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const BaseLabelError = styled.label`
  font-size: 0.8rem;
  font-weight: 200;
  color: red;
  display: ${props => props.error ? 'block' : 'none'};
`
const LabelError = (props) => {
  const { id, text, values, ...rest } = props
  return (
    <BaseLabelError {...rest}>
      <FormattedMessage id={id} defaultMessage={text} values={values} />
    </BaseLabelError>
  )
}

LabelError.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default LabelError
