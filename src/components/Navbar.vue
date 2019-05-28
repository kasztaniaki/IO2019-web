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
                        <!-- <router-link to="/users/password"> -->
                          <b-icon pack="fas" icon="lock" size="is-small"></b-icon>
                          Edit profile
                        <!-- </router-link> -->
                    </b-dropdown-item>
                    <b-dropdown-item value="home" aria-role="menuitem">
                        <b-icon pack="fas" icon="at" size="is-small"></b-icon>
                        Contact admin
                    </b-dropdown-item>
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
      contactAdminIcon: 'at'
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
    }
  }
}
</script>
