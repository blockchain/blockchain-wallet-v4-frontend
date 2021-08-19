export const getData = () => {
  return Object.keys(window.coins).filter(
    (value) =>
      window.coins[value].coinfig.products.includes('PrivateKey') ||
      window.coins[value].coinfig.products.includes('CustodialWalletBalance')
  )
}

export default getData
