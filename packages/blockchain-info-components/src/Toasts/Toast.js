import { Icon } from '../Icons'
import { propOr } from 'ramda'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import styled from 'styled-components'

const duration = 200

const Wrapper = styled.div`
  width: 100%;
  margin-top: 5px;
  background-color: ${props => props.theme.white};

  @media (min-width: 768px) {
    width: 450px;
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
  min-height: 65px;
  padding: 15px 10px;
  box-sizing: border-box;
  background: ${props => props.theme.white};
  border-left: 6px solid ${props => props.theme[props.color]};
  border-radius: 8px;
  box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
`
const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 100%;
  margin-right: 10px;
  box-sizing: border-box;
`
const CustomIcon = styled(Icon)`
  font-size: 24px;
  margin-right: 10px;
`
const CloseIcon = styled(Icon)`
  margin-right: 8px;
`

const selectColor = (type, coin) => {
  switch (type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warn':
      return 'orange'
    default:
      return propOr('blue600', 'colorCode', coin)
  }
}

const Toast = props => {
  const { children, nature, coin, onClose, persist, timeout } = props
  const color = selectColor(nature, coin)

  useEffect(() => {
    if (!persist) {
      setTimeout(() => onClose(), timeout - duration)
    }
  }, [])

  return (
    <Wrapper>
      <Container color={color}>
        <Content>
          {coin && (
            <CustomIcon name={coin.icons.circleFilled} color={coin.colorCode} />
          )}
          {children}
        </Content>
        <CloseIcon
          data-e2e='toastMessageClose'
          name='close'
          size='14px'
          weight={600}
          color='grey500'
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
