import React from 'react';
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, Tooltip,
  CategoryScale, LinearScale, PointElement, Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';


const CustomChart = ({
                       className, baseCurrency, nativeCurrency,
                       gColors, color, timeSeries, stockSymbol,
                       pointBorderWidth = 10,
                       borderWidth = 5,
                       tension = 0.5
                     }) => {

  ChartJS.register(
    LineElement, CategoryScale, LinearScale,
    PointElement, [Tooltip], zoomPlugin, Filler
  );

  let chartLabel = '';
  if (baseCurrency && nativeCurrency) {
    chartLabel = `${baseCurrency?.id}/${nativeCurrency?.id}`;
  } else if (stockSymbol) {
    console.log(stockSymbol)
    chartLabel = stockSymbol;
  }

  const configureBgColor = context => {
    const {ctx, chartArea: {top, bottom}} = context.chart;
    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, gColors && gColors[0] ? gColors[0] : 'rgba(244,190,55,0.24)');
    gradient.addColorStop(0.5, gColors && gColors[1] ? gColors[1] : 'rgba(244,190,55,0.08)');
    gradient.addColorStop(1, gColors && gColors[2] ? gColors[2] : 'rgba(244,190,55,0)');
    return gradient;
  };

  const chartData = {
    labels: timeSeries?.map(obj => obj.timestamp),
    datasets: [{
      data: timeSeries?.map(obj => obj.rate),
      fill: true,
      backgroundColor: (ctx) => configureBgColor(ctx),
      pointBackgroundColor: color,
      borderColor: color,
      pointBorderWidth,
      borderWidth,
      tension
    }]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          mode: 'x',
        }
      },
      tooltip: {
        callbacks: {
          label: ({raw}) => `  ${chartLabel} ${raw}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: '#333333'
        }
      }
    }
  };

  return (
    <div className={className}>
      <Line className='w-full h-full' data={chartData} options={chartOptions}></Line>
    </div>
  );
};

export default CustomChart;