import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ModalBackground = styled.div`
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

const BaseModal = styled.div`
  position: relative;
  width: calc(100% - ${props => props.position * 20}px);
  background-color: ${props => props.position === props.total ? props.theme['white'] : props.theme['gray-1']};
  z-index: ${props => props.position ? (props.position) + 1041 : 1041};

  @media(min-width: 768px) {
    width: ${props => props.width};
  }
`

const selectWidth = (size, position) => {
  switch (size) {
    case 'small': return `${400 - ((position - 1) * 20)}px`
    case 'medium': return `${500 - ((position - 1) * 20)}px`
    case 'large': return `${600 - ((position - 1) * 20)}px`
    case 'xlarge': return `${1000 - ((position - 1) * 20)}px`
    default: return `${1000 - ((position - 1) * 20)}px`
  }
}

const Modal = props => {
  const { size, position, total, children, ...rest } = props
  const width = selectWidth(size, props.position)

  return (
    <ModalBackground position={position} total={total} {...rest}>
      <BaseModal position={position} total={total} width={width} {...rest}>
        {children}
      </BaseModal>
    </ModalBackground>
  )
}

Modal.propTypes = {
  position: PropTypes.number,
  total: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
  closeButton: PropTypes.bool
}

Modal.defaultProps = {
  position: 1,
  total: 1,
  size: 'medium',
  closeButton: true
}

export default Modal

// const Container = styled.div`
//   position: relative;
//   width: calc(100% - ${props => props.position * 20}px);
//   background-color: ${props => props.position === props.total ? props.theme[props.backgroundColor] : props.theme['gray-1']};
//   z-index: ${props => props.position ? (props.position) + 1041 : 1041};

//   @media(min-width: 768px) {
//     width: ${props => props.size === 'small' ? 'calc(400px - ' + props.position * 20 + 'px)'
//     : props.size === 'medium' ? 'calc(500 - ' + props.position * 20 + 'px)'
//       : props.size === 'large' ? 'calc(600px - ' + props.position * 20 + 'px)'
//         : 'calc(800px - ' + props.position * 20 + 'px)'};
//   }
// `
// const Header = styled.div`
//   position: relative;
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-start;
//   align-items: center;
//   width: 100%;
//   padding: 30px;
//   border-bottom: 1px solid ${props => props.theme['gray-1']};

//   & > :first-child { margin-right: 10px; }
// `
// const ButtonClose = styled(Icon) `
//   position: absolute;
//   top: 30px;
//   right: 20px;
//   height: 20px;
//   cursor: pointer;
// `
// const Content = styled.div`
//   padding: 30px;
//   box-sizing: border-box;
// `

// const selectColors = nature => {
//   switch (nature) {
//     case 'primary': return { color: 'white', backgroundColor: 'brand-primary' }
//     default: return { color: 'gray-5', backgroundColor: 'white' }
//   }
// }

// const Modal = (props) => {
//   const { position, total, title, icon, nature, size, closeButton, close } = props
//   const { color, backgroundColor } = selectColors(nature)

//   return (
//     <Wrapper position={position} total={total}>
//       <Container position={position} total={total} size={size} backgroundColor={backgroundColor}>
//         <Header>
//           {icon && <Icon name={icon} size='24px' weight={300} color={color} />}
//           {title && <Text size='24px' weight={300} color={color}>{title}</Text>}
//           {closeButton && <ButtonClose name='close' size='20px' weight={300} color={color} onClick={() => close()} />}
//         </Header>
//         <Content>
//           {props.children}
//         </Content>
//       </Container>
//     </Wrapper>
//   )
// }

// Modal.propTypes = {
//   position: PropTypes.number.isRequired,
//   total: PropTypes.number.isRequired,
//   backgroundColor: PropTypes.oneOf(['primary']),
//   title: PropTypes.string,
//   icon: PropTypes.string,
//   size: PropTypes.oneOf(['small', 'medium', 'large', '']),
//   closeButton: PropTypes.bool,
//   isLast: PropTypes.bool
// }

// Modal.defaultProps = {
//   size: '',
//   isLast: true,
//   closeButton: true
// }

// export default Modal
