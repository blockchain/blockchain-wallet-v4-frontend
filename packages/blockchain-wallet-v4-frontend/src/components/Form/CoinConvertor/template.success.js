import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, TextInput, Text } from 'blockchain-info-components'

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
  justify-content: space-between;
  align-items: center;
  width: 100%;

  & > :first-child { width: 45%; }
  & > :last-child { width: 45%; }
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.center ? 'center' : 'flex-start'};
  align-items: flex-start;
  height: auto;
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-top: 1px solid ${props => props.theme['gray-2']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
  ${props => props.fiat && 'border-top: none;'}

  & > input { border: none; }
`
const Unit = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 60px;
  font-size: 13px;
  font-weight: 300;
  color: ${props => props.theme['gray-4']};
`
const Error = styled(Text)`
  position: absolute;
  display: block;
  top: -18px;
  right: 0;
  height: 15px;
`

const getErrorState = (meta) => {
  return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
}

const CoinConvertor = (props) => {
  const { coin1, coin2, fiat1, fiat2, coin1Unit, coin2Unit, currency, meta, ...rest } = props
  const { handleChangeCoin1, handleChangeCoin2, handleChangeFiat1, handleChangeFiat2 } = rest
  const errorState = getErrorState(meta)

  return (
    <Wrapper>
      <Row>
        <Column>
          <Container>
            <TextInput onChange={handleChangeCoin1} value={coin1} errorState={errorState} />
            <Unit>{coin1Unit}</Unit>
          </Container>
          <Container fiat>
            <Unit>{currency}</Unit>
            <TextInput onChange={handleChangeFiat1} value={fiat1} />
          </Container>
        </Column>
        <Column center>
          <Icon name='right-arrow' size='24px' />
        </Column>
        <Column>
          <Container>
            <TextInput onChange={handleChangeCoin2} value={coin2} errorState={errorState} />
            <Unit>{coin2Unit}</Unit>
          </Container>
          <Container fiat>
            <Unit>{currency}</Unit>
            <TextInput onChange={handleChangeFiat2} value={fiat2} />
          </Container>
        </Column>
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
      <Row>
        {meta.touched && meta.error && <Error size='13px' weight={300} color='error'>{meta.error}</Error>}
      </Row>
    </Wrapper>
  )
}

CoinConvertor.propTypes = {
  coin1: PropTypes.string.isRequired,
  coin2: PropTypes.string.isRequired,
  fiat1: PropTypes.string.isRequired,
  fiat2: PropTypes.string.isRequired,
  coin1Unit: PropTypes.string.isRequired,
  coin2Unit: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  handleChangeCoin1: PropTypes.func.isRequired,
  handleChangeCoin2: PropTypes.func.isRequired,
  handleChangeFiat1: PropTypes.func.isRequired,
  handleChangeFiat2: PropTypes.func.isRequired
}

export default CoinConvertor
