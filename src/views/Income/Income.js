import React, {Component} from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';
import {Card, CardBody, CardHeader} from 'reactstrap';
import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips";


const line = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56, 55, 40],
    },
  ],
};

const bar = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  datasets: [
    {
      label: '만 원',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 67, 56, 55, 4, 40, 65, 59, 65, 36, 56, 55, 40],
    },
  ],
};

const doughnut = {
  labels: [
    '인건비',
    '관리비',
    '재료비',
  ],
  datasets: [
    {
      data: [300, 50, 100],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
      ],
    }],
};


const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false
}


class Income extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <CardHeader>
          손익 계산서
        </CardHeader>

        <Card style={{'flex-direction': 'row', 'text-align': 'center'}}>
          <CardBody>
            <label>매출</label>
            <div  className="chart-wrapper">
              <Doughnut  data={doughnut}/>
            </div>
          </CardBody>
          <CardBody>
            <label>매입</label>
            <div className="chart-wrapper" >
              <Doughnut data={doughnut}/>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            수입
          </CardHeader>
          <CardBody>
            <div className="chart-wrapper">
              <Bar data={bar} options={options}/>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Income;
