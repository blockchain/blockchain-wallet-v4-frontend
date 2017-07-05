import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const BaseButton = styled.button`
  display: inline-block;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  white-space: nowrap;
  padding: 8px 25px;
  line-height: 1.42857143;
  user-select: none;
  border-radius: ${props => props.rounded ? '20px' : 'none'};
  width: ${props => props.fullwidth ? '100%' : 'auto'};
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
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  color: ${props =>
    props.white ? '#FFFFFF'
    : props.cyan ? '#10ADE4'
    : '#5F5F5F'};
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
`

export { PrimaryButton, SecondaryButton }
