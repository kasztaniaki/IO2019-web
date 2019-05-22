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
          <a class="navbar-item">
            <router-link to="/admin/users">Users</router-link>
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
                    v-model="navigation"
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
                        Logged as <b>{{ getEmail }}</b>
                    </b-dropdown-item>
                    <hr class="dropdown-divider">
                    <b-dropdown-item has-link aria-role="menuitem">
                        <router-link to="/users/password">
                            <b-icon pack="fas" icon="lock" size="is-small"></b-icon>
                            Change password
                        </router-link>
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
        .then(() => this.$router.push('/users/signin'))
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated // if you want to simulate the logged state replace with: true
    },
    getEmail () {
      return this.$store.getters.getUserData.email
    }
  }
}
</script>
