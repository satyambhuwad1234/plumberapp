var optionsRadarChart = {
    series: [{
    name: 'Series 1',
    data: [80, 90, 70, 80, 100, 90],
  }],
    chart: {
    type: 'radar',
    height: 300,
  },
  colors: ['#59daaf'],
  xaxis: {
    categories: ['January', 'February', 'March', 'April', 'May', 'June']
  }
};
var chart = new ApexCharts(document.querySelector("#RadarChart"), optionsRadarChart).render();
