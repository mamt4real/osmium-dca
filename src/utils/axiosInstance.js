import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/',
})

instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
instance.defaults.headers.common['Access-Control-Allow-Headers'] =
  'Origin, X-Requested-With, Content-Type, Accept'

// instance.interceptors.request.use(
//   function (config) {
//     config.headers['authorization'] = `Bearer ${localStorage.getItem('token')}`
//     return config
//   },
//   (err) => Promise.reject(err)
// )
export default instance
