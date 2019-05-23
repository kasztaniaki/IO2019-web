<template>
  <div>
    <div class="level">
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="users" :loading="isLoading" >
      <template slot-scope="props" class="row">
        <b-table-column @mouseover.native="showButtons(props.row)" @mouseleave.native="hideButtons(props.row)" field="Name" label="Name">
            <div class="row">
                {{props.row.Name}}
            </div>
        </b-table-column>
        <b-table-column @mouseover.native="showButtons(props.row)" @mouseleave.native="hideButtons(props.row)" field="Surname" label="Surname">
            <div class="row">
            {{props.row.Surname}}
            </div>

        </b-table-column>
        <b-table-column centered="true" @mouseover.native="showButtons(props.row)" @mouseleave.native="hideButtons(props.row)" field="Buttons" width="50">
            <div class="button-padding">
                <b-button v-show="props.row.buttonsVisible"
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
    },
    showButtons (row) {
      console.log('hejka')
      console.log(row)
      row.buttonsVisible = true
      console.log('hejka')
      console.log(row)
    },
    hideButtons (row) {
      row.buttonsVisible = false
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
      users: users,
      isLoading: false,
      selectedRow: users[0]
    }
  },
  mounted () {
    this.loadUsers()
  }
}
</script>

<style lang="scss">
.row {
    padding: 4px;
}
.button-padding {
    padding-top: 3px;
}
</style>
