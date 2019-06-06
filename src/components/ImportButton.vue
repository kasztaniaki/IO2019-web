<template>
    <b-upload v-model="file" accept=".csv">
      <a class="button is-primary">
        <b-icon icon="upload" size="is-small"></b-icon>
        <span>Import CSV</span>
      </a>
    </b-upload>
</template>

<script>
import ImportErrors from '@/components/ImportErrors.vue'
import { importFile } from '@/api'
export default {
  data () {
    return {
      file: null
    }
  },
  methods: {
    sendRequest (isForced) {
      this.$parent.isLoading = true
      let fileData = new FormData()
      fileData.append('pools_csv', this.file)
      importFile(fileData, isForced)
        .then(response => {
          this.$toast.open({
            message: `File loaded succesfully`,
            position: 'is-top',
            type: 'is-success'
          })
          this.$emit('import')
        })
      // eslint-disable-next-line
          .catch(error => {
          if (error) {
            this.$toast.open({
              message: `Error`,
              position: 'is-top',
              type: 'is-danger'
            })
            this.$modal.open({
              parent: this,
              component: ImportErrors,
              props: {
                import_errors: error.response.data.errors[0]
              },
              events: {
                'force': () => {
                  this.sendRequest(true)
                }
              }
            })
            this.$parent.isLoading = false
            // this.file = null
          }
        })
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      if (newValue !== null) {
        this.sendRequest(false)
      }
    }
  }
}
</script>
