<template>
  <div ref="chartEl" class="line-chart-wrap"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  trend: { type: Array, default: () => [] },
})

const chartEl = ref(null)

function draw() {
  if (!chartEl.value) return
  d3.select(chartEl.value).selectAll('*').remove()
  if (!props.trend.length) return

  const margin = { top: 16, right: 16, bottom: 28, left: 52 }
  const totalW = chartEl.value.clientWidth || 400
  const totalH = 200
  const w = totalW - margin.left - margin.right
  const h = totalH - margin.top - margin.bottom

  const svg = d3.select(chartEl.value)
    .append('svg')
    .attr('width', totalW)
    .attr('height', totalH)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand()
    .domain(props.trend.map((d) => d.month))
    .range([0, w])
    .padding(0.2)

  const maxVal = d3.max(props.trend, (d) => Math.max(d.income, d.expenses)) || 1
  const y = d3.scaleLinear().domain([0, maxVal * 1.15]).range([h, 0])

  // Gridlines
  svg.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).ticks(4).tickSize(-w).tickFormat(''))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line')
      .attr('stroke', 'rgba(15,23,42,0.06)')
      .attr('stroke-dasharray', '4,3'))

  // X axis
  svg.append('g')
    .attr('transform', `translate(0,${h})`)
    .call(d3.axisBottom(x).tickFormat((d) => {
      const [yr, mo] = d.split('-')
      return new Date(yr, mo - 1).toLocaleString('default', { month: 'short' })
    }))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').remove())
    .call((g) => g.selectAll('text').style('font-size', '11px').style('fill', '#94a3b8'))

  // Y axis
  svg.append('g')
    .call(d3.axisLeft(y).ticks(4).tickFormat((v) => `$${v >= 1000 ? `${v / 1000}k` : v}`))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').remove())
    .call((g) => g.selectAll('text').style('font-size', '11px').style('fill', '#94a3b8'))

  const cx = (d) => x(d.month) + x.bandwidth() / 2

  function drawLine(key, color) {
    const line = d3.line().x(cx).y((d) => y(d[key])).curve(d3.curveMonotoneX)

    // Area fill
    const area = d3.area().x(cx).y0(h).y1((d) => y(d[key])).curve(d3.curveMonotoneX)
    svg.append('path')
      .datum(props.trend)
      .attr('fill', color)
      .attr('fill-opacity', 0.08)
      .attr('d', area)

    // Line
    svg.append('path')
      .datum(props.trend)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2.5)
      .attr('stroke-linejoin', 'round')
      .attr('d', line)

    // Dots
    svg.selectAll(`.dot-${key}`)
      .data(props.trend)
      .join('circle')
      .attr('cx', cx)
      .attr('cy', (d) => y(d[key]))
      .attr('r', 4)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
  }

  drawLine('expenses', '#5c6ac4')
  drawLine('income', '#10b981')
}

onMounted(draw)
watch(() => props.trend, draw, { deep: true })
</script>

<style scoped>
.line-chart-wrap {
  width: 100%;
  min-height: 200px;
}
</style>
