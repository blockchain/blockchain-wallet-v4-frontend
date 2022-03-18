import styled from 'styled-components'

import { Button, ModalBody, ModalFooter, ModalHeader, Text } from 'blockchain-info-components'

export const StyledModalHeader = styled(ModalHeader)`
  border: none;
  padding-bottom: 0px;
`

export const StyledModalFooter = styled(ModalFooter)`
  border: none;
  padding-top: 10px;
`

export const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0px;
`

export const Description = styled(Text)`
  text-align: center;
`

export const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 10px;
`

export const Title = styled(Text)`
  margin: 24px 0px;
`
