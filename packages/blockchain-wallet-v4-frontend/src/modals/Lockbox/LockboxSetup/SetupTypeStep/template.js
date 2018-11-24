import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, Image, Text } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 25px;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 375px;
`
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0;
  border-top: 1px solid ${props => props.theme['gray-2']};
  & :last-child {
    border-bottom: 1px solid ${props => props.theme['gray-2']};
  }
  &:hover {
    cursor: pointer;
    & > :last-child {
      & > :last-child {
        color: ${props => props.theme['info']};
      }
    }
  }
`
const LeftColumn = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 20px;
  & > :last-child {
    padding-left: 20px;
  }
`
const RightColumn = styled.div`
  margin-right: 20px;
`

const SetupTypeStep = props => {
  const { handleStepChange, openSupportLink } = props
  return (
    <React.Fragment>
      <Title>
        <Text size='16px'>
          <FormattedMessage
            id='modals.lockboxsetup.setuptypestep.connect'
            defaultMessage='Connect Your Lockbox'
          />
        </Text>
      </Title>
      <Content>
        <Row onClick={() => handleStepChange('new')}>
          <LeftColumn>
            <Icon name='plus' size='22px' color='info' />
            <Text size='15px'>
              <FormattedMessage
                id='modals.lockboxsetup.firststep.newdevice'
                defaultMessage='Setup a brand new device'
              />
            </Text>
          </LeftColumn>
          <RightColumn>
            <Icon name='short-right-arrow' nature='empty' size='20px' />
          </RightColumn>
        </Row>
        <Row onClick={() => handleStepChange('existing')}>
          <LeftColumn>
            <Image width='22px' height='22px' name='link-lockbox-icon' />
            <Text size='15px'>
              <FormattedMessage
                id='modals.lockboxsetup.firststep.existingdevice'
                defaultMessage='Link an existing device'
              />
            </Text>
          </LeftColumn>
          <RightColumn>
            <Icon name='short-right-arrow' nature='empty' size='20px' />
          </RightColumn>
        </Row>
        <Row onClick={() => openSupportLink()}>
          <LeftColumn>
            <Icon name='open-in-new-tab' size='22px' color='info' />
            <Text size='15px'>
              <FormattedMessage
                id='modals.lockboxsetup.firststep.restoredevice'
                defaultMessage='Restore a previous device'
              />
            </Text>
          </LeftColumn>
          <RightColumn>
            <Icon name='short-right-arrow' nature='empty' size='20px' />
          </RightColumn>
        </Row>
      </Content>
    </React.Fragment>
  )
}

export default SetupTypeStep
