<template>
  <div class="modal-card" style="width: auto">
    <form>
      <header class="modal-card-head">
        <p class="modal-card-title">Update account data</p>
      </header>
      <section class="modal-card-body">
        <b-field>
          <p> Fill in only the fields you would like to update</p>
        </b-field>

        <b-field label="New password" :type="{'is-danger': errors.has('new-password')}" :message="errors.first('new-password')">
          <b-input autocomplete="new-password" placeholder="New password" type="password" v-model="new_password" name="new-password"
            v-validate="'min:8|max:80'" />
        </b-field>
        <b-field label="Updated first name" :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
          <b-input placeholder="Updated first name" v-model="new_name" name="name" v-validate="'required|alpha_spaces|max:80'" />
        </b-field>
        <b-field label="Updated last name" :type="{'is-danger': errors.has('surname')}" :message="errors.first('surname')">
          <b-input placeholder="Updated last name" v-model="new_surname" name="surname" v-validate="'required|alpha|max:80'" />
        </b-field>
        <div v-if="getIsAdmin">
          <b-field label="Updated email" :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
            <b-input placeholder="Updated email" type="text" v-model="new_email" name="email" v-validate="'required|email|max:80'" />
          </b-field>
          <b-checkbox v-model="is_admin">
            <b> Administrator privileges </b>
          </b-checkbox>

        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click.prevent="this.$emit('close')">Close</button>
        <button class="button is-primary" @click.prevent="validateBeforeSubmit()">Save</button>
        <button class="button is-danger" @click.prevent="deleteAccount()">Delete account</button>
      </footer>
    </form>
  </div>
</template>

<script>
import EventBus from './EventBus'
import { getUserReq } from '@/api'

export default {
  props: {
    userEmail: String
  },
  data () {
    return {
      new_password: null,
      new_name: null,
      new_surname: null,
      new_email: null,
      is_admin: null
    }
  },
  methods: {
    prompt () {
      this.$dialog.prompt({
        message: `Provide your current password`,
        inputAttrs: {
          placeholder: 'Password',
          type: 'password'
        },
        onConfirm: (value) => {
          this.$store.dispatch('editUser', {
            email: this.userEmail,
            current_password: value,
            new_password: this.new_password,
            new_name: this.new_name,
            new_surname: this.new_surname,
            new_email: this.new_email,
            is_admin: this.is_admin
          })
            .then(() => {
              this.$emit('close')
            })
        }
      })
    },
    validateBeforeSubmit () {
      this.$validator.validateAll()
        .then((result) => {
          if (!result) {
            this.$toast.open({
              message: 'Form is not valid! Please check the fields.',
              type: 'is-danger',
              position: 'is-top'
            })
          } else {
            this.prompt()
          }
        })
    },
    deleteAccount () {
      this.$dialog.prompt({
        title: 'Deleting account',
        message: 'Are you sure you want to <b>delete</b> your account? This action <b>cannot</b> be undone. To proceed, provide your password.',
        confirmText: 'Delete Account',
        type: 'is-danger',
        hasIcon: true,
        inputAttrs: {
          placeholder: 'Password',
          type: 'password'
        },
        onConfirm: (value) => {
          this.$store.dispatch('deleteAccount', value)
            .then(() => {
              this.$emit('close')
            })
        }
      })
    }
  },
  computed: {
    getIsAdmin () {
      return this.$store.getters.getIsAdmin
    }
  },
  mounted () {
    EventBus.$on('failedAuthentication', (error) => this.handleError(error))
    EventBus.$on('successfulDeletion', () => {
      this.$toast.open({
        message: `Account deleted!`,
        position: 'is-top',
        type: 'is-success'
      })
      this.$router.push('/')
    })
    getUserReq(this.userEmail)
      .then(response => {
        this.new_name = response.data.user.Name
        this.new_surname = response.data.user.Surname
        this.new_email = response.data.user.Email
        this.is_admin = response.data.user.IsAdmin
      })
  },
  beforeDestroy () {
    EventBus.$off('failedAuthentication')
    EventBus.$off('successfulDeletion')
  }
}
</script>
