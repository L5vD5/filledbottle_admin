import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Col, Row, Table, Button } from 'reactstrap';
import { registerLocale } from  "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from 'date-fns/locale/ko';
import '../../css/Table.css';
registerLocale('ko', ko)

//vos = value of supply (공급가액)
//vat = value added tax (부가세))
let d = {id: '', name: '', grade:'', weight:'', price: 0, quantity: 0};

class ManufactureDetail extends Component {
  constructor(props) {
    super(props);

    this.customer = [];

    this.state = {
      sProduct1: [d],//소모 상품
      sProduct2: [d],//생산 상품
    };
  }

  componentWillMount() {
    this.getList();
  }

  getList() {
    fetch(process.env.REACT_APP_HOST+"/api/manufacture/"+this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => {
        if (response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        let status = data[0];
        if (status === 200)
          this.setState({ sProduct1: data[1].consume, sProduct2: data[1].produce, });
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      })
  }

  render() {
    console.log(this.state)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="12" xs="12" sm="12">
          <Card>
              <CardHeader>
                <Row>
                  <Col md="10" xs="10" sm="10">소모 상품</Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead>
                    <tr>
                        <th>상품명</th>
                        <th>등급</th>
                        <th>무게</th>
                        <th>단가</th>
                        <th>소모재고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.sProduct1.map(function (e, i) {
                        return (
                          <tr key={i}>
                            <td>{e.name}</td>
                            <td>{this.state.sProduct1[i].grade}</td>
                            <td>{this.state.sProduct1[i].weight}</td>
                            <td>{this.state.sProduct1[i].price_shipping}</td>
                            <td>{this.state.sProduct1[i].change}</td>
                          </tr>
                        )
                      }, this)
                    }
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                  <Button onClick={() => {this.props.history.push(`/main/manufacture/edit/:id`)}} style={{marginLeft : '10px'}}>수정</Button>
                  <Button onClick={() => {}} style={{marginLeft : '10px'}}>제조 취소</Button>
              </CardFooter>
            </Card>
          </Col>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="10" xs="10" sm="10">생산 상품</Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table>
                  <thead>
                    <tr>
                        <th>상품명</th>
                        <th>등급</th>
                        <th>무게</th>
                        <th>단가</th>
                        <th>생산재고</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.sProduct2.map(function (e, i) {
                        return (
                          <tr key={i}>
                            <td>{this.state.sProduct2[i].name}</td>
                            <td>{this.state.sProduct2[i].grade}</td>
                            <td>{this.state.sProduct2[i].weight}</td>
                            <td>{this.state.sProduct2[i].price_shipping}</td>
                            <td>{this.state.sProduct2[i].change}</td>
                          </tr>
                        )
                      }, this)
                    }
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ManufactureDetail;