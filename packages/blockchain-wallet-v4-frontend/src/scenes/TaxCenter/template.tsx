import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Carousel, Link, Text, TextGroup } from 'blockchain-info-components'

import { Card } from './components'
import List from './components/List'
import {
  Box,
  Container,
  Content,
  Footer,
  GenerateButton,
  GenerateReport,
  MenuHeaderCentered,
  ReportList,
  SelectGroup,
  SelectLabel,
  Slide,
  StyledSelect,
  StyledSeparator,
  StyledTextGroup,
  Title,
  VisitButton
} from './model'

const TaxCenter = ({ onChange, onClick, options, reports, value }: Props) => (
  <Container>
    <MenuHeaderCentered>
      <Title size='40px' weight={600} color='black'>
        <FormattedMessage id='scenes.tax.center.title' defaultMessage='Blockchain.com Tax Center' />
      </Title>
      <Text size='14px' weight={500} color='grey700'>
        <FormattedMessage
          id='scenes.tax.center.description'
          defaultMessage='Here’s everything you’ll need from Blockchain.com to file your taxes this year.'
        />
      </Text>
    </MenuHeaderCentered>
    <Box>
      <Carousel height={90} arrows={false} chips={false}>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.taxes'
              defaultMessage='Do I owe taxes on my crypto?'
            />
          </Title>
          <Text size='14px' weight={500} color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.taxes.description'
              defaultMessage='If you sold or converted your crypto last year, the transactions are likely subject to U.S. capital
              gains taxes.'
            />
          </Text>
        </Slide>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.file'
              defaultMessage='How do I file?'
            />
          </Title>
          <Text size='14px' weight={500} color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.file.description'
              defaultMessage='Export your transaction history then manually calculate your gains/losses using your cost
              basis. If you want to simplify the process, use our crypto tax partner CoinTracker to get free
              tax reports for up to 1,000 transactions.'
            />
          </Text>
        </Slide>
        <Slide>
          <Title weight={600} size='20px' color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.services'
              defaultMessage='What if I use other crypto services?'
            />
          </Title>
          <TextGroup inline>
            <Text size='14px' weight={500} color='black'>
              <FormattedMessage
                id='scenes.tax.center.carousel.services.description'
                defaultMessage='This file only contains your Blockchain.com Wallet activity. If you use other crypto services,
                those transactions will not appear here. If you use the Blockchain.com Exchange, you can
                connect your account to CoinTracker via API.'
              />
            </Text>
            <Text>
              <Link href='/' target='_blank' weight={500} size='14px'>
                <FormattedMessage id='copy.learn_more' defaultMessage='Learn more' />
              </Link>
            </Text>
          </TextGroup>
        </Slide>
      </Carousel>
    </Box>
    <Card
      description={
        <FormattedMessage
          id='scenes.tax.center.card.report.description'
          defaultMessage={`Get the full transaction history from your Wallet's Trading, Rewards, and Private Key accounts.`}
        />
      }
      number={1}
      title={
        <FormattedMessage
          id='scenes.tax.center.card.report.title'
          defaultMessage='Export your transaction history'
        />
      }
    >
      <Content>
        <GenerateReport>
          <SelectGroup>
            <SelectLabel size='14px' weight={600} color='black'>
              <FormattedMessage
                id='scenes.tax.center.card.report.select'
                defaultMessage='Choose tax year'
              />
            </SelectLabel>
            <StyledSelect
              value={value}
              elements={[{ group: '', items: options }]}
              onBlur={() => {}}
              onChange={onChange}
            />
          </SelectGroup>
          <GenerateButton
            nature='primary'
            data-e2e='additionalInfoUploadDocument'
            type='button'
            onClick={onClick}
          >
            <FormattedMessage
              id='scenes.tax.center.card.report.button'
              defaultMessage='Generate Report'
            />
          </GenerateButton>
        </GenerateReport>
        {reports && reports.length > 0 && (
          <ReportList>
            <StyledTextGroup inline>
              <SelectLabel size='14px' weight={600} color='black'>
                <FormattedMessage
                  id='scenes.tax.center.card.report.list'
                  defaultMessage='Generated Reports'
                />
              </SelectLabel>
              <Text size='12px' color='grey400'>
                {`${reports.length}/5 `}
                <FormattedMessage
                  id='scenes.tax.center.card.report.limit'
                  defaultMessage='Report Limit'
                />
              </Text>
            </StyledTextGroup>
            <StyledSeparator />
            <List reports={reports} />
          </ReportList>
        )}
      </Content>
    </Card>
    <Card
      description={
        <FormattedMessage
          id='scenes.tax.center.card.service.description'
          defaultMessage='We have partnered with CoinTracker to simplify your tax reporting. Get free tax reports for up to 1,000 transactions with CoinTracker or use a service provider of your choosing.'
        />
      }
      number={2}
      title={
        <FormattedMessage
          id='scenes.tax.center.card.service.title'
          defaultMessage='Upload to a tax service'
        />
      }
    >
      <VisitButton nature='empty-blue' data-e2e='visitButton' type='button' onClick={() => {}}>
        <FormattedMessage
          id='scenes.tax.center.card.service.button'
          defaultMessage='Visit CoinTracker'
        />
      </VisitButton>
    </Card>
    <Footer>
      <TextGroup inline>
        <Text size='14px' weight={500} color='black'>
          <FormattedMessage
            id='scenes.tax.center.footer.description'
            defaultMessage='Have a Blockchain.com Exchange Account?'
          />
        </Text>
        <Text>
          <Link href='/' target='_blank' weight={500} size='14px'>
            <FormattedMessage
              id='scenes.tax.center.footer.link'
              defaultMessage='Visit Exchange Tax Center'
            />
          </Link>
        </Text>
      </TextGroup>
    </Footer>
  </Container>
)

type Props = {
  onChange: (unknow) => void
  onClick: () => void
  options: Array<any>
  reports: Array<any>
  value: number
}

export default TaxCenter
