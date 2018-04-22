import React from 'react'
import styled from 'styled-components'
import { Image } from 'blockchain-info-components'
import { balloon, balloonDelay1, balloonDelay2, flight, flightDelay1, flightDelay2 } from './keyframes'

const Wrapper = styled.div`
  overflow: hidden;
  position: relative;
`
const BaseColor = styled(Image)`
  left: 0;
  opacity: 0;
  position: absolute;
  transition: opacity 5s;
  &.active { opacity: 1; }
`
const Btc = styled.div`
  img {
    top: 0px;
    opacity: 0;
    width: 230px;
    position: absolute;
    animation: ${flight} 10s infinite linear;
  }
  &.buy { .buy { opacity: 1; } }
  &.sell { .sell { opacity: 1; } }
  &.buy.sell {
    .buy { animation: ${flightDelay1} 20s infinite linear; }
    .sell { animation: ${flightDelay2} 20s infinite linear; }
  }
`
const Bch = styled.div`
  img {
    bottom: 0;
    opacity: 0;
    right: 50px;
    height: 100px;
    position: absolute;
    animation: ${balloon} 10s infinite linear;
  }
  &.buy { .buy { opacity: 1; } }
  &.sell { .sell { opacity: 1; } }
  &.buy.sell {
    .buy { animation: ${balloonDelay1} 20s infinite linear; }
    .sell { animation: ${balloonDelay2} 20s infinite linear; }
  }
`

class BuySellAnimation extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      base: false,
      btc: '',
      bch: '',
      eth: ''
    }
  }

  componentDidMount () {
    setTimeout(() => this.setState({ base: true }), 1)
  }

  static getDerivedStateFromProps (nextProps) {
    const sfoxCountries = nextProps.options.platforms.web.sfox.countries
    const unocoinCountries = nextProps.options.platforms.web.unocoin.countries
    const coinifyCountries = nextProps.options.platforms.web.coinify.countries

    switch (true) {
      case sfoxCountries.indexOf(nextProps.country) >= 0: {
        return {
          btc: 'buy sell',
          bch: '',
          eth: ''
        }
      }
      case coinifyCountries.indexOf(nextProps.country) >= 0: {
        return {
          btc: 'buy sell',
          bch: '',
          eth: ''
        }
      }
      case unocoinCountries.indexOf(nextProps.country) >= 0: {
        return {
          btc: 'buy',
          bch: '',
          eth: ''
        }
      }
      default: {
        return {
          btc: 'buy sell',
          bch: 'buy sell',
          eth: 'buy sell'
        }
      }
    }
  }

  render () {
    const { base, btc, bch } = this.state

    return (
      <Wrapper>
        <Image name='buy-sell-grey' />
        <BaseColor name='buy-sell-color' className={base && 'active'} />
        <Btc className={btc}>
          <Image name='buy-sell-buy-btc' className='buy' />
          <Image name='buy-sell-sell-btc' className='sell' />
        </Btc>
        <Bch className={bch}>
          <Image name='buy-sell-buy-bch' className='buy' />
          <Image name='buy-sell-sell-bch' className='sell' />
        </Bch>
      </Wrapper>
    )
  }
}

export default BuySellAnimation
