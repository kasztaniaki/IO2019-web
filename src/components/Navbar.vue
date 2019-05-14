<template>
    <nav class="navbar level container" role="navigation" aria-label="main navigation">
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <router-link to="/">Home</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/pools">Pools</router-link>
          </a>
        </div>
        <div v-if="auth==''" class="navbar-end">
                <a class="navbar-item">
                    <router-link to="/users/signup">Sign up</router-link>
                </a>
                <a class="navbar-item">
                    <router-link to="/users/signin">Log in</router-link>
                </a>
        </div>
        <div v-if="auth=='loggedin'" class="navbar-end">
                <!-- <a class="navbar-item">
                    <router-link to="/users/signup">Account</router-link>
                </a> -->

                <b-dropdown                    
                    v-model="navigation"
                    position="is-bottom-left"
                    aria-role="menu">
                    <a
                        class="navbar-item"
                        slot="trigger"
                        role="button">
                        <span>Account</span>
                        <b-icon icon="menu-down"></b-icon>
                    </a>

                    <b-dropdown-item custom aria-role="menuitem">
                        Logged as <b>Rafael Beraldo</b>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item has-link aria-role="menuitem">
                        <a href="https://google.com" target="_blank">
                            <b-icon icon="link"></b-icon>
                            Change password
                        </a>
                    </b-dropdown-item>
                    <b-dropdown-item value="home" aria-role="menuitem">
                        <b-icon icon="home"></b-icon>
                        Report issue
                    </b-dropdown-item>
                    <b-dropdown-item value="products" aria-role="menuitem">
                        <b-icon icon="cart"></b-icon>
                        Products
                    </b-dropdown-item>
                    <b-dropdown-item value="blog" disabled aria-role="menuitem">
                        <b-icon icon="book-open"></b-icon>
                        Blog
                    </b-dropdown-item>
                    <hr class="dropdown-divider" aria-role="menuitem">
                    <b-dropdown-item value="settings">
                        <b-icon icon="settings"></b-icon>
                        Settings
                    </b-dropdown-item>
                    <b-dropdown-item value="logout" aria-role="menuitem">
                        <b-icon icon="logout"></b-icon>
                        Logout
                    </b-dropdown-item>
                </b-dropdown>
                <a class="navbar-item">
                    <router-link to="/">Log out</router-link>
                </a>
        </div>
     
      </div>
    </nav>
</template>
    

<script>
import 'mdi-vue/MenuDownIcon';

import EventBus from './EventBus'

EventBus.$on('logged-in', test => {
  console.log(test)
})

export default {
  data () {
    return {
      auth: '',
      user: ''
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('usertoken')
    }
  },
  mounted () {
    EventBus.$on('logged-in', status => {
      this.auth = status
    })
  }
}

</script>
