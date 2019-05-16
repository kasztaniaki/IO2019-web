import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000'

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
