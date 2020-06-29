import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [[]],
      orderData: []
    };
  }
  componentWillMount() {
		const {stockId} = this.props.match.params;
    this.getStockDetail(stockId);
    this.getStockOrder(stockId);
  }

  getStockDetail(stockId) {
    fetch(process.env.REACT_APP_HOST+"/api/stock/"+stockId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
    .then(response => {
      if(response.status === 401) {
        return Promise.all([401])
      } else {
        return Promise.all([response.status, response.json()]);
      }
    })
    .then(data => {
      let status = data[0];
      if(status === 200)
        this.setState({data: data[1]});
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }

  getStockOrder(stockId) {
    fetch(process.env.REACT_APP_HOST+"/api/stock/order/"+stockId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
    .then(response => {
      if(response.status === 401) {
        return Promise.all([401])
      } else {
        return Promise.all([response.status, response.json()]);
      }
    })
    .then(data => {
      let status = data[0];
      if(status === 200)
        this.setState({orderData: data[1]});
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }

  getDate(dateInput) {
    var d = new Date(dateInput);
    var year = d.getFullYear(), month = d.getMonth()+1, date = d.getDate();

    return year + "년 " + month + "월 " + date + "일";
  }

  render() {
    let {data, orderData} = this.state;
    let stockQuantity = data[0].initial_quantity;
    return (
      <div className="animated fadeIn">
        <link rel="stylesheet" type="text/css" href="css/CreateCopy.css"></link>
        <div className="form-card">
          <div className="form-title">
            재고 등록
            <Button color="primary" style={{float: "right"}} onClick={() => {this.props.history.push(`/main/manage/stock/edit/${this.props.match.params.plantId}/${this.props.match.params.productId}`)}}>수정</Button>
          </div>
          {data.map((e) => {
            return(
              <div className="form-innercontent">
                <div className="sell-list">
                  <div className="sell-content">
                    <label className="sell-label">품목명</label>
                    <div className="sell-input">
                      {e.productName}
                    </div>
                  </div>
                </div>
                <div className="sell-list">
                  <div className="sell-content">
                    <label className="sell-label">구분</label>
                    <div className="sell-input">
                      {e.name}
                    </div>
                  </div>
                </div>
                <div className="sell-list">
                  <div className="sell-content">
                    <label className="sell-label">등록 재고</label>
                    <div className="sell-input">
                      {e.initial_quantity} 개
                    </div>
                  </div>
                </div>
                <div className="sell-list">
                  <div className="sell-content">
                    <label className="sell-label">유통기한</label>
                    <div className="sell-input">
                      {this.getDate(e.expiration)}
                    </div>
                  </div>
                </div>
                <div className="sell-list">
                  <div className="sell-content">
                    <label className="sell-label">제조일자</label>
                    <div className="sell-input">
                      {this.getDate(e.date_manufacture)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>{data[0] !== undefined ? data[0].name : null} 재고 내역</Col>
                </Row>                
              </CardHeader>
              <CardBody className="card-body">
                <Table striped>
                    <thead>
                      <tr>
                        <th>일자</th>
                        <th>구분</th>
                        <th>수량</th>
												<th>재고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.map((d, i) => {
                        stockQuantity -= d.quantity
                        return (
                          <tr key={i}>
                            <td>{this.getDate(d.date)}</td>
                            <td>상품 출하</td>
                            <td>{d.quantity}</td>
														<td>{stockQuantity}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Detail;
