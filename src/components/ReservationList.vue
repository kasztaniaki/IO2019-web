<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-button class="level-item"
          icon-left="chevron-left"
          @click.native="weekChange(-1)" ></b-button>

        <div class="level-item">
          {{this.weekstart.toLocaleString('pl-PL', dateOptions)}} - {{this.weekend.toLocaleString('pl-PL', dateOptions)}}
        </div>

        <b-button class="level-item"
          icon-left="chevron-right"
          @click.native="weekChange(1)" ></b-button>

      </div>
      <div class="level-right">
        <b-input class="level-item" v-model="text" @keydown.enter.native="filterPools" placeholder="Search"></b-input>
        <b-button class="level-item" @click.native="clearFilter" >Clear</b-button>

      </div>
    </div>
    <b-table class="container" :data=reservations :loading="isLoading">
      <template slot-scope="props">
        <b-table-column
          label="Mon">
            <ReservationCard :reservationData="props.row.mon" v-if="isWeekday(props.row.mon,1)"/>
          </b-table-column>
        <b-table-column
          label="Tue">
            <ReservationCard :reservationData="props.row.tue" v-if="isWeekday(props.row.thu,2)"/>
          </b-table-column>
        <b-table-column
          label="Wed">
            <ReservationCard :reservationData="props.row.wed" v-if="isWeekday(props.row.wed,3)"/>
          </b-table-column>
        <b-table-column
          label="Thu">
            <ReservationCard :reservationData="props.row.thu" v-if="isWeekday(props.row.thu,4)"/>
          </b-table-column>
        <b-table-column
          label="Fri">
            <ReservationCard :reservationData="props.row.fri" v-if="isWeekday(props.row.fri,5)"/>
          </b-table-column>
        <b-table-column
          label="Sat">
            <ReservationCard :reservationData="props.row.sat" v-if="isWeekday(props.row.sat,6)"/>
          </b-table-column>
        <b-table-column
          label="Sun">
            <ReservationCard :reservationData="props.row.sun" v-if="isWeekday(props.row.sun,7)"/>
          </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
// import { loadReservationsReq } from '@/api'
import ReservationCard from '@/components/ReservationCard.vue'

export default {
  methods: {
    loadReservations () {
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
    },
    isWeekday (date, weekday) {
      if (date) {
        var isThisWeek = new Date(date.StartDate) > new Date(this.weekstart) && new Date(date.StartDate) < new Date(this.weekend)
        console.log(isThisWeek)

        return new Date(date.StartDate).getUTCDay() === weekday && isThisWeek
      }
    },
    weekChange (diff) {
      diff = diff * 7
      this.weekstart = new Date(this.weekstart.setDate(this.weekstart.getDate() + diff))
      this.weekend = new Date(this.weekend.setDate(this.weekend.getDate() + diff))
    }
  },
  mounted () {
    var d = new Date()
    var day = d.getDay()
    var diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    this.weekstart = new Date(d.setDate(diff))
    this.weekend = new Date(d.setDate(diff + 7))

    this.loadReservations()
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
      reservations: [
        {
          Name: 'Jacek',
          Surname: 'Dajda',
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

</style>
