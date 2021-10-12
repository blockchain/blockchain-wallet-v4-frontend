export const getData = () => {
  console.log('HERE')
  return Object.keys(window.coins).filter((value) => {
    const { products, type } = window.coins[value].coinfig
    return (
      !products.includes('PrivateKey') &&
      products.includes('CustodialWalletBalance') &&
      type.name !== 'FIAT'
    )
  })
}

export default getData
