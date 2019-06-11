<template>
  <div>
    <section class="hero">
      <div class="hero-body">
        <div class="columns">
          <div class="column is-3">
            <b-tooltip label="Hours * machine count for reservation">
              <h1 class="title">
                {{chartTitle}}
              </h1>
            </b-tooltip>
          </div>
          <div class="column is-4">
            <div class="level">
              <b-button class="level-item my-button"
                icon-left="minus"
                @click.native="weekChange(-1)" >
              </b-button>
              <div class="level-item">
                3 pools
              </div>
              <b-button class="level-item my-button"
                icon-left="plus"
                @click.native="weekChange(1)" >
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div>
      <BarChart ref='chart' :styles='chartStyles' :chartdata='chartData(labels,data)' />
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/statistics/BarChart.vue'

export default {
  props: {
    labels: Array,
    data: Array,
    chartTitle: String,
    loading: Boolean
  },
  data () {
    return {
      loadingComponent: null
    }
  },
  computed: {
    chartStyles () {
      return {
        position: 'relative',
        height: (this.data.length * 50 + 20) + 'px'
      }
    }
  },
  methods: {
    chartData (dataLabels, dataPoints) {
      var colors = []
      for (const label of dataLabels) {
        colors.push(this.generateColor(label))
      }
      return { labels: dataLabels, datasets: [{ backgroundColor: colors, data: dataPoints }] }
    },
    generateColor (value) {
      var hash = 0
      for (var i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) * 34 + hash
      }
      return 'hsl(' + hash % 360 + ', 50%, 30%)'
    }
  },
  watch: {
    loading: function (isLoading) {
      if (isLoading) {
        this.loadingComponent = this.$loading.open({
          container: this.$refs.chart.$el
        })
      } else {
        this.loadingComponent.close()
      }
    }
  },
  components: {
    BarChart
  }
}
</script>

<style lang="scss">
@import "@/variables.scss";

.my-button {
  border-color: transparent !important;
}
</style>
