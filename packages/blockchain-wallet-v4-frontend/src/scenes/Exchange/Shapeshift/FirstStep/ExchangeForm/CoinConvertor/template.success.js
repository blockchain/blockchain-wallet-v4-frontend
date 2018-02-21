import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinInput from './CoinInput'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  & > :first-child { width: 45%; }
  & > :last-child { width: 45%; }
  & > :not(:first-child):not(:last-child) { width: 10%; }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: ${props => props.fullwidth ? '100%' : '45%'};
  flex-grow: 2;
`
const ContainerMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 50px;
  height: 50px;
  flex-grow: 1;

  & > :first-child:hover { color: ${props => props.theme['brand-primary']}; }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

// const getErrorState = (meta) => {
//   return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
// }

const CoinConvertor = (props) => {
  const { coinSource, coinTarget, coinSourceValue, coinTargetValue, coinSourceUnit, coinTargetUnit, currency, btcRates, ethRates, meta, ...rest } = props
  const { handleChangeCoinSource, handleChangeCoinTarget, loading } = rest
  // const errorState = getErrorState(meta)
  console.log('loading', loading)

  return (
    <Wrapper>
      <Row>
        <Container>
          <CoinInput
            coin={coinSource}
            coinValue={coinSourceValue}
            coinUnit={coinSourceUnit}
            currency={currency}
            btcRates={btcRates}
            ethRates={ethRates}
            handleChange={handleChangeCoinSource}
          />
        </Container>
        <ContainerMiddle>
          {loading
            ? <HeartbeatLoader width='20px' height='20px' />
            : <Icon name='right-arrow' size='24px' weight={500} cursor />
          }
        </ContainerMiddle>
        <Container>
          <CoinInput
            coin={coinTarget}
            coinValue={coinTargetValue}
            coinUnit={coinTargetUnit}
            currency={currency}
            btcRates={btcRates}
            ethRate={ethRates}
            handleChange={handleChangeCoinTarget}
          />
        </Container>
      </Row>
      {/* {canExchange
        ? <MinMaxText weight={300} size='12px'>
          <FormattedMessage id='scenes.exchangebox.firststep.use1' defaultMessage='Use' />
          <Link size='12px' weight={300} onClick={enterMin}><FormattedMessage id='scenes.exchangebox.firststep.min' defaultMessage='minimum' /></Link>
          <FormattedMessage id='scenes.exchangebox.firststep.use2' defaultMessage='| Use' />
          <Link size='12px' weight={300} onclick={enterMax}><FormattedMessage id='scenes.exchangebox.firststep.max' defaultMessage='maximum' /></Link>
        </MinMaxText>
        : <MinMaxText color='error' weight={300} size='12px'>
          <FormattedMessage id='scenes.exchange.exchangebox.firststep.fee' defaultMessage={`x ${fromCoin} needed to exchange.`} />
        </MinMaxText>
      } */}
      {/* <Row>
        {meta.touched && meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
      </Row> */}
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  coinSource: PropTypes.string.isRequired,
  coinTarget: PropTypes.string.isRequired,
  coinSourceValue: PropTypes.string.isRequired,
  coinTargetValue: PropTypes.string.isRequired,
  coinSourceUnit: PropTypes.string.isRequired,
  coinTargetUnit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object.isRequired,
  ethRates: PropTypes.object.isRequired,
  handleChangeCoinSource: PropTypes.func.isRequired,
  handleChangeCoinTarget: PropTypes.func.isRequired
}

export default CoinConvertor
