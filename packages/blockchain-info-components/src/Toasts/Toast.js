import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { darken } from 'polished'
import { Icon } from '../Icons'

const Wrapper = styled.div`
  height: 65px;
  width: 100%;
  background-color: ${props => props.theme['white']};
  @media (min-width: 768px) {
    width: 515px;
    border-radius: 8px;
  }
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 15px 10px 15px 25px;
  box-sizing: border-box;
  background: ${props => props.theme['white']};
  border-left: 6px solid ${props => props.theme[props.color]};
  border-radius: 8px;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 100%;
  margin-right: 10px;
  box-sizing: border-box;
`
const CloseIcon = styled(Icon)`
  margin-right: 8px;
  &:hover {
    color: ${props => darken(0.5, props.theme['gray-4'])}!important;
  }
`

const selectColor = type => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warn':
      return 'orange'
    default:
      return 'brand-secondary'
  }
}

const Toast = props => {
  const { children, nature, onClose } = props
  const color = selectColor(nature)

  return (
    <Wrapper>
      <Container color={color} data-e2e='toastMessage'>
        <Content>{children}</Content>
        <CloseIcon
          data-e2e='toastMessageClose'
          name='close'
          size='14px'
          weight={600}
          color='gray-4'
          cursor
          onClick={onClose}
        />
      </Container>
    </Wrapper>
  )
}

Toast.propTypes = {
  nature: PropTypes.oneOf(['success', 'error', 'info']),
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

Toast.defaultProps = {
  nature: 'info'
}

export default Toast
