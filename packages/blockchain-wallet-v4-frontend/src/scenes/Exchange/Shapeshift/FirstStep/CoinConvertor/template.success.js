import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import CoinInput from './CoinInput'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 45%;
  flex-grow: 2;
`
const ContainerMiddle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 10%;
  min-width: 50px;
  flex-grow: 1;
  margin-top: 25px;

  & > :first-child:hover { color: ${props => props.theme['brand-primary']}; }
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

const getErrorState = (meta) => {
  return meta.invalid ? 'invalid' : 'valid'
}

const CoinConvertor = props => {
  const { sourceCoin, targetCoin, source, target, currency, btcRates, ethRates, meta, ...rest } = props
  const { handleChangeSource, handleChangeTarget, handleBlur, handleFocus, loading } = rest
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <Container>
        <CoinInput
          coinName={sourceCoin}
          coin={source}
          currency={currency}
          btcRates={btcRates}
          ethRates={ethRates}
          handleChange={handleChangeSource}
          handleBlur={handleBlur}
          handleFocus={handleFocus}
          disabled={loading}
          errorState={errorState}
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
          coinName={targetCoin}
          coin={target}
          currency={currency}
          btcRates={btcRates}
          ethRates={ethRates}
          handleChange={handleChangeTarget}
          handleBlur={handleBlur}
          handleFocus={handleFocus}
          disabled={loading}
          errorState={errorState}
        />
      </Container>
      {meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  sourceCoin: PropTypes.string.isRequired,
  targetCoin: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  btcRates: PropTypes.object,
  ethRates: PropTypes.object,
  handleChangeSource: PropTypes.func,
  handleChangeTarget: PropTypes.func,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func
}

export default CoinConvertor
