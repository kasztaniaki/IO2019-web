
<script>
import { HorizontalBar } from 'vue-chartjs'

export default {
  extends: HorizontalBar,
  props: {
    chartdata: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.chartOptions)
  },
  watch: {
    chartdata: function (value) {
      this.renderChart(this.chartdata, this.chartOptions)
    }
  }
}
</script>
