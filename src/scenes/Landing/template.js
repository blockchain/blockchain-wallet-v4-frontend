import React from 'react'

import Main from './Main'
import NewToBitcoin from './NewToBitcoin'
import Reviews from './Reviews'
import WhyUseBlockchain from './WhyUseBlockchain'

import style from './style.scss'

const Landing = () => {
  return (
    <div className={style.landing}>
      <Main />
      {/*<NewToBitcoin />
      <Reviews />
      <WhyUseBlockchain />*/}
    </div>
  )
}

export default Landing
