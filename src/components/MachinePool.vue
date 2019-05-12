<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left"/>
    </div>
    <b-table class="container" :data="data.machines" :columns="columnss">
      <template slot-scope="props">
        <b-table-column field="poolID" label="ID">
          <b-input v-if="editable && selectedColumn === props.row.PoolID" v-model="props.row.PoolID"></b-input>
          <template v-else>{{props.row.PoolID}}</template>
        </b-table-column>
        <b-table-column field="displayName" label="Name">
          <b-input v-if="editable && selectedColumn === props.row.PoolID" v-model="props.row.DisplayName"></b-input>
          <template v-else>{{props.row.DisplayName}}</template>
        </b-table-column>
        <b-table-column field="operatingSystem" label="OS">
          <div class="columns is-vcentered">
            <div class="column">
              <b-input v-if="editable && selectedColumn === props.row.PoolID" v-model="props.row.OSName"></b-input>
              <template v-else>{{props.row.OSName}}</template>
            </div>
            <div class="column is-4">
              <b-input v-if="editable && selectedColumn === props.row.PoolID" v-model="props.row.OSVersion"></b-input>
              <template v-else>{{props.row.OSVersion}}</template>
            </div>
          </div>
        </b-table-column>
        <b-table-column field="maximumCount" label="Maximum Count">
          <b-input v-if="editable && selectedColumn === props.row.PoolID" v-model="props.row.MaximumCount"></b-input>
          <template v-else>{{props.row.MaximumCount}}</template>
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
          <b-button v-if="selectedColumn !== props.row.PoolID" icon-left="edit" type="is-light" @click.native="editPool(props.row.PoolID)">
            Edit
          </b-button>
          <b-button v-else icon-left="check" type="is-success" @click.native="savePool(props.row.PoolID)">
            Save
          </b-button>
        </b-table-column>
        <b-table-column field="remove" :visible="editable">
          <b-button icon-left="trash" type="is-danger" @click.native="removePool(props.row.PoolID)">
            Delete
          </b-button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
import ImportButton from '@/components/ImportButton.vue'
export default {
  methods: {
    loadMachinesData () {
      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          console.log(response.data.pools)

          this.data.machines = response.data.pools
        })
        .catch(error => {
          console.log(error)
        })
    },
    editPool (poolID) {
      this.selectedColumn = poolID
    editPool (poolProps) {
      this.$modal.open({
        parent: this,
        component: EditPoolForm,
        hasModalCard: true,
        props: poolProps,
        events: {
          'savePool': (poolProps) => {
            console.log(poolProps)
          }
        }
      })
      console.log('Remove pool ' + poolID)
    }
  },
  watch: {
    machines: function (oldValue, newValue) {}
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
      ]
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  components: {
    MachineDescription,
    ImportButton
  },
  props: {
    editable: Boolean
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
