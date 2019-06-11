<template>
  <div>
    <div class="columns">
      <div class="column is-5">
        <div class="level">
          <b-button class="level-item my-button"
                icon-left="chevron-left"
                @click.native="dateChange(-1)" ></b-button>
              <div class="level-item" v-if="startTime">
                {{timeRangeString}}
              </div>
              <b-button class="level-item my-button"
                icon-left="chevron-right"
                @click.native="dateChange(1)" ></b-button>
        </div>
      </div>
      <div class="column">
        <b-field>
          <b-radio-button
            v-model="timeRange"
            native-value='week'
            >
            Week
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='month'
            >
            Month
          </b-radio-button>
          <b-radio-button
            v-model="timeRange"
            native-value='year'
            >
            Year
          </b-radio-button>
        </b-field>
      </div>
    </div>
    <BarChartWrap :loading="charts[0].loading" :labels='charts[0].labels' :data='charts[0].data' chartTitle='Popular Pools'/>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Popular Users'/>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Bottlenecks'/>
    <BarChartWrap :labels='pools' :data='stats' chartTitle='Least Used'/>
  </div>
</template>

<script>
import BarChartWrap from '@/components/statistics/BarChartWrap.vue'
import { getPopularPoolsReq, getPopularUsersReq, getBottleneckedPoolsReq, getUnusedPoolsReq } from '@/api'

export default {
  data () {
    return {
      pools: [
        'Gramatyki',
        'Programowanie aplikacji z baza danych',
        'Systemy ekspertowe i sztuczna inteligencja'
      ],
      stats: [
        133, 242, 17
      ],
      timeRange: 'week',
      startTime: null,
      endTime: null,
      charts: [
        {
          title: 'Popular Pools',
          labels: [],
          data: [],
          loading: false,
          getter: getPopularPoolsReq,
          arguments: [
            this.startTime,
            this.endTime,
            3 // todo
          ]
        },
        {
          title: 'Popular Users',
          labels: [],
          data: [],
          loading: false,
          getter: getPopularUsersReq
        },
        {
          title: 'Bottlenecked Pools',
          labels: [],
          data: [],
          loading: false,
          getter: getBottleneckedPoolsReq
        },
        {
          title: 'Unused Pools',
          labels: [],
          data: [],
          loading: false,
          getter: getUnusedPoolsReq
        }
      ],
      isLoading: false
    }
  },
  methods: {
    loadData (chartIndex) {
      var chart = this.charts[chartIndex]
      chart.getter(...chart.arguments)
        .then(response => {
          chart.data = response.data.data
          chart.labels = response.data.labels
          for (let i = 0; i < chart.labels.length; i++) {
            chart.labels[i] = chart.labels[i].name
          }
        })
    },
    chartData (dataLabels, dataPoints, label) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, label: label, data: dataPoints }] }
    },
    dateChange (offset) {

    },
    setTime (range) {
      switch (range) {
        case 'week':
          var d = new Date()
          var day = d.getDay()
          var diff = d.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
          d.setHours(0, 0, 0, 0)

          this.startTime = new Date(d.setDate(diff))
          this.endTime = new Date(d.setDate(diff + 7))
          break

        case 'month':
          var now = new Date()
          var month = new Date(now.getFullYear(),
            now.getMonth(),
            0, 0, 0, 0, 0)
          var monthStart = new Date(month)
          var monthEnd = new Date(month.setMonth(month.getMonth() + 1))

          this.startTime = monthStart
          this.endTime = monthEnd
          break

        case 'year':
          var now2 = new Date()
          var year = new Date(now2.getFullYear(),
            0, 0, 0, 0, 0, 0)
          var yearStart = new Date(year)
          var yearEnd = new Date(year.setFullYear(year.getFullYear() + 1))

          this.startTime = yearStart
          this.endTime = yearEnd
          break
        default:
          break
      }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    }
  },
  computed: {
    timeRangeString () {
      switch (this.timeRange) {
        case 'week':
          return this.startTime.toLocaleString('pl-PL', { year: 'numeric', month: 'numeric', day: 'numeric' }) + ' - ' +
          this.endTime.toLocaleString('pl-PL', { year: 'numeric', month: 'numeric', day: 'numeric' })
        case 'month':
          return this.startTime.toLocaleString('pl-PL', { year: 'numeric', month: 'long' })
        default:
          return ''
      }
    }
  },
  watch: {
    timeRange: function (value) {
      this.setTime(value)
    }
  },
  mounted () {
    this.setTime('week')
    this.loadData(0)
  },
  components: {
    BarChartWrap
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.my-button {
  border-color: transparent !important;
}
</style>
