import instance from './axiosInstance'

const getCoins = async (n = 4) => {
  const coins = []
  for (let i = 1; i <= n; i++) {
    const req = await instance({
      method: 'GET',
      url: `/coins/markets?vs_currency=usd&per_page=250&page=${i}`,
    })

    coins.push(...req.data)
  }
  return coins
}

export default getCoins
