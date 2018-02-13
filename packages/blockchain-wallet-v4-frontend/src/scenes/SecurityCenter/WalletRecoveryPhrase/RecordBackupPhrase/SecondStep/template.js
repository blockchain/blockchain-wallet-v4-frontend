import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Link, Modal, ModalHeader, ModalBody, ModalFooter, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`

const SecondStep = (props) => {
  const { previousStep, nextStep, position, total, close, index, word, handleClickPrevious, handleClickNext, phrase } = props
  console.log('second step', props)
  return (
    <Wrapper>
      <Container>
        
      </Container>
    </Wrapper>
  )
}

export default SecondStep
