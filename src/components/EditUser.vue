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
          <b-input placeholder="New password" type="password" v-model="new_password" name="new-password"
            v-validate="'min:8'" />
        </b-field>
        <b-field label="Updated first name" :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
          <b-input placeholder="Updated first name" v-model="new_name" name="name" v-validate="'alpha'" />
        </b-field>
        <b-field label="Updated last name" :type="{'is-danger': errors.has('surname')}" :message="errors.first('surname')">
          <b-input placeholder="Updated last name" v-model="new_surname" name="surname" v-validate="'alpha'" />
        </b-field>
        <div v-if="getIsAdmin">
          <b-field label="Updated email" :type="{'is-danger': errors.has('email')}" :message="errors.first('email')">
            <b-input placeholder="Updated email" type="text" v-model="new_email" name="email" v-validate="'email'" />
          </b-field>
          <b-checkbox v-model="is_admin">
            <b> Administrator privileges </b>
          </b-checkbox>

        </div>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Close</button>

        <button class="button is-primary" @click.prevent="validateBeforeSubmit()">Save</button>
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
              this.$toast.open({
                message: `Data changed succesfully!`,
                position: 'is-top',
                type: 'is-success'
              })
              this.$emit('edit')
            })
            .catch(error => {
              if (error) {
                this.$toast.open({
                  message: `Provided password is invalid!`,
                  position: 'is-top',
                  type: 'is-danger'
                })
              }
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
    }
  },
  computed: {
    getIsAdmin () {
      return this.$store.getters.getIsAdmin
    }
  },
  mounted () {
    EventBus.$on('failedRegistering', (msg) => {
      this.errorMsg = msg
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
    EventBus.$off('failedRegistering')
  }
}
</script>
