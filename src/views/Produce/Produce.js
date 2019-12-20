import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import { Card, CardBody, CardHeader, Col, Row, Table, Button, Input, CardFooter, Pagination, PaginationItem, PaginationLink,} from 'reactstrap';

const listCount = 5;

class Produce extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      number: 1,
      keyword: 'a',
    };
  }

  componentWillMount() {
    this.getList();
  }
  
  getTotal() {
    fetch(process.env.REACT_APP_HOST+"/api/produce/total/"+this.state.keyword, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
      })
      .then(response => {
        if(response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        const status = data[0];
        if(status === 200) {
          this.setState({total: Math.ceil(data[1][0].total/listCount)})
        } else {
          alert('로그인 하고 접근해주세요')
          this.props.history.push('/login')
        }
      });
  }

  getList() {
    fetch(process.env.REACT_APP_HOST+"/api/produce/list/"+this.state.number+'/'+this.state.keyword, {
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
          this.setState({ data: data[1] });
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
        this.getTotal();
      })
  }

  getDate(dateInput) {
    var d = new Date(dateInput);
    var year = d.getFullYear(), month = d.getMonth()+1, date = d.getDate();

    return year + "년 " + month + "월 " + date + "일";
  }

  render() {
    const arr = [-2, -1, 0, 1, 2];
    const arr1 = [];
    let {data} = this.state;

    console.warn(this.state.data)
    return (
      <div className="animated fadeIn">
        <Row className="">
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col>생산 상세 검색</Col>
                  <Col md="2" xs="3" sm="3">
                    <Button block color="primary" onClick={() => { this.props.history.push('/produce/create'); }}>생산 등록</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table>
                  <tbody>
                    <tr>
                      <th style={{textAlign: "center"}}>날짜</th>
                      <td>
                        <div style={{ pointer: 'cursor', width : 140}}>
                          <DatePicker
                            dateFormat="yyyy년 MM월 dd일"
                            locale="ko"
                            selected={this.state.first_date}
                            onChange={(first_date) => { this.setState({ first_date }) }}
                          />
                        </div>
                      </td>
                      <td style={{ width : 30}}>~</td>
                      <td>
                        <div style={{ pointer: 'cursor' }}>
                          <DatePicker
                            dateFormat="yyyy년 MM월 dd일"
                            locale="ko"
                            selected={this.state.last_date}
                            onChange={(last_date) => { this.setState({ last_date }) }}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th style={{textAlign: "center"}}>생산제품명</th>
                      <td colSpan="3"><Input onChange={(e) => { this.keyword = e.target.value }} /></td>
                    </tr>
                  </tbody>
                </Table>
                <Row>
                  <Col md="2" xs="3" sm="3">
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button block color="primary" onClick={() => { }}>생산품 검색</Button>
              </CardFooter>
            </Card>
          </Col>          
        </Row>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                    <Col>생산관리</Col>
                    <Col md="2" xs="3 " sm="3">
                    </Col>
                </Row>
              </CardHeader>
              <CardBody className="card-body">
                <Table striped>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>생산품</th>
                        <th>생산수량</th>
                        <th>작업명</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((e, i) => {
                        return <tr style={{cursor: 'pointer'}} onClick={() => { this.props.history.push('/main/produce/:id'); }}>
                          <td>{this.getDate(e.created_date)}</td>
                          <td>{e.productName}</td>
                          <td></td>
                          <td>{e.name}</td>
                          <td></td>
                        </tr>
                      })}
                    </tbody>
                  </Table>
                </CardBody>
                <CardFooter>
                  <Pagination>
                    {this.state.number === 1 ? '' :
                      <PaginationItem>
                        <PaginationLink previous onClick={() => { this.countPageNumber(this.state.number - 1) }} />
                      </PaginationItem>
                    }
                    {this.state.number === 1 ? arr.forEach(x => arr1.push(x + 2)) : null}
                    {this.state.number === 2 ? arr.forEach(x => arr1.push(x + 1)) : null}
                    {this.state.number !== 1 && this.state.number !== 2 ? arr.forEach(x => arr1.push(x)) : null}
                    {arr1.map((e, i) => {
                      if (this.state.total >= this.state.number + e)
                        return (<PaginationItem key={i} active={this.state.number === this.state.number + e}>
                          <PaginationLink onClick={() => { this.countPageNumber(this.state.number + e) }}>
                            {this.state.number + e}
                          </PaginationLink>
                        </PaginationItem>)
                      return null;
                    })}
                    {this.state.number === this.state.total ? '' :
                      <PaginationItem>
                        <PaginationLink next onClick={() => { this.countPageNumber(this.state.number + 1) }} />
                      </PaginationItem>}
                  </Pagination>
                </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Produce;