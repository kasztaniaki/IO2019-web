<template>
  <div class="container">
    <!-- <div class="form_styling"> -->

    <div class="modal-card" style="width: auto">
      <form @submit.prevent="validateBeforeSubmit">
        <header class="modal-card-head">
          <p class="modal-card-title">Update your account data</p>
        </header>
        <!-- <p class="message"> Update your account data </p> -->

        <section class="modal-card-body">
          <p> Fill in only the fields you would like to update</p>

          <b-field :type="{'is-danger': errors.has('new-password')}" :message="errors.first('new-password')">
            <b-input placeholder="New password" type="password" v-model="new_password" name="new-password"
              v-validate="'min:8'" />
          </b-field>
          <b-field :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
            <b-input placeholder="Updated first name" v-model="new_name" name="name" v-validate="'alpha'" />
          </b-field>
          <b-field :type="{'is-danger': errors.has('surname')}" :message="errors.first('surname')">
            <b-input placeholder="Updated last name" v-model="new_surname" name="surname" v-validate="'alpha'" />
          </b-field>
          <!-- <b-field :type="{'is-danger': errors.has('confirm-password')}" :message="[{'The confirm password field is required' : errors.firstByRule('confirm-password', 'required'),
                'The confirm password is not valid' : errors.firstByRule('confirm-password', 'is')}]">
          <b-input placeholder="Confirm new password" type="password" v-model="confirmnew_password" name="confirm-password"
            v-validate="{ required: true, is: new_password }" />
        </b-field> -->
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="$parent.close()">Close</button>

          <button type="submit" class="button is-primary" @click="prompt()">Save</button>
        </footer>
      </form>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import EventBus from './EventBus'

export default {
  data () {
    return {
      old_password: null,
      new_password: null,
      new_name: null,
      new_surname: null
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
            current_password: value,
            new_password: this.new_password,
            new_name: this.new_name,
            new_surname: this.new_surname
          })
            .then(() => this.$router.push('/'))
        }
      })
    },
    // editUser () {
    //   this.$store.dispatch('editUser', {
    //     old_password: this.old_password,
    //     new_password: this.new_password,
    //     new_name: this.new_name,
    //     new_surname: this.new_surname
    //   })
    //     .then(() => this.$router.push('/'))
    // },
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$toast.open({
            message: 'Form is valid!',
            type: 'is-success',
            position: 'is-bottom'
          })
          return
        }
        this.$toast.open({
          message: 'Form is not valid! Please check the fields.',
          type: 'is-danger',
          position: 'is-bottom'
        })
      })
    }
  },
  mounted () {
    EventBus.$on('failedRegistering', (msg) => {
      this.errorMsg = msg
    })
  },
  beforeDestroy () {
    EventBus.$off('failedRegistering')
  }
}

</script>

<style lang="scss">
  // .modal-background{
  //   background: blue
  // }

</style>
