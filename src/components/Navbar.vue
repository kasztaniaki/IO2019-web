<template>
    <nav class="navbar level container" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
          <router-link class="navbar-item" to="/"><img src="../assets/logo.png" width="50" height="28"></router-link>

        <a role="button" :class="navbarActive" @click="toggle=!toggle" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbar-list">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbar-list" :class="navbarActive" class="navbar-menu">
        <div v-if="isAuthenticated" class="navbar-start">
            <router-link class="navbar-item" to="/pools">Pools</router-link>
            <router-link class="navbar-item" to="/reservations">Reservations</router-link>
            <router-link v-if="isAdmin" class="navbar-item" to="/admin/users">Users</router-link>
            <router-link class="navbar-item" to="/issues">Issues</router-link>
        </div>
        <div v-if="!isAuthenticated" class="navbar-end">
                <a class="navbar-item">
                    <router-link to="/users/signup">Sign up</router-link>
                </a>
                <a class="navbar-item">
                    <router-link to="/users/signin">Log in</router-link>
                </a>
        </div>
        <div v-if="isAuthenticated" class="navbar-end">
                <b-dropdown
                    position="is-bottom-left"
                    aria-role="menu">
                    <a
                        class="navbar-item"
                        slot="trigger"
                        role="button">
                        <span>Menu </span>
                        <b-icon pack="fas" icon="caret-down" size="is-small"></b-icon>
                    </a>

                    <b-dropdown-item custom aria-role="menuitem">
                        Logged as <b>{{ getFirstName }} {{getLastName}}</b>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item @click="editUserData()" aria-role="menuitem">
                          <b-icon pack="fas" icon="lock" size="is-small"></b-icon>
                          Edit profile
                    </b-dropdown-item>
                    <!-- <b-dropdown-item value="home" aria-role="menuitem">
                        <b-icon pack="fas" icon="at" size="is-small"></b-icon>
                        Contact admin
                    </b-dropdown-item> -->
                </b-dropdown>

                <a class="navbar-item">
                    <a class="nav-link" href="" @click="logout()">Log out</a>
                </a>
        </div>

      </div>
    </nav>
</template>

<script>
import EditUser from '@/components/EditUser.vue'

export default {
  data () {
    return {
      menuIcon: 'caret-down',
      changePasswordIcon: 'lock',
      contactAdminIcon: 'at',
      toggle: false
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
      // .then(() => this.$router.push('/users/signin'))
    },
    editUserData () {
      this.$modal.open({
        parent: this,
        component: EditUser,
        props: {
          userEmail: this.getEmail
        },
        width: 720
      })
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    getEmail () {
      return this.$store.getters.getUserData.email
    },
    getFirstName () {
      return this.$store.getters.getUserData.name
    },
    getLastName () {
      return this.$store.getters.getUserData.surname
    },
    navbarActive () {
      return this.toggle ? 'is-active' : ''
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin
    }
  }
}
</script>
<style lang="scss">
@import "@/variables.scss";

.router-link-exact-active{
  background-color: $primary !important;
  color: white !important;
}
</style>
