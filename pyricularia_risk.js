const monthNames = {
  Jan: 'jan',
  Feb: 'feb',
  Mar: 'mar',
  Apr: 'apr',
  May: 'may',
  Jun: 'jun',
  Jul: 'jul',
  Aug: 'aug',
  Sep: 'sep',
  Oct: 'oct',
  Nov: 'nov',
  Dec: 'dec',
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() + 1)
  return `${date.getDate()} ${
    monthNames[
      date.toLocaleString('en-US', {
        month: 'short',
      })
    ]
  }`
}

function graphic(data) {
  const labels = data.filter((item) => item.datetime !== '' && item.datetime !== null).map((item) => formatDate(item.datetime))
  console.log(labels)

  const riskData = data.filter((item) => item.datetime!== '' && item.datetime !== null).map((item) => item.risk_label)
  console.log(riskData)

  const numericRiskData = riskData.map((risk) => parseFloat(risk))
  console.log(numericRiskData)

  function riskColors(values) {
    return values.map((value) => {
      switch (value) {
        case 0:
          return '#00AA48'
        case 1:
          return '#00AA48'
        case 2:
          return '#F7F203'
        case 3:
          return '#EB1B12'
      }
    })
  }

  function generateDataset(config) {
    return {
      label: config.label,
      type: config.type,
      data: data.map((item) => config.dataKey === 'risk_label' ? 100 : item[config.dataKey]),
      borderColor: config.dataKey === 'risk_label' ? riskColors(numericRiskData) : config.color,
      backgroundColor: config.dataKey === 'risk_label' ? riskColors(numericRiskData) : config.color,
      borderWidth: config.dataKey === 'risk_label' || config.dataKey === 'precip' ? 0 : 3,
      categoryPercentage: 0.8,
      barPercentage: 1,
      tension: 0.1,
      pointRadius: (context) => {
        return 0
      },
      pointHitRadius: 10,
      spanGaps: true,
      yAxisID: config.axis,
      borderDash: config.borderDash,
      tooltip: {
        callbacks: {
          label: (context) => {
            if (config.label === '') {
              return ''
            } else {
              return `${config.label}: ${context.parsed.y.toFixed(2)} ${config.unit}`
            }
          },
        },
      },
      datalabels: {
        display: config.dataKey === 'windspeed',
        align: 'center',
        anchor: 'center',
        rotation: (context) => data[context.dataIndex].winddir - 90,
        color: function (context) {
          return 'white'
        },
        font: function (context) {
          var w = context.chart.width
          return {
            size: 12,
          }
        },
        formatter: function (value, context) {
          // return context.chart.data.labels[context.dataIndex];
          return '➤'
        },
      },
    }
  }

  const datasets = [
    generateDataset({ label: 'Temperatura', type:'line', dataKey: 'temp', color: '#FF0000', axis:'y1', unit: 'ºC' }),
    generateDataset({ label: 'Vel. de Viento', type:'line', dataKey: 'windspeed', color: '#00FFFF', axis:'y1', unit: 'm/s' }),
    generateDataset({ label: 'Precipitación', type:'bar', dataKey: 'precip', color: '#2E86C1', axis:'y1', unit: 'mm'}),
    generateDataset({ label: 'Hum. en Aire', type:'line', dataKey: 'humidity', color: '#008600', axis:'y1', unit: '%' }),
    generateDataset({ label: 'Riesgo de Pyricularia', type:'line', dataKey: 'risk_level', color: '#FFFFFF', axis:'y2', unit: '% (experimental)' }),
    generateDataset({ label: '', type:'bar', dataKey: 'risk_label', color: '#2E86C1', axis:'y2', unit: ''}),
    generateDataset({ label: '', type:'line', dataKey: 'tempmax', color: '#FF0000', axis:'y1', unit: '', borderDash: [5, 5] }),
    generateDataset({ label: '', type:'line', dataKey: 'tempmin', color: '#FF0000', axis:'y1', unit: '', borderDash: [5, 5] }),
  ]
  console.log(datasets)

  const gridColor = '#0070F3'
  const textColor = '#FFFFFF'

  const config = {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      animation: true,
      transitions: {
        show: {
          animations: {
            x: {
              from: 0,
            },
            y: {
              from: 0,
            },
          },
        },
        hide: {
          animations: {
            x: {
              to: 0,
            },
            y: {
              to: 0,
            },
          },
        },
      },
      events: ['mouseout', 'click', 'touchstart', 'touchmove'],
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y2: {
          type: 'linear',
          min: 0,
          max: 100,
          position: 'left',
          stack: 'y',
          stacked: false,
          stackWeight: 0.25,
          ticks: {
            stepSize: 50,
            color: textColor,
            beginAtZero: true,
          },
          grid: {
            color: gridColor,
          },
        },
        y1: {
          type: 'linear',
          min: 0,
          max: 100,
          position: 'left',
          stack: 'y',
          stacked: false,
          stackWeight: 1,
          offset: true,
          ticks: {
            stepSize: 10,
            color: textColor,
            beginAtZero: true,
          },
          grid: {
            color: gridColor,
          },
        },
        x: {
          stacked: true,
          offset: false,
          ticks: {
            color: textColor,
            font: {
              size: 10,
            },
            beginAtZero: true,
            minRotation: window.matchMedia('(max-width: 480px)').matches
              ? 45
              : 50,
            maxRotation: window.matchMedia('(max-width: 480px)').matches
              ? 45
              : 65,
          },
          grid: {
            display: true,
            color: gridColor,
            offset: false,
            drawOnChartArea: true,
            drawTicks: true,
          },
        },
      },
      plugins: {
        tooltip: {
          enabled: true,
        },
        htmlLegend: {
          containerID: 'legend-container',
        },
        legend: {
          display: false,
          position: 'top',
          align: 'center',
          labels: {
            color: textColor,
            padding: 10,
            boxHeight: 14,
            font: {
              size: 14,
            },
          },
        },
      },
    },
    plugins: [htmlLegendPlugin, ChartDataLabels],
  }
  const ctx = document.getElementById('chart').getContext('2d')
  new Chart(ctx, config)
}

// design to HTML Legend
const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id)
  let listContainer = legendContainer.querySelector('ul')

  if (!listContainer) {
    listContainer = document.createElement('ul')
    if (window.matchMedia('(max-width: 480px)').matches) {
      listContainer.classList.add('chartLegend')
      listContainer.style.display = 'grid'
      listContainer.style.gridTemplateColumns = '140px 140px'
      listContainer.style.gridTemplateRows = '12px 12px 12px'
      listContainer.style.margin = 0
      listContainer.style.padding = 0
      listContainer.style.alignItems = 'center'
      listContainer.style.justifyContent = 'center'
    } else {
      listContainer.style.display = 'flex'
      listContainer.style.flexDirection = 'row'
      listContainer.style.margin = 0
      listContainer.style.padding = 0
    }
    legendContainer.appendChild(listContainer)
  }

  return listContainer
}

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID)

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove()
    }

    // Filter out datasets with empty labels
    const filteredDatasets = chart.config.data.datasets.filter(
      (dataset) => dataset.label !== ''
    )

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(
      chart,
      filteredDatasets
    )

    items.forEach((item) => {
      if (item.label !== '' && item.text !== '') {
        // Check if the label is not empty
        const li = document.createElement('li')
        if (window.matchMedia('(max-width: 480px)').matches) {
          li.style.alignItems = 'center'
          li.style.cursor = 'pointer'
          li.style.display = 'flex'
          li.style.flexDirection = 'row'
          li.style.margin = '1px 5px'
          li.style.justifyContent = 'start'
          li.style.height = '12px'
          li.style.width = '140px'
          li.style.fontSize = '11px'
          li.style.fontFamily = 'Inter, sans-serif'
        } else {
          li.style.alignItems = 'center'
          li.style.cursor = 'pointer'
          li.style.display = 'flex'
          li.style.flexDirection = 'row'
          li.style.marginLeft = '10px'
          li.style.justifyContent = 'center'
          li.style.fontSize = '12px'
          li.style.fontFamily = 'Inter, sans-serif'
        }

        li.onclick = () => {
          const { type } = chart.config
          if (type === 'pie' || type === 'doughnut') {
            // Pie and doughnut charts only have a single dataset and visibility is per item
            chart.toggleDataVisibility(item.index)
          } else {
            chart.setDatasetVisibility(
              item.datasetIndex,
              !chart.isDatasetVisible(item.datasetIndex)
            )
          }
          chart.update()
        }

        // Color box
        if (item.text !== '') {
          const boxSpan = document.createElement('span')
          if (window.matchMedia('(max-width: 480px)').matches) {
            boxSpan.style.background = item.fillStyle
            boxSpan.style.borderColor = item.strokeStyle
            boxSpan.style.borderWidth = item.lineWidth + 'px'
            boxSpan.style.display = 'flex'
            boxSpan.style.flexShrink = 0
            boxSpan.style.height = '12px'
            boxSpan.style.marginRight = '10px'
            boxSpan.style.width = '12px'
          } else {
            boxSpan.style.background = item.fillStyle
            boxSpan.style.borderColor = item.strokeStyle
            boxSpan.style.borderWidth = item.lineWidth + 'px'
            boxSpan.style.display = 'inline-block'
            boxSpan.style.flexShrink = 0
            boxSpan.style.height = '12px'
            boxSpan.style.width = '12px'
            boxSpan.style.marginRight = '10px'
          }
          li.appendChild(boxSpan)
        }

        // Text
        const textContainer = document.createElement('p')
        textContainer.style.color = item.fontColor
        textContainer.style.margin = 0
        textContainer.style.padding = 0
        textContainer.style.textDecoration = item.hidden ? 'line-through' : ''

        const text = document.createTextNode(item.text)
        textContainer.appendChild(text)

        li.appendChild(textContainer)
        ul.appendChild(li)
      }
    })
  },
}
