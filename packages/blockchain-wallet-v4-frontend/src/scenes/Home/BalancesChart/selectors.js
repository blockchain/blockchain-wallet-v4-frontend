import { Remote } from 'blockchain-wallet-v4/src'

const categories = ['Bitcoin', 'Ether', 'Bitcoin Cash']
const data = [{
  y: 56.33
}, {
  y: 10.38
}, {
  y: 24.03
}]
const coinData = []
const dataLen = data.length

// Build the data arrays
for (var i = 0; i < dataLen; i += 1) {
  // add coin data
  coinData.push({
    name: categories[i],
    y: data[i].y,
    color: data[i].color
  })
}
export const getData = (state) => (Remote.of(coinData))
