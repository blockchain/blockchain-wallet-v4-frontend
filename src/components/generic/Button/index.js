import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Typography } from 'components/generic/Typography'

const BaseButton = styled(Typography)`
  display: block;
  padding: 10px 15px;
  box-sizing: border-box;
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  min-width: 130px;
  height: 40px;
  margin-bottom: 0;
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  cursor: pointer;
  border-radius: ${props => props.rounded ? '20px' : 'none'};
 `

const Button = (props) => {
  const { id, text, values, ...rest } = props
  return (
    <BaseButton {...rest}>
      <FormattedMessage id={id} defaultMessage={text} values={values} />
    </BaseButton>
  )
}

Button.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  values: PropTypes.object
}

const PrimaryButton = styled(Button)`
  color: #FFFFFF;
  background-color: #004A7C;
  border: ${props => props.bordered ? '2px solid #FFFFFF' : '2px solid #004A7C'};
`

const SecondaryButton = styled(Button)`
  color: #FFFFFF;
  background-color: #10ADE4;
  border: ${props => props.bordered ? '2px solid #FFFFFF' : '2px solid #10ADE4'};

  &:hover { background-color: #0E9BCC; }
`

export { PrimaryButton, SecondaryButton }
