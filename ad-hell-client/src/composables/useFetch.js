import axios from "axios"

export function useFetch() {
  const get = (url, params) => axios.get(url, { params })
  const post = (url, data) => axios.post(url, data)
  return { get, post }
}
