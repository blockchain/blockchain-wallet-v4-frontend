import React from 'react'

const title = 'How much does it cost to send bitcoin?'

const content = (
  <span>
    While our wallet is entirely free to use, the small fee included in your transaction goes to the miners,
    who help power the flow of transactions on the Bitcoin network.
    To ensure your transactions confirm consistently and reliably, our wallet will automatically include an appropriate fee
    based on your transaction’s size and the level of network traffic at the time. Before you send your transaction,
    you can view the included fee that we recommend. If you wish to specify your own fee, you can do so under Advanced Send.
  </span>
)

export default {
  title, content
}
