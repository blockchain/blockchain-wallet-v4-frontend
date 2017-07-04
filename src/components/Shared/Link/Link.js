import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'components/Shared/Text'

const Link = (props) => {
  const { href, target, ...rest } = props
  return (
    <a href={href} target={target}>
      <Text {...rest} />
    </a>
  )
}

Link.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default Link
