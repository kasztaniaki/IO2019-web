<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left" :disabled="isLoading"/>
      <b-button v-if="editable" class="level-right" icon-left="plus" type="is-success" :disabled="isLoading" @click.native="showPoolForm()">New pool</b-button>
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="machines" :columns="columns" :loading="isLoading">
      <template slot-scope="props">
        <b-table-column field="poolID" label="ID">{{props.row.ID}}</b-table-column>
        <b-table-column field="displayName" label="Name">{{props.row.Name}}</b-table-column>
        <b-table-column field="operatingSystem" label="OS">{{props.row.OSName}}</b-table-column>
        <b-table-column field="maximumCount" label="Maximum Count">{{props.row.MaximumCount}}</b-table-column>
        <b-table-column field="enabled" label="Enabled">
          <b-icon
            id="enabled-icon"
            v-if="props.row.Enabled"
            pack="fas"
            icon="check-circle"
            size="is-small"
          ></b-icon>
          <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle" size="is-small"></b-icon>
        </b-table-column>
        <b-table-column field="description" label="Description">
          <MachineDescription :description="props.row.InstalledSoftware"/>
        </b-table-column>
        <b-table-column field="edit" :visible="editable">
          <b-button icon-left="edit" type="is-light" @click.native="showPoolForm(props.row.ID, props.row)"></b-button>
        </b-table-column>
        <b-table-column field="remove" :visible="editable">
          <b-button icon-left="trash" type="is-danger" @click.native="confirmPoolDelete(props.row.ID)">
          </b-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
import ImportButton from '@/components/ImportButton.vue'
import EditPoolForm from '@/components/EditPoolForm.vue'
import { loadPoolsReq, addPoolReq, editPoolReq, removePoolReq, resetDBReq } from '@/api'

export default {
  methods: {
    loadMachinesData () {
      this.isLoading = true
      loadPoolsReq()
        .then(response => {
          console.log('omg to dziala')
          console.log(response.data.pools)
          console.log(response)
          this.isLoading = false
          this.machines = response.data.pools
        })
        .catch(error => {
          console.log(error)
        })
    },
    showPoolForm (poolId = '', poolProps = {}) {
      this.$modal.open({
        parent: this,
        component: EditPoolForm,
        hasModalCard: true,
        props: poolProps,
        events: {
          'poolRequest': (poolProps) => {
            if (poolId !== '') {
              this.editPool(poolId, poolProps)
            } else {
              this.addPool(poolProps)
            }
          }
        }
      })
    },
    confirmPoolDelete (poolId) {
      this.$dialog.confirm({
        title: 'Deleting pool',
        message: `Are you sure you want to <b>delete</b> pool ${poolId}? This action cannot be undone.`,
        confirmText: 'Delete Pool',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.removePool(poolId)
      })
    },
    addPool (poolProps) {
      addPoolReq(poolProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool added successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
    editPool (poolId, poolProps) {
      console.log(poolProps)
      editPoolReq(poolId, poolProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool edited successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
    },
    removePool (poolId) {
      removePoolReq(poolId).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool removed successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        // eslint-disable-next-line
        .catch(error => {
          this.$toast.open({
            message: `Error`,
            position: 'is-top',
            type: 'is-danger'
          })
        })
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
    return {
      machines: [],
      columns: [
        {
          field: 'poolID',
          label: 'ID',
          width: '40'
        },
        {
          field: 'displayName',
          label: 'Name'
        },
        {
          field: 'maximumCount',
          label: 'Maximum count'
        },
        {
          field: 'enabled',
          label: 'Enabled',
          centered: true
        },
        {
          field: 'description',
          label: 'Description'
        }
      ],
      isLoading: false
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  components: {
    MachineDescription,
    ImportButton,
    // eslint-disable-next-line
    EditPoolForm
  },
  props: {
    editable: {
      type: Boolean
    }
  }
}
</script>
