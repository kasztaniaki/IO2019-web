import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

// WROCTU w register userData to: imie, nazwisko, email i haslo
// a w authenticate powinno byc tylko email i haslo

export function authenticate (userData) {
  return axios.post(`${API_URL}/users/signin`, userData)
}

export function register (userData) {
  return axios.post(`${API_URL}/users/signup`, userData)
}

export function updatePassword (userData) {
  return axios.post(`${API_URL}/users/password`, userData)
}

export function importFile (fileData, isForced) {
  return axios.post(`${API_URL}/import`, fileData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: {
      force: isForced
    }
  })
}

export function loadPoolsReq () {
  return axios.get('http://127.0.0.1:5000/pools')
}

export function addPoolReq (poolProps) {
  return axios.post('http://127.0.0.1:5000/add_pool', poolProps, {
    headers: { 'Content-Type': 'application/json' }
  })
}

export function editPoolReq (poolId, poolProps) {
  return axios.post('http://127.0.0.1:5000/edit_pool', poolProps, {
    params: { id: poolId },
    headers: { 'Content-Type': 'application/json' }
  })
}

export function removePoolReq (poolId) {
  return axios.get('http://127.0.0.1:5000/remove_pool', {
    params: { id: poolId }
  })
}

export function resetDBReq () {
  return axios.get('http://127.0.0.1:5000/init_db')
}
