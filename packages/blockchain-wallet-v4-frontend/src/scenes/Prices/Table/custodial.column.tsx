export const getCustodialColumn = () => ({
  accessor: 'custodial',
  id: 'custodial',
  sortType: (a, b, id) => {
    const isCustodialA = a.original[id]
    const isCustodialB = b.original[id]

    return isCustodialA === isCustodialB ? 0 : isCustodialA ? 1 : -1
  }
})
