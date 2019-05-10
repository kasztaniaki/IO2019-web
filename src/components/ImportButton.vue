<template>
  <b-field class="file">
    <b-upload v-model="file" accept=".csv">
      <a class="button is-primary">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </a>
    </b-upload>
  </b-field>
</template>

<script>
import ImportErrors from '@/components/ImportErrors.vue'
export default {
  data () {
    return {
      file: null,
      errors: [
        {
            "line": 3,
            "pool": "\"s7n-girls\",\"false\",\"View Agent (6.2.2) Firefox (55.0.3), Chrome (61.0), Flash (27.0.0), Libre Office (5.4.1.2), Adobe Reader DC (17.012), JRE (8u144)\"",
            "error": "warning",
            "info": "opis błędu opis błędu opis błędu"
        },
        {
            "line": 9,
            "pool": ":tutaj linijka z csv z błędem:",
            "error": "error",
            "info": "błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu opis błędu "
        },
        {
            "line": 14,
            "pool": ":tutaj linijka z csv z błędem:",
            "error": "warning",
            "info": ""
        }
      ]
    }
  },
  watch: {
    file: function (newValue, oldValue) {
      if (newValue !== null) {
        let fileData = new FormData()
        fileData.append('pools_csv', this.file)

        this.$http
          .post('http://127.0.0.1:5000/import', fileData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            this.$toast.open({
              message: `File loaded succesfully`,
              position: 'is-bottom',
              type: 'is-success'
            })
            this.$emit('import')
          })
          // eslint-disable-next-line
          .catch(error => {
            this.$toast.open({
              message: `Error`,
              position: 'is-bottom',
              type: 'is-danger'
            })
            this.$modal.open({
              parent: this,
              component: ImportErrors,
              props: {
                errors: this.errors
              }
            })
            this.file=null
          })
      }
    }
  },
  components: {
    ImportErrors
  }
}
</script>
