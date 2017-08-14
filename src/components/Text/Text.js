import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Typography } from 'components'

const Text = (props) => {
  const { id, text, values, ...rest } = props
  if (id == null) console.warn('Component used without translation!')
  return (
    <Typography {...rest}>
      <FormattedMessage id={id} defaultMessage={text} values={values} />
    </Typography>
  )
}

Text.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default Text
