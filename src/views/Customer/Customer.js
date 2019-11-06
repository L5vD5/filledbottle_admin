import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Row, Input, CardImg, CardTitle, CardSubtitle, Table, Badge} from 'reactstrap';
import Popup from "reactjs-popup";
import Switch from "./Switch";
import ModalOption from "./ModalOption"
/*

  GET /customer/state

  -> this.state.data

  id : 주문 번호
  name : 고객 이름
  telephone : 전화번호
  cellphone : HP
  address : 주소
  이미지

*/

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sdata: [],
      search: false,
      show: true,
    };
    this.form = {

    }
  }
  
  componentWillMount() {
    this.getCustomer();
  }

  getCustomer() {
    this.setState({search: false, set: true});
    fetch(process.env.REACT_APP_HOST+"/customer", {
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
        alert('로그인 하고 접근해주세요')
        this.props.history.push('/login')
      }
    })
  }

  getUnsetCustomer() {
    this.setState({search: false, set: false});
    fetch(process.env.REACT_APP_HOST+"/customer/unset", {
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
        alert('로그인 하고 접근해주세요')
        this.props.history.push('/login')
      }
    })
  }

  deleteCustomer(id) {
    let c = window.confirm('위 고객을 비활성화하시겠습니까?')
    if (c) {
      fetch(process.env.REACT_APP_HOST+"/customer", {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          id
        })
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
          this.getCustomer()
        else {
          alert('로그인 하고 접근해주세요')
          this.props.history.push('/login')
        }  
      });
    }
  }

  

  activateCustomer(id) {
    let c = window.confirm('위 고객을 활성화하시겠습니까?')
    if (c) {
      fetch(process.env.REACT_APP_HOST+"/customer", {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          id
        })
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
          this.getUnsetCustomer()
        else {
          alert('로그인 하고 접근해주세요')
          this.props.history.push('/login')
        }
      });
    }
  }

  searchCustomer() {
    let result = this.state.data.filter(word => word.name.indexOf(this.state.keyword) !== -1)

    this.setState({sdata: result, search: true});
  }

  changeShow(){
    if(this.state.show === true) this.setState({show: false});
    else this.setState({show: true});
  }

  render() {
    var data = this.state.search ? this.state.sdata : this.state.data;
    console.warn(data)
    return (
      <div className="animated fadeIn">        
        <Row className="mb-5">
            <Col md="8" xs="6" sm="6">
              <Input onChange={(e)=> {this.setState({keyword: e.target.value})}}/>
            </Col>
            <Col md="2" xs="3" sm="3">
              <Button block color="primary" onClick={()=> {this.searchCustomer()}}>고객 검색</Button>
            </Col>
            <Col md="2" xs="3 " sm="3">
              <Button block color="primary" onClick={()=> {this.props.history.push('/customer/create');}}>등록하기</Button>
            </Col>            
        </Row>
        <Row className="mb-5">
          <Col>
            <Card>
              <CardBody>
                <Row>
                  {this.state.set ?
                    <Col md="2" xs="3 " sm="3">
                      <Button block color="primary" onClick={() => { this.getUnsetCustomer() }}>비활성화 고객 보기</Button>
                    </Col> :
                    <Col md="2" xs="3 " sm="3">
                      <Button block color="primary" onClick={() => { this.getCustomer() }}>활성화 고객 보기</Button>
                    </Col>
                  }
                  {this.state.show ?
                    <Col md="2" xs="3 " sm="3">
                      <Button block color="primary" onClick={() => { this.changeShow() }}>카드로 보기</Button>
                    </Col> :
                    <Col md="2" xs="3 " sm="3">
                      <Button block color="primary" onClick={() => { this.changeShow() }}>리스트로 보기</Button>
                    </Col>
                  }
                  <Col md="4" xs="3 " sm="3">
                    {<Popup
                      trigger={<Input value={this.state.customerName} style={{ cursor: 'pointer', backgroundColor: '#ffffff' }} onChange={() => { console.log('S') }} readOnly />}
                      modal>
                      {close => <ModalOption close={close}
                        selectCustomer={(data) => {
                          let { address, cellphone, name, id, telephone } = data;
                          this.setState({
                            address,
                            cellphone,
                            customerName: name,
                            sCustomer: id,
                            telephone
                          })
                          /* set, for instance, comment[1] to "some text"*/
                        }} />}
                    </Popup>}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>          
        </Row>
        {this.state.show ?
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Row>
                    <Col>고객 보기</Col>
                    <Col></Col><Col></Col>
                    <Col>
                      {this.state.set ?
                      "비활성화 고객 보기":
                      "활성화 고객 보기"
                      }
                      {this.state.set ?
                      <Switch handleToggle={this.getUnsetCustomer.bind(this)}/>:
                      <Switch handleToggle={this.getCustomer.bind(this)}/>
                      }
                    </Col>
                    <Col>
                      {this.state.show ?
                        "카드으로 보기":
                        "리스트로 보기"
                        }
                      {this.state.show ?
                        <Switch handleToggle={this.changeShow.bind(this)}/>:
                        <Switch handleToggle={this.changeShow.bind(this)}/>
                        }
                    </Col>
                  </Row>                  
                </CardHeader>
                <CardBody>
                  <div style={{ overflow: 'scroll' }}>
                    <Table style={{ minWidth: 600 }} hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>고객명</th>
                          <th>전화번호</th>
                          <th>HP</th>
                          <th>주소</th>
                          {this.state.set ?
                            <th>고객 비활성화</th> :
                            <th>고객 활성화</th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((e, i) => {
                          return (<tr style={{ cursor: 'pointer' }} key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.name}</td>
                            <td>{e.telephone}</td>
                            <td>{e.cellphone}</td>
                            <td>{e.address}</td>
                            {this.state.set ?
                              <td>
                                <Button block style={{width:120}} color="ghost-danger" onClick={() => this.deleteCustomer(e.id)}>고객 비활성화</Button>
                              </td> :
                              <td>
                                <Button block style={{width:100 }}color="ghost-primary" onClick={() => this.activateCustomer(e.id)}>고객 활성화</Button>
                              </td>
                            }
                          </tr>)
                        })}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          :
          <Row className="mb-5">
            <Col>
              <Card>
                <CardHeader>
                  <Row>
                    <Col>고객 보기</Col>
                    <Col></Col><Col></Col>
                    <Col>
                      {this.state.set ?
                      "비활성화 고객 보기":
                      "활성화 고객 보기"
                      }
                      {this.state.set ?
                      <Switch handleToggle={this.getUnsetCustomer.bind(this)}/>:
                      <Switch handleToggle={this.getCustomer.bind(this)}/>
                      }
                    </Col>
                    <Col>
                      {this.state.show ?
                        "카드으로 보기":
                        "리스트로 보기"
                        }
                      {this.state.show ?
                        <Switch handleToggle={this.changeShow.bind(this)}/>:
                        <Switch handleToggle={this.changeShow.bind(this)}/>
                        }
                    </Col>
                  </Row>                  
                </CardHeader>
                <CardBody>
                  <Row>
                      {data.map(function (e, i) {
                        return (
                          <Col key={i} lg="4" md="6" xs="12" sm="12">
                            <Card>
                              <CardHeader>
                                {e.name}
                              </CardHeader>
                              <CardImg top width="100%" src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} alt="Card image cap" />
                              <CardBody>
                                <CardTitle><h3>고객명 : {e.name}</h3></CardTitle>
                                <CardSubtitle><h4>전화번호 : {e.telephone}</h4></CardSubtitle>
                                <CardSubtitle><h4>HP : {e.cellphone}</h4></CardSubtitle>
                                <CardSubtitle><h4>주소 : {e.address}</h4></CardSubtitle>
                                <Button block outline color="primary" onClick={() =>
                                  this.props.history.push({
                                    pathname: '/main/sales/list',
                                    state: { name: e.name }
                                  })}
                                >주문 조회</Button>
                                <Button block outline color="primary" onClick={() => alert('준비중입니다.')}>고객 분석</Button>
                              </CardBody>
                              {this.state.set ?
                                <CardFooter>
                                  <Button block color="ghost-danger" onClick={() => this.deleteCustomer(e.id)}>고객 비활성화</Button>
                                </CardFooter> :
                                <CardFooter>
                                  <Button block color="ghost-danger" onClick={() => this.activateCustomer(e.id)}>고객 활성화</Button>
                                </CardFooter>
                              }
                            </Card>
                          </Col>)
                      }.bind(this))
                      }
                  </Row>

                </CardBody>
              </Card>
            </Col>
          </Row>
        }
      </div>
    )
  }
}



export default Customer;
