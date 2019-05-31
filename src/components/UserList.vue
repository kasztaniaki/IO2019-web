<template>
  <div>
    <b-table class="container" :data="users" :loading="isLoading" :selected.sync="selectedRow" :row-class="rowClass">
      <template slot-scope="props" class="row">
        <b-table-column field="Name" label="Name" style="width: 30%">
            <div class="row">
              {{props.row.Name}} {{props.row.Surname}}
            </div>
        </b-table-column>
        <b-table-column field="Email" label="Email" style="width: 30%">
            <div class="row">
              {{props.row.Email}}
            </div>
        </b-table-column>
        <b-table-column label="Role">
            <div class="row">
              {{(props.row.IsAdmin) ? 'Administrator' : 'User'}}
            </div>
        </b-table-column>
        <b-table-column centered numeric field="Buttons" label="" width="90">
              <div class="buttons button-margin">
                 <b-button v-show="props.row==selectedRow" @click.native="editUser(props.row)"
                size="is-small"
                icon-left="pen"
                class="is-info"></b-button>
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
import EditUser from '@/components/EditUser.vue'

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
    removeUser (user) {
      this.$dialog.confirm({
        title: 'Deleting user',
        message: `Are you sure you want to <b>delete</b> user: ${user.Email}? This action cannot be undone.`,
        confirmText: 'Delete User',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => removeUserReq(user.Email)
          .then(response => {
            this.loadUsers()
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    editUser (user) {
      this.$modal.open({
        parent: this,
        component: EditUser,
        props: {
          userEmail: user.Email
        },
        events: {
          'close': () => {
            this.loadUsers()
          }
        }
      })
    },
    rowClass (row, index) {
      if (this.selectedRow === row) return 'selected-row'
      else return ''
    }
  },
  data () {
    return {
      selectedRow: null,
      users: [],
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
.button-margin {
    margin-top: 3px;
}
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
