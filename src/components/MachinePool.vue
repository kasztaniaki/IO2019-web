<template>
  <b-table :data="data.machines" :columns="columnss">
    <template slot-scope="props">
      <b-table-column field="poolID" label="ID">{{props.row.PoolID}}</b-table-column>
      <b-table-column field="displayName" label="Name">{{props.row.DisplayName}}</b-table-column>
      <b-table-column field="operatingSystem" label="OS">{{props.row.OSName}} {{props.row.OSVersion}}</b-table-column>
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
    </template>
  </b-table>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
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
      columnss: [
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
          label: 'Maximum count',
          width: '40'
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
    MachineDescription
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
