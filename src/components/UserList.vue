<template>
  <div>
    <div class="level">
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="users" :loading="isLoading" :selected.sync="selectedRow" :row-class="rowClass">
      <template slot-scope="props" class="row">
        <b-table-column field="Name" label="Name" width="300">
            <div class="row">
              {{props.row.Name}} {{props.row.Surname}}
            </div>
        </b-table-column>
        <b-table-column field="Email" label="Email" width="300">
            <div class="row">
              {{props.row.Email}}
            </div>
        </b-table-column>
        <b-table-column field="Admin" label="Admin">
            <div class="row">
              <b-icon
                id="enabled-icon"
                v-if="props.row.IsAdmin"
                pack="fas"
                icon="check-circle"
                size="is-small"
              ></b-icon>
              <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle" size="is-small"></b-icon>
            </div>
        </b-table-column>
        <b-table-column field="Buttons" width="50">
            <div class="button-padding">
                <b-button v-show="props.row==selectedRow" @click.native="removeUser(props.row)"
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

import { loadUsersReq, removeUserReq } from '@/api'

export default {
  methods: {
    loadUsers () {
      this.isLoading = true
      loadUsersReq().then(response => {
          this.isLoading = false
          console.log(response.data.users)
          this.users = response.data.users
        })
        .catch(error => {
          console.log(error)
        })
    }, 
    removeUser(user) {
      this.$dialog.confirm({
        title: 'Deleting user',
        message: `Are you sure you want to <b>delete</b> user: ${user.Email}? This action cannot be undone.`,
        confirmText: 'Delete User',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => removeUserReq(user.ID)
          .then(response => {
            this.loadUsers()
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    rowClass (row, index) {
      if (this.selectedRow === row) return 'selected-row'
      else return ''
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
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
