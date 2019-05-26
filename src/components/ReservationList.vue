<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-button class="level-item my-button"
          icon-left="chevron-left"
          @click.native="weekChange(-1)" ></b-button>

        <div class="level-item">
          {{this.weekstart.toLocaleString('pl-PL', dateOptions)}} - {{this.weekend.toLocaleString('pl-PL', dateOptions)}}
        </div>

        <b-button class="level-item my-button"
          icon-left="chevron-right"
          @click.native="weekChange(1)" ></b-button>

      </div>
      <div class="level-right">
        <div class="level-item">
          Filter
        </div>
        <b-select class="level-item"
          placeholder="Select pool"
          icon="desktop"
          v-model="selectedPool">
          <option value="None">None</option>
          <option
              v-for="pool in pools"
              :value="pool.ID"
              :key="pool.ID">
              {{ pool.Name }}
          </option>
        </b-select>
        <b-select class="level-item"
          placeholder="Select user"
          icon="user"
          v-model="selectedUser">
          <option value="None">None</option>
          <option
              v-for="user in users"
              :value="user.Email"
              :key="user.Email">
              {{ user.Name }} {{user.Surname}}
          </option>
        </b-select>

      </div>
    </div>
    <b-table class="container" :data=reservations :loading="isLoading">
      <template slot-scope="props">
        <b-table-column
          label="Mon">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.mon" v-if="filterReservations(props.row.mon,1)"/>
          </b-table-column>
        <b-table-column
          label="Tue">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.tue" v-if="filterReservations(props.row.thu,2)"/>
          </b-table-column>
        <b-table-column
          label="Wed">
            <ReservationCard
              @user="(user) => selectedUser = user"
              @pool="(pool) => selectedPool = pool"
              :reservationData="props.row.wed" v-if="filterReservations(props.row.wed,3)"/>
          </b-table-column>
        <b-table-column
          label="Thu">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.thu" v-if="filterReservations(props.row.thu,4)"/>
          </b-table-column>
        <b-table-column
          label="Fri">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.fri" v-if="filterReservations(props.row.fri,5)"/>
          </b-table-column>
        <b-table-column
          label="Sat">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.sat" v-if="filterReservations(props.row.sat,6)"/>
          </b-table-column>
        <b-table-column
          label="Sun">
            <ReservationCard @user="(user) => selectedUser = user"
              :reservationData="props.row.sun" v-if="filterReservations(props.row.sun,7)"/>
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import { loadPoolsReq, loadUsersReq, loadReservationsReq } from '@/api'
import ReservationCard from '@/components/ReservationCard.vue'

export default {
  methods: {
    loadReservations (startDate, endDate, showCancelled) {
      loadReservationsReq(startDate, endDate, showCancelled)
        .then(response => {
          let weekdays = [ [], [], [], [], [], [], [] ]
          var names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
          for (const res of response.data.reservations) {
            res.StartDate = parseInt(res.StartDate)
            res.EndDate = parseInt(res.EndDate)
            var weekday = new Date(res.StartDate).getUTCDay()
            weekdays[weekday - 1].push(res)
          }
          let slots = []
          let inserted = true
          let j = 0
          while (inserted) {
            inserted = false
            let slot = {}
            for (let i = 0; i < 7; i++) {
              if (weekdays[i].length > j) {
                slot[names[i]] = weekdays[i][j]
                inserted = true
              }
            }
            if (inserted) slots.push(slot)
            j += 1
          }
          this.reservations = slots
        })
        .catch(error => {
          if (error) {
            let weekdays = [ [], [], [], [], [], [], [] ]
            var names = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
            for (const res of this.reservations) {
              res.StartDate = parseInt(res.StartDate)
              res.EndDate = parseInt(res.EndDate)
              var weekday = new Date(res.StartDate).getUTCDay()
              weekdays[weekday - 1].push(res)
            }
            let slots = []
            let inserted = true
            let j = 0
            while (inserted) {
              inserted = false
              let slot = {}
              for (let i = 0; i < 7; i++) {
                if (weekdays[i].length > j) {
                  slot[names[i]] = weekdays[i][j]
                  inserted = true
                }
              }
              if (inserted) slots.push(slot)
              j += 1
            }
            this.reservations = slots
          }
        })
    },
    filterReservations (res, weekday) {
      return this.isWeekday(res, weekday) && this.filterPools(res) && this.filterUsers(res)
    },
    isWeekday (res, weekday) {
      if (res) {
        var isThisWeek = new Date(res.StartDate) > new Date(this.weekstart) && new Date(res.StartDate) < new Date(this.weekend)
        console.log(isThisWeek)

        return new Date(res.StartDate).getUTCDay() === weekday && isThisWeek
      }
    },
    filterPools (res) {
      if (this.selectedPool && this.selectedPool !== 'None') {
        return this.selectedPool === res.PoolID
      } else return true
    },
    filterUsers (res) {
      if (this.selectedUser && this.selectedUser !== 'None') {
        return this.selectedUser === res.UserID
      } else return true
    },
    weekChange (diff) {
      diff = diff * 7
      this.weekstart = new Date(this.weekstart.setDate(this.weekstart.getDate() + diff))
      this.weekend = new Date(this.weekend.setDate(this.weekend.getDate() + diff))
      this.loadReservations(this.weekstart, this.weekend)
    },
    loadPools () { // todo error handling
      loadPoolsReq()
        .then(response => {
          this.pools = response.data.pools
          console.log(this.pools)
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadUsers () { // todo error handling
      loadUsersReq()
        .then(response => {
          this.users = response.data.users
          console.log(this.pools)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  mounted () {
    var d = new Date()
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    this.weekstart = new Date(d.setDate(diff))
    this.weekend = new Date(d.setDate(diff + 7))

    this.loadReservations(this.weekstart, this.weekend, false)
    this.loadPools()
    this.loadUsers()
  },
  data () {
    return {
      slots: [],
      isLoading: false,
      text: '',
      query: '',
      highlighting: true,
      weekstart: null,
      weekend: null,
      dateOptions: { year: 'numeric', month: 'numeric', day: 'numeric' },
      pools: [],
      users: [],
      selectedPool: null,
      selectedUser: null,
      reservations: [
        {
          Name: 'Łukasz',
          Surname: 'Zając',
          UserID: 'kiicek.z@gmail.com',

          PoolName: 'Green Lights 4 Girls',
          PoolID: 's7n-girls',

          StartDate: '1558512000000',
          EndDate: '1558515600000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Michał',
          Surname: 'Idzik',
          UserID: '2',

          PoolName: 'Gramatyki grafowe',
          PoolID: 's7n-gram',

          StartDate: '1558522800000',
          EndDate: '1558526400000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Jolanta',
          Surname: 'Konieczna',
          UserID: '3',

          PoolName: 'Technologie Aplikacji Internetowych',
          PoolID: 's7n-tai-auto',

          StartDate: '1558598400000',
          EndDate: '1558602000000',
          Count: 13,
          Cancelled: false
        },
        {
          Name: 'Łukasz',
          Surname: 'Zając',
          UserID: '4',

          PoolName: 'Technologie Aplikacji Internetowych',
          PoolID: 's7n-tai-auto',

          StartDate: '1559116800000',
          EndDate: '1559120400000',
          Count: 13,
          Cancelled: false
        }
      ]
    }
  },
  components: {
    ReservationCard
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
    border-color: transparent !important;
  }
</style>
