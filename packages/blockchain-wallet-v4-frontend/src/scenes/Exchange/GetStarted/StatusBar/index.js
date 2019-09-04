import React from 'react'

import GetStarted from './Statuses/GetStarted'
import InProgress from './Statuses/InProgress'
import Pending from './Statuses/Pending'
import Rejected from './Statuses/Rejected'
import UnderReview from './Statuses/UnderReview'

const Status = ({ step }) => (
  <>
    {step === 'getstarted' && <GetStarted />}
    {step === 'inprogress' && <InProgress />}
    {step === 'pending' && <Pending />}
    {step === 'underreview' && <UnderReview />}
    {step === 'rejected' && <Rejected />}
  </>
)

export default Status
