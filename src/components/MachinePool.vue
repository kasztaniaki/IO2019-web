<template>
  <div>
    <div class="level">
      <ImportButton v-on:import="loadMachinesData()" class="level-left"/>
      <b-input v-model=query placeholder="filter"></b-input>
    </div>
    <b-table class="container" :data=filter>
      <template slot-scope="props">
        <b-table-column sortable field="PoolID" label="ID" v-html="$options.filters.highlight(props.row.PoolID, query)">{{props.row.PoolID | highlight}}</b-table-column>
        <b-table-column sortable field="DisplayName" label="Name" v-html="$options.filters.highlight(props.row.DisplayName, query)">{{props.row.DisplayName | highlight}}</b-table-column>
        <b-table-column sortable
          field="OperatingSystem"
          label="OS"
        >{{props.row.OSName}}</b-table-column>
        <b-table-column sortable field="MaximumCount" label="Maximum Count" v-html="$options.filters.highlight(props.row.MaximumCount, query)">{{props.row.MaximumCount | highlight}}</b-table-column>
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
          <MachineDescription :description="props.row.InstalledSoftware" :query="query"/>
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
      this.data.loading = true
      this.$http
        .get('http://127.0.0.1:5000/pools')
        .then(response => {
          this.data.machines = response.data.pools
          console.log(this.data.machines)
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
      },
      query: ''

    }
  },
  mounted () {
    this.loadMachinesData()
  },
  computed: {
    filter: function () {
      var re = RegExp(this.query, 'i')
      var result = []
      for (const pool of this.data.machines) {
        for (const prop in pool) {
          if (pool.hasOwnProperty(prop)) {
            const element = pool[prop]
            if (element.toString().match(re)) {
              result.push(pool)
              break
            }
          }
        }
      }
      return result
    }
  },
  components: {
    MachineDescription,
    ImportButton
  },
  filters: {
    highlight: function (value, query) {
      var re = RegExp(query, 'i')
      var result = value.toString().replace(re, function (matchedText, a, b) {
        if (matchedText !== '') {
          var res = '<span class="highlight has-background-success">' + matchedText + '</span>'
          return res
        } else return ''
      })
      return result
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
.highlight{
  padding: 3px 0px;
  border-color:hsl(141, 71%, 48%);
  border-style: solid;
  border-width: 0px 2px 0px 2px;
  margin: 0px -2px 0px -2px;
}
</style>
