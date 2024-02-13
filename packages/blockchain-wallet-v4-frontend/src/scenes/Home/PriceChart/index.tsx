import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { getData as getUserCountry } from 'components/Banner/selectors'
import { media } from 'services/styles'

import Actions from './Actions'
import Chart from './Chart'
import CoinCurrentPrice from './CoinCurrentPrice'
import CoinPerformance from './CoinPerformance'
import CoinSelector from './CoinSelector'
import TimeFilter from './TimeFilter'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  right: 0;
  align-items: center;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  margin-bottom: 36px;
`

const Row = styled.div`
  display: flex;

  flex-direction: column;
  ${media.atLeastTabletL`
    flex-direction: row;
  `}
  justify-content: space-between;
  width: 100%;
`

const Column = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.atLeastTabletL`
    margin: 0;
    align-items: flex-start;
  `}
`

const Header = styled(Row)`
  margin-bottom: 16px;
`

const Main = styled(Row)`
  margin-bottom: 24px;
`

const Footer = styled(Row)`
  justify-content: flex-end;
`

const UkDisclaimerText = styled.p`
  font-size: 14px;
  padding: 8px;
  text-align: center;
  margin-top: 16px;

  a {
    color: #0c6cf2;
    text-decoration: underline;
    font-weight: bold;
    font-size: 14px;
  }
`

const PriceChart = () => {
  const isUserFromUK = useSelector(getUserCountry)?.country === 'GB'
  const isIpFromUK = useSelector(getUserCountry)?.ipCountry === 'GB'

  return (
    <Wrapper>
      <Header>
        <Column>
          <CoinSelector />
          <CoinCurrentPrice />
          <CoinPerformance />
        </Column>
        <Column>
          <Actions />
        </Column>
      </Header>
      <Main>
        <Chart />
      </Main>
      <Footer>
        <TimeFilter />
      </Footer>
      {(isUserFromUK || isIpFromUK) && (
        <UkDisclaimerText>
          <FormattedMessage
            id='home.pricechart.finprom.disclaimer'
            defaultMessage='Real-time data is obtained from multiple sources and may sometimes be delayed due to system performance issues. Past performance is not indicative of future results. Find out more about various crypto assets and their risks {link}.'
            values={{
              link: (
                <Link href='https://support.blockchain.com/hc/en-us/articles/10857167024156-Various-Cryptoassets-and-Their-Risks-'>
                  <FormattedMessage id=' home.pricechart.finprom.here' defaultMessage='here' />
                </Link>
              )
            }}
          />
        </UkDisclaimerText>
      )}
    </Wrapper>
  )
}

export default PriceChart
