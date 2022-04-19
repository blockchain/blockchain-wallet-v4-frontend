export const getData = () => {
  return Object.keys(window.coins).filter((value) => {
    const { products, type } = window.coins[value].coinfig
    return (
      (products.includes('PrivateKey') ||
        products.includes('CustodialWalletBalance') ||
        products.includes('DynamicSelfCustody')) &&
      type.name !== 'FIAT'
    )
  })
}

export default getData
