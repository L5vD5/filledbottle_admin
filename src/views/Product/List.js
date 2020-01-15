import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, CardImg, Col, Row, Input, CardTitle, CardSubtitle, Table, Pagination, PaginationItem, PaginationLink, FormGroup, InputGroup, InputGroupAddon, } from 'reactstrap';
import Switch from "../Switch/Switch";
import ImageModal from '../Modal/ImageModal';
import Popup from "reactjs-popup";

/*

  GET /product/state

  -> this.state.data

  id : 주문 번호
  name : 품목명
  grade : 등급
  weight : 무게
  price_shipping : 단가

*/

const listCount = 15;
 
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: [],
      stockData: [],
      page: 1,
      name: '',
      family: 0,
      //set: true,
      stockEdit: false,
      familyData: [],
      show: false,
    };
    this.name = '';
    this.family = 0;
    this.form = {

    }
  }
  componentWillMount() {
    if(this.props.location.state) {
      const {page, name, family} = this.props.location.state
      this.setState({
        page, name, family
      }, () => {
        this.getProduct();
        this.getStock();    
      })
    } else {
      this.getProduct();
      this.getStock();  
    }
    this.getProductFamily();
  }

  getTotal() {
    const {name, family} = this.state;

    fetch(process.env.REACT_APP_HOST + "/product/total/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          name, family
        }
      )
    })
      .then(response => {
        if (response.status === 401) {
          return Promise.all([401])
        } else {
          return Promise.all([response.status, response.json()]);
        }
      })
      .then(data => {
        const status = data[0];
        if (status === 200) {
          this.setState({ total: Math.ceil(data[1][0].total / listCount) })
        } else {
          alert('로그인 하고 접근해주세요')
          this.props.history.push('/login')
        }
      });
  }

  getProduct() {
    const {page, name, family} = this.state;
    fetch(process.env.REACT_APP_HOST + "/product/list", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          page, name, family
        }
      )
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
          this.setState({ productData: data[1] });
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
        this.getTotal();
      })
  }

  getStock() {
		const {page, name, family} = this.state;

    fetch(process.env.REACT_APP_HOST + "/api/stock/list/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          page, name, family
        }
      )
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
          this.setState({ stockData: data[1] });
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      });
  }

  modifyStock(id, quantity) {
    fetch(process.env.REACT_APP_HOST + `/api/stock/` + id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          quantity
        }
      )
    })
  }

  searchProduct() {
    let { name } = this;
    //let keyword = this.keyword
    this.setState({ name, page: 1 }, () => {
			this.getProduct();
			this.getStock();
    })
  }

  changeStockEdit() {
    this.getStock();
    this.setState({ stockEdit: !this.state.stockEdit })
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /*changeSet() {
    this.setState({set: !this.state.set}, () => {
      this.getProduct();
    });
  }*/

  countPageNumber(x) {
    this.setState({
      page: x,
    }, () => {
      this.getProduct();
      this.getStock();
    });
  }

  getProductFamily() {
    fetch(process.env.REACT_APP_HOST + "/api/product/familyList", {
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
        if (status === 200){
          this.setState({ familyData: data[1] });
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      })
  }

  addProductFamily() {
    let {newFamily} = this.state;
    fetch(process.env.REACT_APP_HOST + "/api/product/family", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({newFamily})
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
      if (status === 200) {
        this.getProductFamily();
        this.setState({newFamily: ''})
      }
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    })
  }

  changeFamily (family) {
    //let keyword = this.keyword
    this.setState({ name: '', family, page: 1 }, () => {
      this.getProduct();
      this.getStock();
    })
  }

  changeShow() {
    this.setState({ show: !this.state.show })
    console.log(this.state.show)
  }

  render() {
    var data = this.state.productData;
    var {stockData} = this.state;
    var {familyData} = this.state;
    const arr = [-2, -1, 0, 1, 2];
    const arr1 = [];

    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row>
                  <Col>품목 상세 검색</Col>
                  <Col md="2" xs="3" sm="3">
                    <Input onChange={(e) => { this.name = e.target.value }} />
                  </Col>
                  <Col md="2" xs="3" sm="3">
                    <Button block color="primary" onClick={() => { this.searchProduct() }}>품목 검색</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Row>
                  <ul style={{width: '100%', display: 'flex', 'flex-wrap': 'wrap'}}>
                    <li style={{width: 'calc((100% - 80px) / 5)', color : this.state.family === 0? 'red' : 'black'}} onClick = {() => this.changeFamily(0)}>
                      전체
                    </li>
                    {
                      familyData.map((e, i) => {
                        return <li style={{width: 'calc((100% - 80px) / 5)', color : this.state.family === e.id? 'red' : 'black'}}  onClick = {() => this.changeFamily(e.id)}>{e.name}</li>
                      })
                    }
                    <li style={{width: 'calc((100% - 80px) / 5)'}}>
                      <InputGroup>
                        <Input style={{ width: 10 }} value={this.state.newFamily} onChange={(e) => {
                          let newFamily = e.target.value;
                          this.setState({ newFamily })
                        }} />
                        <InputGroupAddon addonType="append">
                          <Button onClick={this.addProductFamily.bind(this)} outline color="success">+</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </li>
                  </ul>
                </Row>
                <Row style={{marginBottom: 15}}>
                  <Col></Col>
                  <Col></Col><Col></Col><Col></Col>
                  {/*<Col>
                    {this.state.set ?
                      "비활성화 품목 보기" :
                      "활성화 품목 보기"}
                    <Switch id='1' isOn={this.state.set} handleToggle={this.changeSet.bind(this)} />
                  </Col>
                  <Col>
                    {this.state.show ?
                      "카드로 보기" :
                      "리스트로 보기"
                    }
                    <Switch id='2' isOn={this.state.show} handleToggle={() => this.changeShow()} />
                  </Col>*/}
                  <Col><Button block color="primary" onClick={() => { this.props.history.push('/main/product/list/unset') }}>비활성화 품목 보기</Button></Col>
                  <Col>
                    {this.state.stockEdit ?
                      <Button block color="primary" onClick={() => this.changeStockEdit()}>수정 완료</Button> :
                      <Button block color="primary" onClick={() => this.changeStockEdit()}>재고 수정</Button>}
                  </Col>
                  <Col> 
                    <Button block color="primary" onClick={() => { this.props.history.push('/product/create'); }}>품목 등록</Button>
                  </Col>
                  <div>
                    <a style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => {this.changeShow()}}><i className="fa fa-th-list" style={{display: "block"}}></i>
                    </a>
                    <a style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => {this.setState(this.state.show === false)}}><i className="fa fa-th" style={{display: "block"}}></i></a>
                  </div>
                </Row>
                {this.state.show ?
                <Row>
                  <Table style={{ minWidth: 600 }} hover>
                    <thead>
                      <tr>
                        <th style={{ width: 150 }}>사진</th>
                        <th>품목명</th>
                        <th style={{ width: 250 }}>품목군</th>
                        <th>판매 단가</th>
                        <th>재고</th>
                        {this.state.stockEdit ?
                          <th style={{ width: 100 }}>수정</th> : ""}
                        {/*this.state.set ?
                            <th style={{width : 300}}>품목 비활성화</th> :
                            <th style={{width : 300}}>품목 활성화</th>
                          */}
                        {/*<th>수정</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((e, i) => {
                        return (<tr key={e.id}>
                          <td>
                            <img style={{ width: '90%' }} alt="품목 사진" src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} />
                          </td>
                          <td style={{ cursor: 'pointer'}} onClick={() => {
                            this.props.history.push({
                              pathname: '/main/product/' + e.id,
                              state: {name: this.state.name, family: this.state.family, page: this.state.page}
                            })
                          }}>{e.name + ' ' + e.grade + ' ' + e.weight}</td>
                          <td>{e.familyName}</td>
                          <td>{this.numberWithCommas(e['price_shipping'])}&nbsp;원</td>
                          {this.state.stockEdit ?
                            <td style={{ width: 250 }}><Input defaultValue={stockData[i] !== undefined ? stockData[i].quantity : null} onChange={(e) => { stockData[i].quantity = e.target.value; }} /></td> :
                            <td style={{ cursor: 'pointer' }} onClick={() => { this.props.history.push(`/main/stock/${e.id}`) }}>{stockData[i] !== undefined ? stockData[i].quantity : null}</td>}
                          {this.state.stockEdit ?
                            <Col><Button onClick={() => { this.modifyStock(e.id, stockData[i].quantity) }} color="primary" >수정</Button></Col> :
                            ""}
                          {/*this.state.set ?
                              <td>
                                <Button block style={{ width: 120 }} color="ghost-danger" onClick={() => this.deleteProduct(e.id)}>품목 비활성화</Button>
                              </td> :
                              <td>
                                <Button block style={{ width: 100 }} color="ghost-primary" onClick={() => this.activateProduct(e.id)}>품목 활성화</Button>
                              </td>
                            */}
                          {/*<td><Button  onClick={() => {this.props.history.push(`/main/product/edit/:id`)}}>수정</Button></td>*/}
                          {/*<td>
                            {<Popup
                              trigger={<Button>사진</Button>}
                              modal>
                              {close => <ImageModal close={close} product_id={e.id} login={() => { this.props.history.push('/login') }} />}
                            </Popup>}
                          </td>*/}
                        </tr>)
                      })}
                    </tbody>
                  </Table>
                </Row>
                :
                <Row>
                  {data.map(function (e, i) {
                    return (
                      <Col key={i} style={{width: '20%', textAlign: 'left'}}>
                        <li style={{listStyleType : 'none'}}>
                          <a style={{textAlign: 'center'}}>
                            <p><CardImg top style={{display: 'inline-block', width:"285px", height:"285px"}} src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} alt="Card image cap" /></p>
                            <p style={{fontWeight: 'bold'}}>{e.name + ' ' + e.grade + ' ' + e.weight}</p>
                            <p>{e.familyName}</p>
                            <p>{this.numberWithCommas(e['price_shipping'])}&nbsp;원</p>
                          </a>
                        </li>
                        {/*<Card>
                          <CardImg top width="100%" src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} alt="Card image cap" />
                          <CardBody>
                            <CardTitle><h3>품목명 : {e.name + ' ' + e.grade + ' ' + e.weight}</h3></CardTitle>
                            <CardSubtitle><h4>품목군 : {e.familyName}</h4></CardSubtitle>
                            <CardSubtitle><h4>판매단가 : {this.numberWithCommas(e['price_shipping'])}&nbsp;원</h4></CardSubtitle>
                            <CardSubtitle><h4>재고 : {e.address}</h4></CardSubtitle>
                          </CardBody>
                        </Card>*/}
                      </Col>)
                  }.bind(this))
                  }
                </Row>
            }
              </CardBody>
              <CardFooter>
                <Pagination>
                  {this.state.page === 1 ? '' :
                    <PaginationItem>
                      <PaginationLink previous onClick={() => { this.countPageNumber(this.state.page - 1) }} />
                    </PaginationItem>
                  }
                  {this.state.page === 1 ? arr.forEach(x => arr1.push(x + 2)) : null}
                  {this.state.page === 2 ? arr.forEach(x => arr1.push(x + 1)) : null}
                  {this.state.page !== 1 && this.state.page !== 2 ? arr.forEach(x => arr1.push(x)) : null}
                  {arr1.map((e, i) => {
                    if (this.state.total >= this.state.page + e)
                      return (<PaginationItem key={i} active={this.state.page === this.state.page + e}>
                        <PaginationLink onClick={() => { this.countPageNumber(this.state.page + e) }}>
                          {this.state.page + e}
                        </PaginationLink>
                      </PaginationItem>)
                    return null;
                  })}
                  {this.state.page === this.state.total ? '' :
                    <PaginationItem>
                      <PaginationLink next onClick={() => { this.countPageNumber(this.state.page + 1) }} />
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

export default List;
