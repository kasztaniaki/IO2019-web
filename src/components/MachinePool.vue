<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left" :disabled="isLoading"/>
      <b-button v-if="editable" class="level-right" icon-left="plus" type="is-success" :disabled="isLoading" @click.native="showPoolForm()">New pool</b-button>
    </div>
    <b-table class="container" :data="data.machines" :columns="columns" :loading="isLoading">
      <template slot-scope="props">
        <b-table-column field="poolID" label="ID">
          {{props.row.ID}}
        </b-table-column>
        <b-table-column field="displayName" label="Name">
          {{props.row.Name}}
        </b-table-column>
        <b-table-column field="operatingSystem" label="OS">
          <div class="columns is-vcentered">
            <div class="column">
              {{props.row.OSName}}
            </div>
          </div>
        </b-table-column>
        <b-table-column field="maximumCount" label="Maximum Count">
          {{props.row.MaximumCount}}
        </b-table-column>
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

export default {
  methods: {
    loadMachinesData () {
      this.isLoading = true

      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          console.log(response.data.pools)

          this.data.machines = response.data.pools
          this.isLoading = false
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
      this.$http
        .post('http://127.0.0.1:5000/add_pool', poolProps, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
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
      this.$http
        .post('http://127.0.0.1:5000/edit_pool', poolProps, {
          params: { id: poolId },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
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
      this.$http
        .get('http://127.0.0.1:5000/remove_pool', {
          params: { id: poolId }
        })
        .then(response => {
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
    }
  },
  data () {
    return {
      data: {
        machines: []
      },
      columns: [
        {
          field: 'poolID',
          label: 'ID',
          width: '40',
          numeric: true
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

<style lang="scss">
#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
