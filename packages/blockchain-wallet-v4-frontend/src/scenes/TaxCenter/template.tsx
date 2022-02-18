import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Carousel, Link, Text, TextGroup } from 'blockchain-info-components'

import { Card } from './components'
import {
  Box,
  Container,
  Content,
  Footer,
  GenerateButton,
  MenuHeaderCentered,
  SelectGroup,
  SelectLabel,
  Slide,
  StyledSelect,
  Title
} from './model'

const TaxCenter = () => (
  <Container>
    <MenuHeaderCentered>
      <Title size='40px' weight={600} color='black'>
        <FormattedMessage id='scenes.tax.center.title' defaultMessage='Blockchain.com Tax Center' />
      </Title>
      <Text size='14px' weight={500} color='grey700'>
        <FormattedMessage
          id='scenes.tax.center.descriptio'
          defaultMessage='Here’s everything you’ll need from Blockchain.com to file your taxes this year.'
        />
      </Text>
    </MenuHeaderCentered>
    <Box>
      <Carousel height={90} arrows={false} chips={false}>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            Do I owe taxes on my crypto?
          </Title>
          <Text size='14px' weight={500} color='black'>
            {`If you sold or converted your crypto last year, the transactions are likely subject to U.S. capital
            gains taxes.`}
          </Text>
        </Slide>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            How do I file?
          </Title>
          <Text size='14px' weight={500} color='black'>
            {`Export your transaction history then manually calculate your gains/losses using your cost
            basis. If you want to simplify the process, use our crypto tax partner CoinTracker to get free
            tax reports for up to 1,000 transactions.`}
          </Text>
        </Slide>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            What if I use other crypto services?
          </Title>
          <TextGroup inline>
            <Text size='14px' weight={500} color='black'>
              {`This file only contains your Blockchain.com Wallet activity. If you use other crypto services,
                those transactions will not appear here. If you use the Blockchain.com Exchange, you can
                connect your account to CoinTracker via API.`}
            </Text>
            <Text>
              <Link
                href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
                target='_blank'
                weight={500}
                size='14px'
              >
                Learn more
              </Link>
            </Text>
          </TextGroup>
        </Slide>
      </Carousel>
    </Box>
    <Card
      description={`Get the full transaction history from your Wallet's Trading, Rewards, and Private Key accounts.`}
      number={1}
      title='Export your transaction history'
    >
      <Content>
        <SelectGroup>
          <SelectLabel size='14px' weight={600} color='black'>
            Choose tax year
          </SelectLabel>
          <StyledSelect
            value={2021}
            elements={[
              {
                group: '',
                items: [{ text: '2021', value: 2021 }]
              }
            ]}
            onBlur={() => {}}
          />
        </SelectGroup>
        <GenerateButton
          nature='primary'
          data-e2e='additionalInfoUploadDocument'
          type='button'
          height='48px'
          style={{ marginTop: '24px' }}
          onClick={() => {}}
        >
          Generate Report
        </GenerateButton>
      </Content>
    </Card>
    <Card
      description='We have partnered with CoinTracker to simplify your tax reporting. Get free tax reports for up to 1,000 transactions with CoinTracker or use a service provider of your choosing.'
      number={2}
      title='Upload to a tax service'
    >
      <Button
        nature='empty-blue'
        data-e2e='additionalInfoUploadDocument'
        type='button'
        height='48px'
        style={{ marginTop: '16px' }}
        onClick={() => {}}
      >
        Visit CoinTracker
      </Button>
    </Card>
    <Footer>
      <TextGroup inline>
        <Text size='14px' weight={500} color='black'>
          Have a Blockchain.com Exchange Account?
        </Text>
        <Text>
          <Link
            href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
            target='_blank'
            weight={500}
            size='14px'
          >
            Visit Exchange Tax Center
          </Link>
        </Text>
      </TextGroup>
    </Footer>
  </Container>
)

export default TaxCenter
