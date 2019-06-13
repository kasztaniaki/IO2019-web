<template>
    <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Issue for <b>{{ this.PoolName }}</b></p>
    </header>
    <section class="modal-card-body">
      <b-field label="Subject">
        <b-input v-model="subject"></b-input>
      </b-field>

      <b-field label="Message">
        <b-input v-model="message" maxlength="500" type="textarea"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <b-button
        class="button level-left"
        type="is-regular"
        icon-left="envelope"
        :disabled="message === '' || subject === ''"
        @click="saveForm()">
          Send
      </b-button>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    PoolID: {
      type: String
    },
    PoolName: {
      type: String
    }
  },
  data () {
    return {
      subject: '',
      message: ''
    }
  },
  methods: {
    saveForm () {
      const issueProps = {
        Email: this.$store.getters.getUserData.email,
        PoolID: this.PoolID,
        Subject: this.subject,
        Message: this.message,
        CreationDate: Date.now()
      }

      this.$emit('saveIssue', issueProps)
      this.$emit('close')
    }
  }
}
</script>
