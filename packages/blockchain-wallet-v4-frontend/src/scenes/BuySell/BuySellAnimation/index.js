import React from 'react'
import styled from 'styled-components'
import { path } from 'ramda'

import { Image } from 'blockchain-info-components'
import {
  balloon,
  balloonDelay1,
  balloonDelay2,
  drone,
  droneDelay1,
  droneDelay2,
  flight,
  flightDelay1,
  flightDelay2
} from './animations'

const Wrapper = styled.div`
  overflow: hidden;
  position: relative;
  margin-top: -56px;
`
const BaseColor = styled(Image)`
  left: 0;
  opacity: 0;
  position: absolute;
  transition: opacity 5s;
  &.active {
    opacity: 1;
  }
`
const Btc = styled.div`
  img {
    top: 0px;
    opacity: 0;
    width: 230px;
    position: absolute;
    animation: ${flight};
  }
  &.buy {
    .buy {
      opacity: 1;
    }
  }
  &.sell {
    .sell {
      opacity: 1;
    }
  }
  &.buy.sell {
    .buy {
      animation: ${flightDelay1};
    }
    .sell {
      animation: ${flightDelay2};
    }
  }
`
const Bch = styled.div`
  img {
    bottom: 0;
    opacity: 0;
    right: 50px;
    height: 100px;
    position: absolute;
    animation: ${balloon};
  }
  &.buy {
    .buy {
      opacity: 1;
    }
  }
  &.sell {
    .sell {
      opacity: 1;
    }
  }
  &.buy.sell {
    .buy {
      animation: ${balloonDelay1};
    }
    .sell {
      animation: ${balloonDelay2};
    }
  }
`
const Eth = styled.div`
  img {
    bottom: 0;
    opacity: 0;
    left: 40px;
    height: 60px;
    position: absolute;
    animation: ${drone};
  }
  &.buy {
    .buy {
      opacity: 1;
    }
  }
  &.sell {
    .sell {
      opacity: 1;
    }
  }
  &.buy.sell {
    .buy {
      animation: ${droneDelay1};
    }
    .sell {
      animation: ${droneDelay2};
    }
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

  static getDerivedStateFromProps (nextProps) {
    const sfoxCountries = path(
      ['options', 'platforms', 'web', 'sfox', 'countries'],
      nextProps
    )
    const coinifyCountries = path(
      ['options', 'platforms', 'web', 'coinify', 'countries'],
      nextProps
    )

    switch (true) {
      case sfoxCountries.includes(nextProps.country): {
        return {
          btc: 'buy sell',
          bch: '',
          eth: ''
        }
      }
      case coinifyCountries.includes(nextProps.country): {
        return {
          btc: 'buy sell',
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

  componentDidMount () {
    setTimeout(() => this.setState({ base: true }), 1)
  }

  render () {
    const { base, btc, bch, eth } = this.state

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
        <Eth className={eth}>
          <Image name='buy-sell-buy-eth' className='buy' />
          <Image name='buy-sell-sell-eth' className='sell' />
        </Eth>
      </Wrapper>
    )
  }
}

export default BuySellAnimation
