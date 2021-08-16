import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'

import { CardsWrapper } from '../components'
import SignupCard from '../components/SignupCard'
import { SubviewProps } from '../types'

const InfoWrapper = styled.div`
  box-sizing: border-box;
  width: 360px;
  margin: 2rem 4rem 0 0;
  padding: 0;

  img {
    background-color: white;
    border-radius: 1.75rem;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
  }
`
const Title = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 0.625rem;
`
const ListHeader = styled(Text)`
  font-size: 1rem;
  margin-top: 20px;
  font-weight: 500;
  line-height: 150%;
`
const List = styled.ul`
  margin-bottom: 0;
  margin-top: 8px;
  padding-left: 0;
  list-style: none;
`
const ListItem = styled.li`
  margin-top: 8px;

  div {
    display: inline;
  }

  ::before {
    content: '–';
    color: ${(p) => p.theme.whiteFade600};
    padding-right: 0.5rem;
  }
`

const ExchangeLinkGoal = (props: InjectedFormProps<{}, SubviewProps> & SubviewProps) => (
  <CardsWrapper>
    <InfoWrapper>
      <Image height='2rem' name='refresh' />
      <Title>
        <FormattedMessage id='scenes.linkaccount.authorize2' defaultMessage='Connect Your Wallet' />
      </Title>
      <Text weight={500} color='whiteFade600' lineHeight='150%'>
        <FormattedMessage id='scenes.linkaccount.subtitle' defaultMessage='To The Exchange' />
      </Text>

      <ListHeader color='white'>
        <FormattedMessage
          id='scenes.linkaccount.able_to'
          defaultMessage='The Exchange will be able to:'
        />
      </ListHeader>
      <List>
        <ListItem>
          <Text weight={500} color='whiteFade600' lineHeight='150%'>
            <FormattedMessage
              id='scenes.linkaccount.able_to1'
              defaultMessage='Access your profile information'
            />
          </Text>
        </ListItem>
        <ListItem>
          <Text weight={500} color='whiteFade600' lineHeight='150%'>
            <FormattedMessage
              id='scenes.linkaccount.able_to2'
              defaultMessage='Send & receive currency between apps'
            />
          </Text>
        </ListItem>
        <ListItem>
          <Text weight={500} color='whiteFade600' lineHeight='150%'>
            <FormattedMessage
              id='scenes.linkaccount.able_to3'
              defaultMessage='Add your linked banks'
            />
          </Text>
        </ListItem>
      </List>

      <ListHeader color='white'>
        <FormattedMessage
          id='scenes.linkaccount.can_not_do'
          defaultMessage='The Exchange will not be able to:'
        />
      </ListHeader>
      <List>
        <ListItem>
          <Text weight={500} color='whiteFade600' lineHeight='150%'>
            <FormattedMessage id='scenes.linkaccount.trade' defaultMessage='Trade on your behalf' />
          </Text>
        </ListItem>
        <ListItem>
          <Text weight={500} color='whiteFade600' lineHeight='150%'>
            <FormattedMessage
              id='scenes.linkaccount.view_pw'
              defaultMessage='View your Blockchain.com password'
            />
          </Text>
        </ListItem>
      </List>
    </InfoWrapper>
    <SignupCard {...props} />
  </CardsWrapper>
)

export default ExchangeLinkGoal
