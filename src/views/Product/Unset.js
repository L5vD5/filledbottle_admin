import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, CardFooter, CardImg, Col, Row, Input,
   CardTitle, CardSubtitle, Table, Pagination, PaginationItem, PaginationLink, FormGroup,
   InputGroup, InputGroupAddon, UncontrolledButtonDropdown, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import Popup from "reactjs-popup";
import ProductFamilyModal from '../Modal/ProductFamilyModal';

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
global.show = true;

class Unset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: [],
      stockData: [],
      page: 1,
      name: '',
      family: 0,
      //set: true,
      stockEdit : false,
      familyData: [],
      userCategoryData: [],
    };
    this.name = '';
    this.family = 0;
    this.form = {

    }

    this.changeShowFalse.bind(this);
		this.changeShowTrue.bind(this);
  }
  componentWillMount() {
    if(this.props.location.state) {
      const {page, name, family} = this.props.location.state
      this.setState({
        page, name, family
      }, () => {
        this.getUserFamilyCategory();
      })
    } else {
      this.getUserFamilyCategory(); 
    }
  }

  getTotal() {
    const {name, family, category} = this.state;

    fetch(process.env.REACT_APP_HOST + "/product/total/unset/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          name, family, category
        }
      )
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

  getUserFamilyCategory() {
		fetch(process.env.REACT_APP_HOST + "/api/product/userFamilyCategory", {
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
					if(data[1].length !== 0) {
						this.setState({ userCategoryData: data[1],
							category: data[1][0].id }, () => {
								this.getProductFamily();
							});
					} else {
						alert('없음')
					}
					
        }
        else {
          alert('로그인 하고 접근해주세요');
          this.props.history.push('/login');
        }
      })
	}

  getProduct() {
    const {page, name, family, category} = this.state;
    fetch(process.env.REACT_APP_HOST + "/product/list/unset/", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          page, name, family, category
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

  /*getStock() {
    const {page, name, family} = this.state;

    fetch(process.env.REACT_APP_HOST+"/api/stock/list/"+this.state.page, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(
        {
          page, name, family, plant: 'all'
        }
      )
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
        this.setState({stockData: data[1]});
      else {
        alert('로그인 하고 접근해주세요');
        this.props.history.push('/login');
      }
    });
  }*/

  modifyStock(id, quantity) {
    fetch(process.env.REACT_APP_HOST+`/api/stock/` + id, {
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
    let {name} = this;
    //let keyword = this.keyword
    this.setState({name, page: 1}, () => {
      this.getProduct();
			//this.getStock();
    })
  }

  changeStockEdit() {
    //this.getStock();
    this.setState({stockEdit: !this.state.stockEdit})
  }

  /*changeSet() {
    this.setState({set: !this.state.set}, () => {
      this.getProduct();
    });
  }*/

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  changeCategory(id) {
		this.setState({
			category: id,
			page: 1,
			family: 0,
		}, () => {
			this.getProductFamily();
		})
  }

  countPageNumber(x){
    this.setState({
      page: x,
    }, () => {
      this.getProduct();
      //this.getStock();
    });
  }

  getProductFamily() {
    fetch(process.env.REACT_APP_HOST + "/api/product/familyList/"+this.state.category, {
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
          this.setState({ familyData: data[1] }, () => {
						this.getProduct();
            //this.getStock();
          })
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
    this.setState({ name: '', family, page: 1 }, () => {
      this.getProduct();
      //this.getStock();
    })
  }

  changeShowFalse() {
		global.show = false;
		this.forceUpdate();
    console.log(this.state.show)
  }

  changeShowTrue() {
    global.show = true;
		this.forceUpdate();
    console.log(this.state.show)
  }

  render() {
    var data = this.state.productData;
    var {stockData, familyData, userCategoryData} = this.state;
    const arr = [-2, -1, 0, 1, 2];
    const arr1 = [];

    return (
      <div className="animated fadeIn">
      <link rel="stylesheet" type="text/css" href="css/Table.css"></link>
      <link rel="stylesheet" type="text/css" href="css/Product.css"></link>
        <Row>
          <Col>
            <Table className="category-top">
              <tbody>
                <tr>
                  {
                    userCategoryData.map((e, i) => {
                      return <td key={i} style={{cursor: "pointer", backgroundColor: this.state.category===e.id ? '#E6E6E6' : '#fff'}} onClick={() => {this.changeCategory(e.id)}}>{e.name}</td>
                    })
                  }
                </tr>
              </tbody>
            </Table>
            <Card>
              <CardHeader>
                <Row>
                  <Col>품목 상세 검색</ Col>
                  <Col md="3" xs="6" sm="6">
                    <InputGroup>
                      <Input onChange={(e) => { this.name = e.target.value }} />
                      <InputGroupAddon addonType="append">
                        <Button block color="primary" onClick={() => { this.searchProduct() }}><i class="fa fa-search"></i></Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <hr></hr>
                <Row>
                  <Col>
                  <ul className="list-productfamily-ul" style={{width: '100%', display: 'flex', 'flex-wrap': 'wrap', listStyleType: 'none', cursor: 'pointer'}}>
                    <li className="list-productfamily" style={{backgroundColor: this.state.family === 0? '#F16B6F' : 'transparent', border: this.state.family === 0? '0px' : '1px solid #c9d6de',color: this.state.family === 0? '#fff' : '#52616a', fontWeight: this.state.family === 0? 'bold' : 'normal', fontSize: this.state.family === 0? '1.1em' : '1em'}} onClick = {() => this.changeFamily(0)}>
                      전체
                    </li>
                    {
                      familyData.map((e, i) => {
                        return <li className="list-productfamily" style={{backgroundColor: this.state.family === e.id? '#F16B6F' : 'transparent', border: this.state.family === e.id? '0px' : '1px solid #c9d6de', color: this.state.family === e.id? '#fff' : '#52616a', fontWeight: this.state.family === e.id? 'bold' : 'normal', fontSize: this.state.family === e.id? '1.1em' : '1em'}}  onClick = {() => this.changeFamily(e.id)}>{e.name}</li>
                      })
                    }
                    {/*<Popup
                          trigger={<li className="list-productfamily" style={{border: '1px solid #c9d6de', color: 'lightgreen',}}>+</li>}
                          modal>
                          {close => <ProductFamilyModal close={close} login={() => { this.props.history.push('/login') }}
                          />}
                    </Popup>*/}
                      {/*<InputGroup>
                        <Input value={this.state.newFamily} onChange={(e) => {
                          let newFamily = e.target.value;
                          this.setState({ newFamily })
                        }} />
                        <InputGroupAddon addonType="append">
                          <Button onClick={this.addProductFamily.bind(this)} outline color="success">+</Button>
                        </InputGroupAddon>
                      </InputGroup>*/}
                  </ul>
                  </Col>
                </Row>
                <hr></hr>
                <Row style={{marginBottom: 15}}>
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
                  <Col>
                    <UncontrolledButtonDropdown>
                      <DropdownToggle caret color="primary">
                        더 보기
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem onClick={() => { this.props.history.push('/main/product/list') }}>활성화</DropdownItem>
                        {/*this.state.stockEdit ?
                        <DropdownItem onClick={() => this.changeStockEdit()}>수정완료</DropdownItem> :
                        <DropdownItem onClick={() => this.changeStockEdit()}>재고수정</DropdownItem> */}
                        <DropdownItem onClick={() => { this.props.history.push('/product/create'); }}>품목추가</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </Col>
                  <Col>
                  <div style={{float: "right"}}>
                    <a className="button-product" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => { this.props.history.push('/main/product/list') }}><i className="fa fa-toggle-off" style={{display: "block"}}></i>
                    </a>
                    {this.state.stockEdit? 
                    <a className="button-product" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => this.changeStockEdit()}><i className="fa fa-check" style={{display: "block"}}></i>
                    </a> : 
                    <a className="button-product" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => this.changeStockEdit()}><i className="fa fa-edit" style={{display: "block"}}></i>
                    </a>}                    
                    <a className="button-product" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px"}} onClick={() => { this.props.history.push('/product/create'); }}><i className="fa fa-plus" style={{display: "block"}}></i>
                    </a>
                    <a className="button-list" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px", backgroundColor: global.show === false ? 'lightgray' : 'transparent'}} onClick={() => {this.changeShowFalse()}}><i className="fa fa-th" style={{display: "block"}}></i>
                    </a>
                    <a className="button-card" style={{display: "inline-block", border: "1px solid #eee", padding: "10px", marginRight: "10px", backgroundColor: global.show === true ? 'lightgray' : 'transparent'}} onClick={() => {this.changeShowTrue()}}><i className="fa fa-th-list" style={{display: "block"}}></i>
                    </a>
                  </div>
                  </Col>
                </Row>
                {global.show ?
                <Row>
                  <Table className="ListTable" style={{ minWidth: 600 }} hover>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th style={{ width: 150 }}>사진</th>
                        <th>품목명</th>
                        <th style={{ width: 250 }}>품목군</th>
                        <th>판매 단가</th>
                        {/*this.state.set ?
                            <th style={{width : 300}}>품목 비활성화</th> :
                            <th style={{width : 300}}>품목 활성화</th>
                          */}
                        {/*<th>수정</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((e, i) => {
                        return (<tr style={{height : "150px"}} key={e.id} onClick={() => {
                          this.props.history.push({
                            pathname: '/main/product/' + e.id,
                            state: {name: this.state.name, family: this.state.family, page: this.state.page}
                          })
                        }}>
													<td>{e.id}</td>
                          <td>
                            <img style={{ width: '90%' }} alt="품목 사진" src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} />
                          </td>
                          <td>{e.name + ' ' + e.grade + ' ' + e.weight}</td>
                          <td>{e.familyName}</td>
                          <td>{this.numberWithCommas(e['price_shipping'])}&nbsp;원</td>
                          {/*this.state.stockEdit ?
                            <td style={{ width: 250, verticalAlign: 'middle' }}>
                              <InputGroup>
                                <Input defaultValue={stockData[i] !== undefined ? stockData[i].quantity : null} onChange={(e) => { stockData[i].quantity = e.target.value; }} />
                                <InputGroupAddon addonType="append">
                                <Button onClick={() => { this.modifyStock(e.id, stockData[i].quantity) }} color="primary" >수정</Button>
                                </InputGroupAddon>
                              </InputGroup>
                            </td> :
                          <td style={{ cursor: 'pointer', verticalAlign: 'middle' }} onClick={() => { this.props.history.push(`/main/stock/${e.id}`) }}>{stockData[i] !== undefined ? stockData[i].quantity : null}</td>*/}
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
                      <div className="card-product" key={i} style={{width: '20%', float: 'left', positon: 'relative'}}>
                        <li style={{listStyleType : 'none'}}>
                          <a style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => {
                            this.props.history.push({
                              pathname: '/main/product/' + e.id,
                              state: {name: this.state.name, family: this.state.family, page: this.state.page}
                            })
                          }}>
                            <div className="img-product" ><CardImg top style={{display: 'inline-block', width:"90%", overflow: "hidden"}} src={e.file_name ? "http://211.62.225.216:4000/static/" + e.file_name : '318x180.svg'} alt="Card image cap" /></div>
                            <p style={{fontWeight: 'bold'}}>{e.name + ' ' + e.grade + ' ' + e.weight}</p>
                            <p>{e.familyName}</p>
                            {this.state.stockEdit ?
                            <div>
                              <span>재고 : </span>
                              <div style={{display: 'inline-block', width: 100}}>
                                <InputGroup style={{}}>
                                  <Input defaultValue={stockData[i] !== undefined ? stockData[i].quantity : null} onChange={(e) => { stockData[i].quantity = e.target.value; }} />
                                  <InputGroupAddon addonType="append">
                                  <Button onClick={() => { this.modifyStock(e.id, stockData[i].quantity) }} color="primary" >수정</Button>
                                  </InputGroupAddon>
                                </InputGroup>
                              </div>
                            </div> :
                            <p>재고 : {stockData[i] !== undefined ? stockData[i].quantity : null}</p>}
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
                      </div>)
                  }.bind(this))
                  }
                </Row>
            }
              </CardBody>
              <CardFooter>
                <Pagination style={{justifyContent: 'center'}}>
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

export default Unset;
