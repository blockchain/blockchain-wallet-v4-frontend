import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { keysIn } from 'ramda'

import { Palette } from '../Colors'
import { Icon } from '../Icons'
import { Text } from '../Text'

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.position === props.total ? props.theme['halftransparentgrey'] : 'transparent'};
  z-index: ${props => props.position ? (props.position) + 1040 : 1040};
`
const Container = styled.div`
  position: relative;
  width: calc(100% - ${props => props.position * 20}px);
  background-color: ${props => props.position === props.total ? props.theme[props.backgroundColor] : props.theme['gray-1']};
  z-index: ${props => props.position ? (props.position) + 1041 : 1041};

  @media(min-width: 768px) {
    width: ${props => props.size === 'small' ? 'calc(400px - ' + props.position * 20 + 'px)'
    : props.size === 'medium' ? 'calc(500 - ' + props.position * 20 + 'px)'
    : props.size === 'large' ? 'calc(600px - ' + props.position * 20 + 'px)'
    : 'calc(700px - ' + props.position * 20 + 'px)'};
  }
`
const Header = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 30px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  & > :first-child { margin-right: 10px; }
`
const ButtonClose = styled(Icon)`
  position: absolute;
  top: 30px;
  right: 20px;
  height: 20px;
  cursor: pointer;
`
const Content = styled.div`
  padding: 30px;
  box-sizing: border-box;
  
`

const selectColors = nature => {
  switch (nature) {
    case 'primary': return { color: 'white', backgroundColor: 'brand-primary' }
    default: return { color: 'gray-5', backgroundColor: 'white' }
  }
}

const Modal = (props) => {
  const { position, total, title, icon, nature, size, closeButton, close } = props
  const { color, backgroundColor } = selectColors(nature)

  return (
    <Wrapper position={position} total={total}>
      <Container position={position} total={total} size={size} backgroundColor={backgroundColor}>
        <Header>
          {icon && <Icon name={icon} size='24px' weight={300} color={color} />}
          {title && <Text size='24px' weight={300} color={color}>{title}</Text>}
          {closeButton && <ButtonClose name='right_arrow' size='20px' weight={300} color={color} onClick={() => close()} />}
        </Header>
        <Content>
          {props.children}
        </Content>
      </Container>
    </Wrapper>
  )
}

Modal.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  backgroundColor: PropTypes.oneOf(['primary']),
  title: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  closeButton: PropTypes.bool,
  isLast: PropTypes.bool
}

Modal.defaultProps = {
  size: '',
  isLast: true,
  closeButton: true
}

export default Modal
