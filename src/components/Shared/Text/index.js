import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const BaseText = styled.div`
  font-family: ${props => props.altFont ? "'GillSans', Helvetica, sans-serif" : "'Montserrat', Helvetica, sans-serif"};
  font-weight: ${props =>
    props.lightest ? '100'
    : props.lighter ? '200'
    : props.light ? '300'
    : props.regular ? '400'
    : props.medium ? '500'
    : props.bold ? '600'
    : props.bolder ? '700'
    : props.boldest ? '800'
    : props.black ? '900' : '400'};
  font-size: ${props =>
    props.smallest ? '0.5rem'
    : props.smaller ? '0.7rem'
    : props.small ? '0.9rem'
    : props.big ? '1.1rem'
    : props.bigger ? '1.3rem'
    : props.biggest ? '1.5rem'
    : props.giant ? '2rem'
    : props.gianter ? '2.2rem'
    : props.giantest ? '2.5rem' : '1rem'};
  text-transform: ${props =>
    props.uppercase ? 'uppercase'
    : props.capitalize ? 'capitalize' : 'none'};
  color: ${props =>
    props.white ? '#FFFFFF'
    : props.cyan ? '#10ADE4'
    : '#5F5F5F'};
  padding: 5px 0;
`

const Text = (props) => {
  console.log(props.text)
  return (
    <BaseText {...props}>
      <FormattedMessage id={props.id} defaultMessage={props.text} values={props.values} />
    </BaseText>
  )
}

Text.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export { Text }
