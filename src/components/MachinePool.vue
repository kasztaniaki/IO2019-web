<template>
  <div>
    <div class="level">
      <div class="level-left">
        <ImportButton v-if="isAdmin" v-on:import="loadMachinesData()" class="level-item" :disabled="isLoading"/>
        <b-button v-if="isAdmin" class="level-item" icon-left="plus" type="is-success" :disabled="isLoading" @click.native="showPoolForm()">New pool</b-button>
      </div>
      <div class="level-right">
        <b-checkbox-button class="level-item"
          v-if="isAdmin"
          v-model="showDisabled">
          Only enabled
        </b-checkbox-button>
        <b-taginput
          class="level-item"
          v-model="filterTags"
          @keydown.enter.native="filterPools"
          placeholder="Search">
        </b-taginput>
      </div>
    </div>
    <b-table class="container pool-table" v-if="this.machines.length > 0"
      ref="table"
      :data="filteredMachines"
      :loading="isLoading"
      :selected.sync="selectedRow"
      :row-class="rowClass"
      detailed
      :show-detail-icon="false">
      <template slot-scope="props">
        <b-table-column sortable
          field="ID"
          label="ID"
          style="width: 10%">
            <div v-highlight="highlightOptions">
              {{props.row.ID}}
            </div>
          </b-table-column>
        <b-table-column sortable
          field="Name"
          label="Name"
          style="width: 25%">
          <div v-highlight="highlightOptions">
            {{props.row.Name}}
            </div>
        </b-table-column>
        <b-table-column sortable
          field="OSName"
          label="OS"
          style="width: 5%">
          <div v-highlight="highlightOptions">
            {{props.row.OSName}}
            </div>
        </b-table-column>
        <b-table-column sortable
          field="MaximumCount"
          label="Maximum Count"
          style="width: 5%">
            {{props.row.MaximumCount}}
        </b-table-column>
        <b-table-column centered :visible="isAdmin && showDisabled"
          field="Enabled"
          label="Enabled"
          style="width:5%">
            <b-icon
              id="enabled-icon"
              v-if="props.row.Enabled"
              icon="check-circle"
              size="is-small">
            </b-icon>
            <b-icon v-else
              id="disabled-icon"
              icon="times-circle"
              size="is-small">
            </b-icon>
        </b-table-column>

        <b-table-column
          style="width:25%"
          field="edit"
          :visible="editable">
            <div class="buttons is-centered" v-if="props.row==selectedRow">
              <b-button v-show="props.row==selectedRow"
                icon-left="calendar-plus"
                icon-pack="far"
                type="is-success"
                @click.native="addReservationForm(props.row.ID, props.row.Name, props.row.MaximumCount)">
              </b-button>
              <b-button v-show="props.row==selectedRow && isAdmin"
              icon-left="pen"
              type="is-info"
              @click.native="showPoolForm(props.row.ID, props.row)">
            </b-button>
              <b-button v-show="props.row==selectedRow && isAdmin"
              icon-left="trash"
              type="is-danger"
              @click.native="confirmPoolDelete(props.row.ID)">
            </b-button>
          </div>
            <MachineDescription v-else :description="props.row.InstalledSoftware" :query="query" :highlightOptions="highlightOptions" :expanded="props.row==selectedRow"/>
        </b-table-column>
      </template>
      <template  slot="detail" slot-scope="props">
        <MachineDescription :description="props.row.InstalledSoftware" :query="query" :highlightOptions="highlightOptions" :expanded="props.row==selectedRow"/>
      </template>
    </b-table>
  </div>
</template>

<script>
import MachineDescription from '@/components/MachineDescription.vue'
import ImportButton from '@/components/ImportButton.vue'
import EditPoolForm from '@/components/EditPoolForm.vue'
import ReservationForm from '@/components/ReservationForm.vue'
import { loadPoolsReq, addPoolReq, editPoolReq, removePoolReq, resetDBReq, addReservationReq } from '@/api'

export default {
  methods: {
    loadMachinesData () {
      this.isLoading = true
      loadPoolsReq()
        .then(response => {
          this.isLoading = false
          this.machines = response.data.pools
          if (!this.isAdmin) {
            this.machines = this.machines.filter(
              (value) => value.Enabled
            )
          }
        })
        .catch(error => this.handleError(error))
    },
    match (row) {
      if (!this.showDisabled && !row.Enabled) return false
      if (this.filterTags.length === 0) return true
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          const field = row[key]
          for (const tag of this.filterTags) {
            if (field.toString().match(RegExp(tag, 'i'))) return true
          }
        }
      }
      return false
    },
    clearFilter () {
      this.query = ''
      this.text = ''
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
        .catch(error => this.handleError(error))
    },
    editPool (poolId, poolProps) {
      editPoolReq(poolId, poolProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Pool edited successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        .catch(error => this.handleError(error))
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
        .catch(error => this.handleError(error))
    },
    rowClass (row, index) {
      if (this.selectedRow === row) return 'selected-row'
      else return ''
    },
    resetDB () {
      resetDBReq().then(response => {
        this.$toast.open({
          message: `Db reset`,
          position: 'is-bottom',
          type: 'is-success'
        })
        this.loadMachinesData()
      })
        .catch(error => this.handleError(error))
    },
    addReservationForm (poolID, poolName, poolMaxCount) {
      const poolProps = {
        PoolName: poolName,
        PoolID: poolID,
        MaxCount: poolMaxCount
      }

      this.$modal.open({
        parent: this,
        props: poolProps,
        component: ReservationForm,
        hasModalCard: true,
        events: {
          'saveReservation': (reservationProps) => {
            this.addReservation(reservationProps)
          }
        }
      })
    },
    addReservation (reservationProps) {
      addReservationReq(reservationProps).then(response => {
        this.loadMachinesData()
        this.$toast.open({
          message: `Reservation added successfully`,
          position: 'is-top',
          type: 'is-success'
        })
      })
        .catch(error => this.handleError(error))
    }
  },
  data () {
    return {
      machines: [],
      isLoading: false,
      filterTags: [],
      query: '',
      highlighting: true,
      selectedRow: null,
      showDisabled: false
    }
  },
  computed: {
    highlightOptions () {
      return { keyword: (this.filterTags.length === 0) ? null : this.filterTags, sensitive: false, overWriteStyle: { backgroundColor: 'indianred', color: 'white' } }
    },
    isAdmin () {
      return this.$store.getters.getIsAdmin
    },
    filteredMachines () {
      return this.machines.filter(this.match)
    }
  },
  mounted () {
    this.loadMachinesData()
  },
  watch: {
    selectedRow: function (newValue, oldValue) {
      if (oldValue !== null) {
        this.$refs.table.openedDetailed.pop()
      }
      if (newValue !== null) {
        this.$refs.table.openedDetailed.push(newValue)
      }
    }
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
@import "@/variables.scss";

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

.selected-row {
  background-color: $selected !important;
  color: $dark !important;
};

.detail{
  background-color: lighten($color: $selected, $amount: 2) !important;
  color: $dark !important;
  margin-bottom: 5px !important;
}

.detail-container {
  margin-bottom: 8px;
}

.selected-row>td {
  border: none;
}

.b-table .table tr.detail {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.pool-table td {
  vertical-align: middle !important;
}

.buttons {
  padding-bottom: 10px;
  padding-top: 6px
}

#enabled-icon {
  color: green;
}
#disabled-icon {
  color: red;
}
</style>
