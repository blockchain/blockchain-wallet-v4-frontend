import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconAlert, Padding, SemanticColors } from '@blockchain-com/constellation'

import { RemoteDataType } from '@core/types'
import { Link, SpinningLoader, Text, TextGroup } from 'blockchain-info-components'
import Carousel from 'components/Carousel'
import { ReportType } from 'data/components/taxCenter/types'

import Card from './Card'
import List from './List'
import {
  AlertMessage,
  Box,
  Container,
  Content,
  Footer,
  GenerateButton,
  GenerateReport,
  LoadingContainer,
  MenuHeaderCentered,
  ReportList,
  SelectGroup,
  SelectLabel,
  Slide,
  StyledSelect,
  StyledSeparator,
  Title,
  VisitButton
} from './model'

const ErrorMessage = () => (
  <AlertMessage>
    <IconAlert color={SemanticColors.warning} label='reports' size='small' />
    <Text size='12px' color='orange600' weight={500}>
      <FormattedMessage
        id='scenes.tax.center.card.report.error.message'
        defaultMessage='Reports not currently available. Please try again or reload the page.'
      />
    </Text>
  </AlertMessage>
)

const Loader = () => (
  <LoadingContainer>
    <SpinningLoader width='32px' height='32px' />
  </LoadingContainer>
)

const TaxCenter = ({
  exchangeDomain,
  onChange,
  onClick,
  onExportClick,
  onPartnerClick,
  onVisitClick,
  options,
  reportsR,
  value
}: Props) => (
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
              defaultMessage='If you sold, swapped, or earned rewards on your crypto in the last year, you likely owe taxes.'
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
              tax reports for up to 500 transactions.'
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
          <Text size='14px' weight={500} color='black'>
            <FormattedMessage
              id='scenes.tax.center.carousel.services.description'
              defaultMessage='This file only contains your Blockchain.com Wallet activity. If you use other crypto services,
              those transactions will not appear here. If you use the Blockchain.com Exchange, you can
              export your Exchange transaction history by using Exchange Tax Center'
            />
          </Text>
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
                defaultMessage='Choose year'
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
              defaultMessage='Generate Export'
            />
          </GenerateButton>
        </GenerateReport>
        {reportsR.cata({
          Failure: () => <ErrorMessage />,
          Loading: () => <Loader />,
          NotAsked: () => <Loader />,
          Success: (list) => (
            <ReportList>
              <SelectLabel size='14px' weight={600} color='black'>
                <FormattedMessage
                  id='scenes.tax.center.card.report.list'
                  defaultMessage='Generated Exports'
                />
              </SelectLabel>
              <StyledSeparator />
              <List reports={list} onExportClick={onExportClick} />
            </ReportList>
          )
        })}
      </Content>
    </Card>
    <Card
      description={<></>}
      number={2}
      title={
        <FormattedMessage
          id='scenes.tax.center.card.service.title'
          defaultMessage='Upload to a tax service'
        />
      }
    >
      <>
        <Padding bottom={1}>
          <Text size='16px' weight={600} color='grey700'>
            <FormattedMessage
              id='scenes.tax.center.card.service.turboTax.description1'
              defaultMessage='We have partnered with TurboTax and Cointracker to simplify your tax reporting.'
            />
          </Text>
        </Padding>
        <Text size='14px' weight={500} color='grey700'>
          <FormattedMessage
            id='scenes.tax.center.card.service.turboTax.description2'
            defaultMessage='If you’re new to crypto and don’t have much crypto activity, TurboTax helps navigate the complexity of crypto taxes. Save time by auto-importing crypto activity, plus specialized experts are available year round and can even do your taxes for you, start to finish.'
          />
        </Text>

        <Padding bottom={1}>
          <VisitButton
            height='24px'
            nature='empty-blue'
            data-e2e='visitButton'
            type='button'
            onClick={() => onPartnerClick('TURBO_TAX')}
          >
            <Link
              href='https://turbotax.intuit.com/microsite/home.htm?priorityCode=5775000000&cid=all_blockchain-dcntr_aff_5775000000'
              target='_blank'
            >
              <FormattedMessage
                id='scenes.tax.center.card.service.turboTax.button'
                defaultMessage='Visit TurboTax'
              />
            </Link>
          </VisitButton>
        </Padding>

        <Text size='14px' weight={500} color='grey700'>
          <FormattedMessage
            id='scenes.tax.center.card.service.cointracker.description'
            defaultMessage='If your crypto activity is high and you have multiple wallets beyond Blockchain.com, Cointracker is fully supported in the US, Australia, UK, Canada and also provides capital gains reports for users around the World. Blockchain.com users get free tax reports for up to 500 transactions with CoinTracker.
            '
          />
        </Text>
        <VisitButton
          height='24px'
          nature='empty-blue'
          data-e2e='visitButton'
          type='button'
          onClick={() => onPartnerClick('COIN_TRACKER')}
        >
          <Link href='https://www.cointracker.io/blockchain' target='_blank'>
            <FormattedMessage
              id='scenes.tax.center.card.service.button'
              defaultMessage='Visit CoinTracker'
            />
          </Link>
        </VisitButton>
      </>
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
          <Link
            href={`${exchangeDomain}/trade/login`}
            target='_blank'
            weight={500}
            size='14px'
            onClick={onVisitClick}
          >
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
  exchangeDomain: string
  onChange: (unknown) => void
  onClick: () => void
  onExportClick: (number) => void
  onPartnerClick: (partner: string) => void
  onVisitClick: () => void
  options: Array<{ text: string; value: number }>
  reportsR: RemoteDataType<string, ReportType[]>
  value: number
}

export default TaxCenter
