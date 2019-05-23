<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left" :disabled="isLoading"/>
      <b-button v-if="editable" class="level-right" icon-left="plus" type="is-success" :disabled="isLoading" @click.native="showPoolForm()">New pool</b-button>
      <b-button @click="resetDB()">
        db reset
      </b-button>
    </div>
    <b-table class="container" :data="machines" :loading="isLoading" :selected.sync="selectedRow">
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
          <MachineDescription :description="props.row.InstalledSoftware" :expanded="props.row==selectedRow"/>
        </b-table-column>
        <b-table-column width="55" field="edit" :visible="editable">
          <div class="my-button">
            <b-button v-show="props.row==selectedRow" size="is-small" icon-left="edit" type="is-light" @click.native="showPoolForm(props.row.ID, props.row)"></b-button>
          </div>
          <b-button v-show="props.row==selectedRow" size="is-small" icon-left="trash" type="is-danger" @click.native="confirmPoolDelete(props.row.ID)"></b-button>
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
          this.isLoading = false
          this.machines = response.data.pools
          for (const pool of this.machines) {
            this.$set(pool.InstalledSoftware, 'expanded', false)
          }
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
      isLoading: false,
      selectedRow: null
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

<style lang="scss">
.my-button {
  padding-bottom: 10px;
  padding-top: 6px
}
</style>
