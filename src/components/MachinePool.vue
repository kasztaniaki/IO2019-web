<template>
  <div>
    
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left"/>
      <b-input placeholder="filter"></b-input>
    </div>
    <b-table class="container" :data="data.machines">
      <template slot-scope="props">
        <b-table-column sortable field="PoolID" label="ID">{{props.row.PoolID}}</b-table-column>
        <b-table-column sortable field="DisplayName" label="Name">{{props.row.DisplayName}}</b-table-column>
        <b-table-column sortable
          field="OperatingSystem"
          label="OS"
        >{{props.row.OSName}}</b-table-column>
        <b-table-column sortable field="MaximumCount" label="Maximum Count">{{props.row.MaximumCount}}</b-table-column>
        <b-table-column field="Enabled" label="Enabled">
          <b-icon
            id="enabled-icon"
            v-if="props.row.Enabled"
            pack="fas"
            icon="check-circle"
            size="is-small"
          ></b-icon>
          <b-icon v-else id="disabled-icon" pack="fas" icon="times-circle" size="is-small"></b-icon>
        </b-table-column>
        <b-table-column field="Description" label="Description">
          <MachineDescription :description="props.row.InstalledSoftware"/>
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
      this.data.loading=true
      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          this.data.machines = response.data.pools
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  data () {
    return {
      data: {
        machines: []
      }
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  components: {
    MachineDescription,
    ImportButton
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
