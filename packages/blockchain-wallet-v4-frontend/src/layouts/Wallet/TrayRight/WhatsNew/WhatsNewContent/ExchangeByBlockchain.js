import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'

import { actions, model } from 'data'
import { Button, Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 15px;
  margin-bottom: ${props => props.marginBottom};

  & > :not(:last-child) {
    margin-right: 10px;
  }
`
const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  display: inline;
  @media (max-width: 1200px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  }
`
const PrimaryText = styled(Text).attrs({
  color: 'brand-primary',
  size: '16px'
})`
  display: inline;
  white-space: nowrap;
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  @media (max-width: 1200px) {
    width: 100%;
  }
`

export const ExchangeByBlockchain = ({ kycNotFinished, verifyIdentity }) => (
  <Container>
    <Row marginBottom='24px'>
      <Text color='brand-primary' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage="We've Improved Your Exchange"
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.improved'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='14px'>
        <FormattedMessage
          defaultMessage='November 2019'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.november2019'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='The faster, smarter way to trade your crypto.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.introducing'
        />
      </DarkText>
    </Row>
    <Row marginBottom='8px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='Upgrade now to enjoy the following benefits:'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.upgrade'
        />
      </DarkText>
    </Row>
    <Row marginBottom='8px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Lower cost'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.lowercost'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='Super competitive crypto exchange prices'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.lowercost_description'
        />
      </DarkText>
    </Row>
    <Row marginBottom='8px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Live rates'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.liverates'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='You always get the most up to date price'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.liverates_Description'
        />
      </DarkText>
    </Row>
    <Row marginBottom='32px'>
      <DarkText>
        <PrimaryText>
          <FormattedMessage
            defaultMessage='Higher limits'
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.higherlimits'
          />
        </PrimaryText>
        <DarkText hideOnMobile>{' - '}</DarkText>
        <FormattedMessage
          defaultMessage='Limits from $1,000-$25,000'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.higherlimits_description'
        />
      </DarkText>
    </Row>
    <Row>
      {kycNotFinished && (
        <GetStartedButton onClick={verifyIdentity}>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.started'
            defaultMessage='Get Started'
          />
        </GetStartedButton>
      )}
      {!kycNotFinished && (
        <LinkContainer to='/swap'>
          <GetStartedButton>
            <FormattedMessage
              id='layouts.wallet.trayright.whatsnew.whatsnewcontent.exchangebyblockchain.makeswap'
              defaultMessage='Make Swap'
            />
          </GetStartedButton>
        </LinkContainer>
      )}
    </Row>
  </Container>
)

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity(
        model.profile.TIERS[2]
      )
    )
})

export default connect(
  undefined,
  mapDispatchToProps
)(ExchangeByBlockchain)
