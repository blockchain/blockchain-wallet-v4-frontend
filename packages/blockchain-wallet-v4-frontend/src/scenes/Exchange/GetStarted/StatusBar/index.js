import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import GetStarted from './Statuses/GetStarted'
import InProgress from './Statuses/InProgress'
import Pending from './Statuses/Pending'
import Rejected from './Statuses/Rejected'
import UnderReview from './Statuses/UnderReview'

export const Status = ({ step }) => (
  <React.Fragment>
    {step === 'getstarted' && <GetStarted />}
    {step === 'inprogress' && <InProgress />}
    {step === 'pending' && <Pending />}
    {step === 'underreview' && <UnderReview />}
    {step === 'rejected' && <Rejected />}
  </React.Fragment>
)

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Status)
