import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div``

const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const Content = styled.div`
  display: flex;
  justify-content: center;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &:first-child {
    margin-right: 40px;
  }
`
const ImageContainer = styled.div`
  height: 72px;
  margin-bottom: 40px;
`
const StyledButton = styled(Button)`
  width: 200px;
`

const OptionsStep = props => {
  const { handleStepChange } = props
  return (
    <Wrapper>
      <Title>
        <Text size='16px'>
          <FormattedMessage
            id='modals.lockboxsetup.setuptypestep.connect'
            defaultMessage='Connect Your Lockbox'
          />
        </Text>
      </Title>
      <Content>
        <Column>
          <ImageContainer>
            <Image name='link-lockbox-icon' />
          </ImageContainer>
          <StyledButton
            nature='primary'
            fullwidth
            onClick={() => handleStepChange()}
          >
            <FormattedMessage
              id='modals.lockboxsetup.firststep.link'
              defaultMessage='Link your new device'
            />
          </StyledButton>
        </Column>
        <Column>
          <ImageContainer>
            <Image name='restore-lockbox-icon' />
          </ImageContainer>
          <StyledButton nature='primary' fullwidth>
            <FormattedMessage
              id='modals.lockboxsetup.firststep.restore'
              defaultMessage='Restore your device'
            />
          </StyledButton>
        </Column>
      </Content>
    </Wrapper>
  )
}

export default OptionsStep
