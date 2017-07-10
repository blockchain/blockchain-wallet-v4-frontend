import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const BaseButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 15px;
  box-sizing: border-box;
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  min-width: 130px;
  height: 40px;
  margin: 5px 0;
  font-weight: ${props => props.strong ? '600' : '300'};
  font-size: 0.9rem;
  text-transform: ${props => props.uppercase ? 'uppercase' : props.capitalize ? 'capitalize' : 'none'};
  font-style: ${props => props.italic ? 'italic' : 'normal'};
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  white-space: nowrap;
  cursor: ${props => props.disabled ? 'not-allowed!important' : 'pointer'};
  border: 1px solid #CDCDCD${props => props.disabled ? '!important' : ''};
  background-color: ${props => props.disabled ? '#CDCDCD!important' : '#CDCDCD'};
  color: ${props => props.disabled ? '#FFFFFF!important' : '#FFFFFF'};
  border-radius: ${props => props.rounded ? '20px' : '3px'};
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

  &:hover { background-color: #153A62; } 
`

const SecondaryButton = styled(Button)`
  color: #FFFFFF;
  background-color: #10ADE4;
  border: ${props => props.bordered ? '2px solid #FFFFFF' : '2px solid #10ADE4'};

  &:hover { background-color: #0E9BCC; }
`

const EmptyButton = styled(Button)`
  color: #5F5F5F;
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0;

  &:hover { background-color: #F2F2F2; }
`

export { EmptyButton, PrimaryButton, SecondaryButton }
