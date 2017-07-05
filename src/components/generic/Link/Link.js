import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text } from 'components/generic/Text'

const BaseLink = styled.a`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &:focus {
    text-decoration: none;
  }
`

const Link = (props) => {
  const { href, target, ...rest } = props
  return (
    <BaseLink href={href} target={target}>
      <Text {...rest} />
    </BaseLink>
  )
}

Link.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

export default Link
