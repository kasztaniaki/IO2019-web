<template>
  <div>
    <div class="level">
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="users" :loading="isLoading" :selected.sync="selectedRow" :row-class="rowClass">
      <template slot-scope="props" class="row">
        <b-table-column field="Name" label="Name">
            <div class="row">
                {{props.row.Name}}
            </div>
        </b-table-column>
        <b-table-column field="Surname" label="Surname">
            <div class="row">
            {{props.row.Surname}}
            </div>

        </b-table-column>
        <b-table-column centered="true" field="Buttons" width="50">
            <div class="button-padding">
                <b-button v-show="props.row==selectedRow"
                size="is-small"
                icon-left="trash"
                class="is-danger"></b-button>
            </div>
        </b-table-column>

      </template>
    </b-table>
  </div>
</template>

<script>

import { resetDBReq } from '@/api'

export default {
  methods: {
    loadUsers () {
      this.isLoading = false // change to true
      for (const user of this.users) {
        this.$set(user, 'buttonsVisible', false)
      }
      this.selectedRow = this.users[0]
    },
    rowClass (row, index) {
      if (this.selectedRow === row) return 'selected-row'
      else return ''
    },
    resetDB () {
      resetDBReq().then(response => {
        this.$toast.open({
          message: `Db reset`,
          position: 'is-bottom',
          type: 'is-success'
        })
      })
        .catch(error => {
          if (error) {
            this.$toast.open({
              message: `db reset error`,
              position: 'is-bottom',
              type: 'is-success'
            })
          }
        })
    }
  },
  data () {
    const users = [
      {
        Name: 'Łukasz',
        Surname: 'Zając'
      },
      {
        Name: 'Krystian',
        Surname: 'Ziaja'
      }
    ]
    return {
      selectedRow: null,
      users: users,
      isLoading: false
    }
  },
  mounted () {
    this.loadUsers()
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.selected-row{
  background-color: $selected !important;
  color: $dark !important;
}
.row {
    padding: 4px;
}
.button-padding {
    padding-top: 3px;
}
</style>
