import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text, TextGroup } from '../Text'

const TooltipWrapper = styled.div`
  width: ${props => (props.width === 'auto' ? 'auto' : '22px')};
  display: inline-flex;
  position: relative;
`
const TooltipIcon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  font-weight: 300;
  > span {
    cursor: pointer;
    &:before {
      color: ${props => props.displayed && props.theme['brand-primary']};
    }
  }
`
const TooltipLabel = styled(Text)`
  font-size: 13px;
  font-weight: 300;
`
const TooltipBox = styled(TextGroup)`
  position: absolute;
  bottom: 150%;
  left: ${props => (props.left ? props.left : '-115px')};
  width: ${props => props.width === 'auto' || '250px'};
  display: ${props => (props.displayed ? 'block' : 'none')};
  background-color: ${props => props.theme['white-blue']};
  color: ${props => props.theme['gray-5']};
  border: 1px solid ${props => props.theme['gray-2']};
  border-radius: 5px;
  padding: 10px 10px;
  box-sizing: border-box;
  cursor: pointer;
  font-size: 11px;
  font-weight: 300;
  font-family: 'Montserrat', sans serif;
  text-align: left;

  > div,
  > span {
    margin-bottom: 0;
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 114px;
    top: 100%;
    width: 0;
    height: 0;
    z-index: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 8px solid ${props => props.theme['gray-2']};
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 116px;
    top: 100%;
    width: 0;
    height: 0;
    z-index: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid ${props => props.theme['white-blue']};
  }
`

export const Tooltip = props => {
  const {
    icon,
    width,
    left,
    label,
    displayed,
    handleClick,
    handleMouseEnter,
    handleMouseLeave
  } = props
  return (
    <TooltipWrapper width={width}>
      {label ? (
        <TooltipLabel
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {label}
        </TooltipLabel>
      ) : (
        <TooltipIcon
          displayed={displayed}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {icon}
        </TooltipIcon>
      )}
      <TooltipBox
        width={width}
        left={left}
        displayed={displayed}
        onClick={handleClick}
      >
        {props.children}
      </TooltipBox>
    </TooltipWrapper>
  )
}

Tooltip.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  width: PropTypes.string,
  left: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  displayed: PropTypes.bool,
  handleClick: PropTypes.func,
  handleMouseEnter: PropTypes.func,
  handleMouseLeave: PropTypes.func
}

export default Tooltip
