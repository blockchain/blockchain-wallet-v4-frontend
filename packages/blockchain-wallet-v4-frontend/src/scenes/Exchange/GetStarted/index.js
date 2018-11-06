import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { actions } from 'data'
import { Button, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 50px;
  box-sizing: border-box;
`
const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  height: auto;

  @media (min-width: 1200px) {
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
  }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 15px;
  box-sizing: border-box;

  @media (min-width: 1200px) {
    width: ${props => props.width || 'auto'};
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
  flex-wrap: wrap;

  & > :not(:last-child) {
    margin-right: 10px;
  }

  @media (min-width: 1200px) {
    flex-direction: row;
    margin-bottom: ${props => (props.marginBottom ? '30px' : 'none')};
  }
`
const PreviewImage = styled(Image).attrs({
  name: 'kyc-get-started'
})`
  width: 100%;
  max-width: 411px;
  @media (max-width: 1200px) {
    width: 350px;
  }
`
const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  @media (max-width: 1200px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'inline-block')};
  }
`
const PrimaryText = styled(Text).attrs({
  color: 'brand-primary',
  size: '16px'
})`
  white-space: nowrap;
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  width: '250px',
  weight: 600
})`
  margin-top: 20px;

  @media (max-width: 1200px) {
    width: 100%;
  }
`

const GetStarted = ({ verifyIdentity }) => (
  <Wrapper>
    <Container>
      <Column>
        <Row marginBottom>
          <Text color='brand-primary' size='30px' weight={600}>
            <FormattedMessage
              defaultMessage='A better way to trade crypto'
              id='scenes.exchange.getstarted.title'
            />
          </Text>
        </Row>
        <Row marginBottom>
          <DarkText>
            <FormattedMessage
              defaultMessage='The faster, smarter way to trade your crypto.'
              id='scenes.exchange.getstarted.introducing'
            />
          </DarkText>
        </Row>
        <Row>
          <DarkText>
            <FormattedMessage
              defaultMessage='Upgrade now to enjoy the following benefits:'
              id='scenes.exchange.getstarted.upgrade'
            />
          </DarkText>
        </Row>
        <Row>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Lower cost'
              id='scenes.exchange.getstarted.lowercost'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='Super competitive crypto exchange prices'
              id='scenes.exchange.getstarted.lowercost_description'
            />
          </DarkText>
        </Row>
        <Row>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Live rates'
              id='scenes.exchange.getstarted.liverates'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='You always get the most up to date price'
              id='scenes.exchange.getstarted.liverates_Description'
            />
          </DarkText>
        </Row>
        <Row marginBottom>
          <PrimaryText>
            <FormattedMessage
              defaultMessage='Higher limits'
              id='scenes.exchange.getstarted.higherlimits'
            />
          </PrimaryText>
          <DarkText hideOnMobile>{' - '}</DarkText>
          <DarkText>
            <FormattedMessage
              defaultMessage='Limits from $2,000-$10,000'
              id='scenes.exchange.getstarted.higherlimits_description'
            />
          </DarkText>
        </Row>
        <Row>
          <GetStartedButton onClick={verifyIdentity}>
            <FormattedMessage
              id='scenes.exchange.getstarted.started'
              defaultMessage='Get Started'
            />
          </GetStartedButton>
        </Row>
      </Column>
      <Column width='40%'>
        <PreviewImage />
      </Column>
    </Container>
  </Wrapper>
)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  undefined,
  mapDispatchToProps
)(GetStarted)
