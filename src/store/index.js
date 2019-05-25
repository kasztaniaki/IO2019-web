import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { authenticate, register, updatePassword, editUser, checkUser } from '@/api'
import EventBus, { isValidJwt } from '@/components/EventBus'

Vue.use(Vuex)

const state = {
  userData: {}, // todo dehardcode
  jwt: {}
}

const actions = {
  login (context, userData) {
    console.log('EMAIL PRZED SETEM ' + state.userData.email)
    context.commit('setUserData', userData)
    console.log('USERDATA ' + userData)
    var myCurrent = store.getters.getUserData
    console.log('EMAIL PO SETCIE ' + myCurrent.email)
    return authenticate(userData)
      .then(response => {
        console.log('RESPONSE ' + response)
        console.log('DATA ' + response.data)
        context.commit('setJwtToken', response.data)
        var current = store.getters.getJwt
        console.log('JWT PO LOGINIE ' + current)
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
    // context.commit('setUserData', { userData }) //todo commented because I think it is done in the login() method
    console.log(userData)
    console.log({ email: state.userData.email })
    return register(userData)
      .then(context.dispatch('login', { email: userData.email, password: userData.password }))
      .catch(error => {
        console.log('Error Registering: ', error)
        EventBus.emit('failedRegistering: ', error)
      })
  },
  editUser (context, userData) {
    console.log(userData)
    return authenticate({ email: store.getters.getUserData.email, password: userData.current_password }) // weryfy with the old password
      .then(res => {
        console.log('TUUUU!!!!')
        return editUser({ email: store.getters.getUserData.email, new_name: userData.new_name, new_surname: userData.new_surname, new_password: userData.new_password })
          .then(console.log('OK!!!'))
          // newResponse => context.commit('setJwtToken', { jwt: newResponse.data })
          .catch(error => {
            console.log('Error while changing user data: ', error)
            EventBus.emit('failedChangingUserData: ', error)
          })
      })
      .catch(error => {
        console.log('Old password does not match: ', error)
        EventBus.emit('failedChangingPassword: ', error)
      })
  },
  logout (context) {
    // WROCTU wywolanie this.$store.dispatch('logout') + zeby guzik do logowania dzialal + naprawic ten warn z navbarem
    context.commit('clearJwtToken')
    context.commit('clearUserData')
  }
}

const mutations = {
  setUserData (state, payload) {
    console.log('setUserData payload = ', payload)
    state.userData.email = payload.email
  },
  setJwtToken (state, payload) {
    console.log('setJwtToken payload = ', payload)
    localStorage.setItem('token', payload)
    console.log('SAMO JTW ', payload)
    console.log('TYP JTW ', typeof (payload))
    state.jwt.token = payload
  },
  clearJwtToken (state) {
    localStorage.removeItem('token')
    state.jwt.token = ''
    console.log(state.jwt.token)
  },
  clearUserData (state) {
    state.userData.email = ''
    console.log(state.userData.email)
  }
}

const getters = {
  isAuthenticated (state) {
    return isValidJwt(state.jwt.token)
  },
  getUserData (state) { //todo 2505 sprawdz co tego uzywa i napraw
    return state.userData
  },
  getJwt (state) {
    return state.jwt.token
  }
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  plugins: [createPersistedState()]
})

export default store
