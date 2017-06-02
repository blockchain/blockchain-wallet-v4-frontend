import React from 'react'

import style from './style.scss'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

const Home = (props) => {
  return (
    <section className={style.home}>
      <ActivityList activities={props.activities} />
      <BalanceSummary />
      <DidYouKnow />
    </section>
  )
}

export default Home
