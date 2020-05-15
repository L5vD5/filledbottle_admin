import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, Col, Row, Table, Input } from 'reactstrap';
import Popup from "reactjs-popup";
import ProductModal from '../Modal/ProductModal';
import CustomerModal from '../Modal/CustomerModal';
import DatePicker from "react-datepicker";

//TODO : 입력창에 placefolder 수정하기

//vos = value of supply (공급가액)
//vat = value added tax (부가세))
let d = {id: '', name: '', plant: 0, quantity: 0, price: 0, vos: 0, vat: 0, tax: false, sum: 0};
let p = {id: '', name: ''};

class Create extends Component {
  constructor(props) {
    super(props);

    this.customer = [];
    this.state = {
      plantData: [[p]],
      product: [],
      sProduct: [d],
      sCustomer: null, //선택된 거래처
      date: new Date(),
      manager: '',
      address: '',
      cellphone: '',
      telephone: '',
      customerName: '',
      comment: '',
    };
  }
  componentWillMount() {
    //this.getPlant();
  }

  convertDateFormat(date) {
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  getPlant(i){
    const {productFamily} = this.state;
    fetch(process.env.REACT_APP_HOST+"/api/plant/searchPlant", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({productFamily})
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
        if(status === 200){
          let {plantData, sProduct} = this.state;
          plantData[i] = data[1];
          if(data[1][0] === undefined) alert("창고에서 품목을 취급하지 않습니다")
          else {
            sProduct[i].plant = data[1][0].id;
            this.setState({plantData, sProduct});
          }
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }

  getFamilyId(id, i){
    fetch(process.env.REACT_APP_HOST+"/api/product/familyId/"+id, {
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
        if(status === 200){
          this.setState({productFamily: data[1][0].id}, () => {
            this.getPlant(i)
          })
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }

  addOrder() {
    const {sCustomer, sProduct, cellphone, telephone, address, comment} = this.state;
    let {date} = this.state;

    date = this.convertDateFormat(date);
    const orderDate = this.convertDateFormat(new Date());

    if (this.state.sCustomer === null) {
      alert("고객 아이디를 입력해주세요.");
    }
    else {
      fetch(process.env.REACT_APP_HOST+"/order", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({date, sCustomer, sProduct, cellphone, telephone, address, comment, orderDate})
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
            this.props.history.push('/sales/list');
          } else if(status === 401) {
            alert('로그인 하고 접근해주세요.')
            this.props.history.push('/login')
          } else {
            alert('에러로 인해 등록에 실패했습니다.')
          }
        });
    }
  }


  /*getPlant(){
    fetch(process.env.REACT_APP_HOST+"/api/plant", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
      if(status === 200){
        let {sProduct} = this.state;
        sProduct[0].plant = data[1][0].id
        this.setState({plantData: data[1], sProduct});
        d.plant = data[1][0].id
      }
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }*/

  vaild() {
    let length = this.state.sProduct.length;
    for(var i = 0; i < length; i++){
      if(this.state.sProduct[i].b === '' || this.state.sProduct[i].c === ''){
        return(true)
      }
    }
    return(!this.state.manager)
  }

  countQuantity(){
    this.setState({refund: false});
  }

  render() {
    console.warn(this.state.plantData)
    return (
      <div className="animated fadeIn">
        <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
        <link rel="stylesheet" type="text/css" href="css/Order.css"></link>
        <Row>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                주문서
              </CardHeader>
              <CardBody>
                <Table className="ShowTable">
                  <tbody>
                  <tr>
                    <th>일자</th>
                    <td>
                      <div style={{pointer: 'cursor'}}>
                        <DatePicker
                          className="datepicker"
                          dateFormat="yyyy년 MM월 dd일"
                          locale="ko"
                          selected={this.state.date}
                          onChange={(date) => {this.setState({date})}}
                        />
                      </div>
                    </td>
                    <th>고객<span style={{color : "#FA5858"}}>*</span></th>
                    <td >
                      {<Popup
                        trigger={<Input require placeholder={ "고객을 선택해주세요" } value={this.state.customerName} style={{cursor: 'pointer', backgroundColor: '#ffffff'}} onChange={() => {console.log('S')}}/>}
                        modal>
                        {close => <CustomerModal close={close} login={()=>{this.props.history.push('/login')}} createCustomer={() => {this.props.history.push('/customer/create')}}
                                                 selectCustomer={(data) => {
                                                   let {address, cellphone, name, id, telephone} = data;
                                                   this.setState({
                                                     address,
                                                     cellphone,
                                                     customerName: name,
                                                     sCustomer: id,
                                                     telephone
                                                   })
                                                   /* set, for instance, comment[1] to "some text"*/
                                                 }}/>}
                      </Popup>}
                    </td>
                  </tr>
                  <tr>
                    <th>연락처 1</th>
                    <td >
                      <Input value={this.state.cellphone} type="tel" pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}" placeholder={ "000-0000-0000" }onChange={(e) => {this.setState({cellphone: e.target.value})}} />
                    </td>
                    <th>연락처 2</th>
                    <td>
                      <Input value={this.state.telephone} type="tel" placeholder={ "집 전화번호가 있다면 적어주세요" } onChange={(e) => {this.setState({telephone: e.target.value})}} />
                    </td>
                  </tr>
                  <tr >
                    <th>주소</th>
                    <td>
                      <Input value={this.state.address} placeholder={ "ΟΟ 시/군 ΟΟ 구/면 ΟΟ 동/읍/리, 상세주소" } onChange={(e) => {this.setState({address: e.target.value})}} />
                    </td>
                    <th>요청사항</th>
                    <td >
                      <Input value={this.state.comment} placeholder={ "부재시 문 앞에 놔주세요/부재시 연락부탁드립니다 등" }onChange={(e) => {
                        this.setState({
                          comment: e.target.value
                        })
                      }} />
                    </td>
                  </tr>

                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="12" xs="12" sm="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>품목을 입력하세요</Col>
                  <Col>
                    <div style={{float : "right"}}>
                      <Button block color="primary"
                              onClick={()=> {
                                let {sProduct, plantData} = this.state;
                                sProduct.push(d);
                                plantData.push([p]);
                                this.setState({
                                  sProduct, plantData
                                })}}>
                        추가하기
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div style={{overflowX : "auto", whiteSpace: "nowrap"}}>
                  <Table className="ListTable">
                    <thead>
                    <tr>
                      <th>품목<span style={{color : "#FA5858"}}>*</span></th>
                      <th>창고<span style={{color : "#FA5858"}}>*</span></th>
                      <th>수량</th>
                      <th>판매 단가</th>
                      <th>공급가액</th>
                      <th>부가세</th>
                      <th>과세</th>
                      <th>총액</th>
                      <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.sProduct.map(function (e, i) {
                        return (
                          <tr key={i}>
                            <td>
                              {<Popup
                                trigger={<Input required placeholder={"선택해주세요"} name='name' value={this.state.sProduct[i].name} style={{cursor: 'pointer', backgroundColor: '#ffffff'}} onChange={() => {console.log('S')}}/>}
                                modal>
                                {close => <ProductModal index={i} close={close} login={()=>{this.props.history.push('/login')}} createProduct={() => {this.props.history.push('/product/create')}}
                                                        selectProduct={(data) => {
                                                          let {sProduct} = this.state;

                                                          let val = Object.assign({}, sProduct[i]);

                                                          /* set, for instance, comment[1] to "some text"*/
                                                          val['id'] = data['id'];
                                                          val['name'] = data['name'];
                                                          val['price'] = data['price_shipping'];

                                                          sProduct[i] = val;
                                                          {}

                                                          /* set the state to the new variable */
                                                          this.setState({sProduct});
                                                          this.getFamilyId(data['id'], i)
                                                        }}
                                />}
                              </Popup>}
                            </td>
                            <td>
                              <Input value={this.state.sProduct[i].plant} onChange={(e) => {
                                let {sProduct} = this.state;
                                sProduct[i].plant = e.target.value;
                                this.setState({sProduct})
                              }} type='select' name="plant">
                                {
                                  this.state.plantData[i].map((e, i) => {
                                    return <option key={i} value={e.id} >{e.name}</option>
                                  })
                                }
                              </Input>
                            </td>
                            <td style={{width : 200}}>
                              <Input type="number" name='quantity' style={{width: 50, display: 'inline-block'}} value={this.state.sProduct[i].quantity} onChange={(e)=> {
                                let {sProduct} = this.state;
                                sProduct[i].quantity > 0 ? sProduct[i].quantity = e.target.value :  sProduct[i].quantity= Math.abs(e.target.value)
                                //sProduct[i].quantity = e.target.value;
                                this.setState({sProduct})}}
                              />
                              <Button onClick={(e)=> {
                                let sProduct = this.state.sProduct;
                                sProduct[i].quantity > 0 ? sProduct[i].quantity-- : sProduct[i].quantity= 0
                                this.setState({
                                  sProduct
                                })}}>-</Button>
                              <Button onClick={(e)=> {
                                let sProduct = this.state.sProduct;
                                sProduct[i].quantity++;
                                this.setState({
                                  sProduct
                                })}}>+</Button>
                            </td>
                            <td><Input name='price' value={this.state.sProduct[i].price} readOnly/></td>
                            <td><Input name='vos' value={this.state.sProduct[i].tax ? Math.round(this.state.sProduct[i].price * this.state.sProduct[i].quantity * 10 / 11) : Math.round(this.state.sProduct[i].price * this.state.sProduct[i].quantity)} readOnly/></td>
                            <td><Input name='vat' value={this.state.sProduct[i].tax ? Math.round(this.state.sProduct[i].price * this.state.sProduct[i].quantity * 1 / 11) : 0} readOnly/></td>
                            <td style={{width : 80}}>
                              <input name='tax' type='checkbox' defaultChecked={this.state.sProduct[i].tax} onClick={() => {
                                let {sProduct} = this.state;

                                let val = Object.assign({}, sProduct[i]);

                                val.tax = !val.tax;
                                sProduct[i] = val;
                                this.setState({sProduct})
                              }}/>
                            </td>
                            <td><Input name='sum' value={this.state.sProduct[i].price * this.state.sProduct[i].quantity} readOnly/></td>
                            <td style={{width : 70}}>
                              <Button block color="danger"
                                      onClick={()=> {
                                        let {sProduct} = this.state;
                                        sProduct.splice(i, 1);
                                        this.setState({
                                          sProduct
                                        })
                                      }}>
                                X
                              </Button>
                            </td>
                          </tr>
                        )
                      }, this)
                    }
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Button block color="primary" onClick={() => {
          this.addOrder(this.state);
        }}>주문 추가하기</Button>
      </div>
    )
  }
}

export default Create;
