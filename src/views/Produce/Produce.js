import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Input } from 'reactstrap';

class Produce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
  }

  getDate(dateInput) {
    var d = new Date(dateInput);
    var year = d.getFullYear(), month = d.getMonth()+1, date = d.getDate();

    return year + "년 " + month + "월 " + date + "일";
  }

  

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                    <Col>생산관리</Col>
                    <Col md="2" xs="3 " sm="3">
                        <Button block color="primary" onClick={() => { this.props.history.push('/produce/create'); }}>생산 등록하기</Button>
                    </Col>
                </Row>
              </CardHeader>
              <CardBody className="card-body">
                <Table striped>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>작업명</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{cursor: 'pointer'}} onClick={() => { this.props.history.push('/main/produce/:id'); }}>
                        <td>2019.00.00</td>
                        <td>test</td>
                      </tr>
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

export default Produce;
