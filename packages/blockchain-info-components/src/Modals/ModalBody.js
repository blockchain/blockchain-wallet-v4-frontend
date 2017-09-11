import React from 'react'
import styled from 'styled-components'

const BaseModalBody = styled.div`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`

const ModalBody = props => {
  const { children } = props

  return (
    <BaseModalBody>
      {children}
    </BaseModalBody>
  )
}

export default ModalBody
