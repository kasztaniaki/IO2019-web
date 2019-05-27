import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { authenticate, register, editUser } from '@/api'
import EventBus, { isValidJwt } from '@/components/EventBus'

Vue.use(Vuex)

const state = {
  userData: {
    email: '',
    name: '',
    surname: '',
    isAdmin: ''
  },
  jwt: {
    token: ''
  }
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
        console.log(':::::::::TOKEN ' + response.data.Token)
        context.commit('setJwtToken', response.data.Token)
        console.log('TOKEN PO SETCIE ' + store.getters.getJwt)

        console.log(':::::::::NAME ' + response.data.UserData.Name)
        context.commit('setName', response.data.UserData.Name)
        console.log('NAME PO SETCIE ' + store.getters.getUserData.name)

        console.log(':::::::::SURNAME ' + response.data.UserData.Surname)
        context.commit('setSurname', response.data.UserData.Surname)
        console.log('SURNAME PO SETCIE ' + store.getters.getUserData.surname)


        console.log(':::::::::ISADMIN ' + response.data.UserData.IsAdmin)
        context.commit('setIsAdmin', response.data.UserData.IsAdmin)
        console.log('ISADMIN PO SETCIE ' + store.getters.getUserData.isAdmin)

        var current = store.getters.getJwt
        console.log('JWT PO LOGINIE ' + current)
        // var adminField = store.getters.getIsAdmin //todo uncomment
        // console.log('JWT PO LOGINIE ' + adminField) //todo uncomment
      })
      .catch(error => {
        console.log('Error Authenticating: ', error)
        EventBus.emit('failedAuthentication', error)
      })
  },
  register (context, userData) {
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
    console.log("~~~~~EMAIL " + store.getters.getUserData.email)
    console.log("~~~~~~PASSWORD " + userData.current_password)
    // return authenticate({ email: store.getters.getUserData.email, password: userData.current_password }) // weryfy with the old password
      // .then(res => {
        // todo when in admin mode sendemail should be the email of the person who is updated
        return editUser({ email: store.getters.getUserData.email, new_name: userData.new_name, new_surname: userData.new_surname, new_password: userData.new_password, is_admin: userData.isAdmin, new_email: userData.new_email })
          .then(console.log('OK'))
          .catch(error => {
            console.log('Error while changing user data: ', error)
            EventBus.emit('failedChangingUserData: ', error)
          })
      // })
      // .catch(error => {
        // console.log('Old password does not match: ', error)
        EventBus.emit('failedChangingPassword: ', error)
      // })
  },
  logout (context) {
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
    // localStorage.setItem('token', payload)
    console.log('SAMO JTW ', payload)
    console.log('TYP JTW ', typeof (payload))
    state.jwt.token = payload
  },
  setIsAdmin (state, payload) {
    console.log('SET ADMIN payload = ', payload)
    state.userData.isAdmin = payload
    console.log('ADMIN FIELD AFTER SET = ', store.getters.getUserData.isAdmin)
  },
  setName (state, payload) {
    console.log('SET NAME payload = ', payload)
    state.userData.name = payload
    console.log('NAME FIELD AFTER SET = ', store.getters.getUserData.name)
  },
  setSurname (state, payload) {
    console.log('SET SURNAME payload = ', payload)
    state.userData.surname = payload
    console.log('SURNAME FIELD AFTER SET = ', store.getters.getUserData.surname)
  },
  clearJwtToken (state) {
    // localStorage.removeItem('token')
    state.jwt.token = ''
    console.log(':::::TOKEN AFTER CLEAN ' + state.jwt.token)
  },
  clearUserData (state) {
    state.userData.email = ''
    console.log(state.userData.email)
    state.userData.name = ''
    state.userData.surname = ''
    state.userData.isAdmin = ''
  }
}

const getters = {
  isAuthenticated (state) {
    return isValidJwt(store.getters.getJwt)
  },
  getUserData (state) {
    return state.userData
  },
  getJwt (state) {
    return state.jwt.token
  },
  getIsAdmin (state) {
    return Boolean(state.userData.isAdmin)
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
