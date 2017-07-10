import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const BaseButtonDisabled = styled.button`
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
  user-select: none;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  letter-spacing: normal;
  transition: all .2s ease-in-out;
  white-space: nowrap;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};;
  border: 1px solid #CDCDCD${props => props.disabled ? '!important' : '!default'};
  background-color: #CDCDCD${props => props.disabled ? '!important' : '!default'};
  color: #FFFFFF${props => props.disabled ? '!important' : '!default'};
  border-radius: ${props => props.rounded ? '20px' : '3px'};

  &:hover { background-color: #F2F2F2; }
 `
const BaseButton = styled(BaseButtonDisabled)`
  border: 1px solid #CDCDCD;
  background-color: #FFFFFF;

  &:hover { background-color: #CDCDCD; }
`

const Button = ({ ...props, children }) => {
  return (
    <BaseButton {...props} forbidden={props.disabled}>
      {children}
    </BaseButton>
  )
}

Button.propTypes = {
  fullwidth: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  rounded: PropTypes.bool.isRequired
}

Button.defaultProps = {
  fullwidth: false,
  disabled: false,
  rounded: false
}

export default Button
