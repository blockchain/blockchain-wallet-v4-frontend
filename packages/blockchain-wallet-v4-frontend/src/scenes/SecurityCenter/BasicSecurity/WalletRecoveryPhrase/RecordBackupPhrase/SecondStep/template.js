import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (min-width: 992px) {
    width: 118%;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`
const Word = styled(Text)`
  font-size: 14px;
  padding: 15px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  width: 100px;
  text-align: center;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
  a {
    margin-top: 50px;
  }
  @media (max-width: 991px) {
    padding-bottom: 15px;
  }
`

const SecondStep = props => {
  const { nextStep, handleClickPrevious, handleClickNext, step, words } = props
  return (
    <Wrapper>
      <Container>
        {words.map((word, index) => {
          return <Word key={index}>{word}</Word>
        })}
      </Container>
      <Buttons>
        {step === 1 ? (
          <Button nature='empty' onClick={props.handleClose}>
            <FormattedMessage
              id='scenes.security.2fa.cancel'
              defaultMessage='Cancel'
            />
          </Button>
        ) : (
          <Button onClick={handleClickPrevious} nature='empty'>
            <FormattedMessage
              id='modals.recoveryphrase.secondstep.prevfourwords'
              defaultMessage='Previous 4 Words'
            />
          </Button>
        )}
        {step === 3 ? (
          <Button onClick={nextStep} style={spacing('ml-15')} nature='primary'>
            <FormattedMessage
              id='modals.recoveryphrase.secondstep.finishandcheckphrase'
              defaultMessage='Finish & Verify'
            />
          </Button>
        ) : (
          <Button
            onClick={handleClickNext}
            style={spacing('ml-15')}
            nature='primary'
          >
            <FormattedMessage
              id='modals.recoveryphrase.secondstep.nextfourwords'
              defaultMessage='Next 4 Words'
            />
          </Button>
        )}
      </Buttons>
    </Wrapper>
  )
}

export default SecondStep
