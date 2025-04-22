var SalesByCategory = {
    series: [44, 55, 33, 55],
    chart: {
        type: 'pie',
    },
    legend: {
        position: 'bottom'
    },
    labels: ['WP Themes', 'HTML Themes', 'UI Themes', 'Script'],
    colors: ['#9977f9', '#42d993', '#6935f7', '#ffd045'],
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: false
            }
        }
    }]
};
var chart = new ApexCharts(document.querySelector("#SalesByCategory"), SalesByCategory);
chart.render();


var IncomeBudget = {
    series: [70],
    chart: {
        height: 300,
        type: 'radialBar',
        dropShadow: {
            enabled: true,
            color: '#6935f7',
            top: 5,
            left: 0,
            blur: 5,
            opacity: 0.2
        },
    },
    colors: ['#8156F8'],
    plotOptions: {
        heatmap: {
            radius: 30,
        },
        radialBar: {
            startAngle: 0,
            endAngle: 360,
            hollow: {
                size: '75%',
            },
            dataLabels: {
                show: true,
                name: {
                    show: true,
                    fontSize: '16px',
                    fontFamily: undefined,
                    fontWeight: 500,
                    color: '#a1a1a1',
                    offsetY: -6
                },
                value: {
                    show: true,
                    fontSize: '20px',
                    fontFamily: undefined,
                    fontWeight: 600,
                    color: '#9977f9',
                    offsetY: 6,
                    formatter: function (val) {
                      return val + '%'
                    }
                },
            },
        },
    },
    labels: ['Income Budget'],
    stroke: {
        lineCap: 'round'
    },
    responsive: [{
        breakpoint: 576,
        options: {
            chart: {
                height: 300
            }
        }
    },{
        breakpoint: 1400,
        options: {
            chart: {
                height: 270
            }
        }
    }]
};
var chart = new ApexCharts(document.querySelector("#IncomeBudget"), IncomeBudget);
chart.render();

var ExpenseBudget = {
    series: [60],
    chart: {
        height: 300,
        type: 'radialBar',
        dropShadow: {
            enabled: true,
            color: '#00add0',
            top: 5,
            left: 0,
            blur: 5,
            opacity: 0.2
        },
    },
    colors: ['#58cde4'],
    plotOptions: {
        heatmap: {
            radius: 30,
        },
        radialBar: {
            startAngle: 0,
            endAngle: 360,
            hollow: {
                size: '75%',
            },
            dataLabels: {
                show: true,
                name: {
                    show: true,
                    fontSize: '16px',
                    fontFamily: undefined,
                    fontWeight: 500,
                    color: '#a1a1a1',
                    offsetY: -6
                },
                value: {
                    show: true,
                    fontSize: '20px',
                    fontFamily: undefined,
                    fontWeight: 600,
                    color: '#58cde4',
                    offsetY: 6,
                    formatter: function (val) {
                      return val + '%'
                    }
                },
            },
        }
    },
    labels: ['Expense Budget'],
    stroke: {
        lineCap: 'round'
    },
    responsive: [{
        breakpoint: 1400,
        options: {
            chart: {
                height: 270
            }
        }
    },{
        breakpoint: 576,
        options: {
            chart: {
                height: 300
            }
        }
    }]
};
var chart = new ApexCharts(document.querySelector("#ExpenseBudget"), ExpenseBudget);
chart.render();