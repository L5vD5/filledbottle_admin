import React, { Component } from 'react';
import { Button, Col, Row, Input, Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';


class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [{id: 1, name: '코스트코', address: '서울특별시 성북구', product: '사과', performance: 100000}],
      total: 0,
    };
  }

  countPageNumber(x){
    this.setState({
    }, () => {
    });
  }
  
  resetInput() {
    var reset_input = document.getElementsByClassName('searchbox-input')
    for(var i = 0; i < reset_input.length; i++) {
      reset_input[i].value = null;
      console.log(i);
    }
  }

  render() {
    const arr = [-2, -1, 0, 1, 2];
    const arr1 = [];
    return (
      <div className="animated fadeIn">
        <link rel="stylesheet" type="text/css" href="css/ListCopy.css"></link>
        <Row>
          <Col>
            <div className="search-box">
              <div className="search-list">
                <label className="search-label">매장명</label>
                <div className="sell-input">
                  <Input className='searchbox-input' placeholder="매장명을 검색해주세요." style={{width: "30%"}} onChange={(e) => { this.props.searchKeywordM(e.target.value) }} />
                </div>
              </div>
              <div className="search-list">
                <label className="search-label">취급품목</label>
                <div className="sell-input">
                  <Input className='searchbox-input' placeholder="품목명을 검색해주세요." style={{width: "30%"}} onChange={(e) => { this.props.searchKeywordM(e.target.value) }} />
                </div>
              </div>
              <div className="search-button" style={{textAlign: 'center', paddingBottom: "10px"}}>
                <Button color="primary" style={{marginRight: 10}} onClick={() => { this.searchOrder(this.props.keyword); }}>검색</Button>
								<Button color="ghost-primary" onClick={() => { this.props.searchKeywordM(''); this.resetInput(); }}>초기화</Button>
							</div>
            </div>
            
            <div className="list-card">
              <div className="list-title">
                <span>
                  매장목록 (총 <span style={{color: "#1B8EB7"}}>{this.state.totalData}</span> 개)
                </span>
                <div className="list-sort-box">
                  <div>
                    <select>
                      <option>품목일순</option>
                      <option>총액높은순</option>
                      <option>총액낮은순</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="list-menu">
              </div>
              <div className="list-box" style={{marginTop: 20}}>
                <Table className="ListTable" style={{ minWidth: 600 }} hover>
                  <thead>
                    <tr>
                      <th className="list-hidden">#</th>
                      <th className="list-shown">매장명</th>
                      <th className="list-hidden">주소</th>
                      <th className="list-shown">취급품목</th>
                      <th className="list-shown">판매실적 (원)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.data.map((e, i) => {
                        return(
                          <tr key={i} onClick={() => {this.props.history.push(`/main/market/${e.id}`)}}>
                            <td>{e.id}</td>
                            <td>{e.name}</td>
                            <td>{e.address}</td>
                            <td>{e.product}</td>
                            <td>{e.performance}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
                <Pagination style={{justifyContent: 'center'}}>
                  {this.props.pageNumbersM === 1 ? '' :
                  <PaginationItem>
                    <PaginationLink previous onClick={() => {this.countPageNumber(this.props.clickConvertPageM(this.props.pageNumbersM-1))}}/>
                  </PaginationItem>
                  }
                  {this.props.pageNumbersM === 1 ? arr.forEach(x => arr1.push(x+2)) : null}
                  {this.props.pageNumbersM === 2 ? arr.forEach(x => arr1.push(x+1)) : null}
                  {this.props.pageNumbersM !== 1 && this.props.pageNumbersM!== 2 ? arr.forEach(x => arr1.push(x)) :null }
                  {arr1.map((e, i) => {
                    if(this.state.total >= this.props.pageNumbersM+e)
                    return (<PaginationItem key={i} active={this.props.pageNumbersM === this.props.pageNumbersM+e}>
                      <PaginationLink onClick={() => {this.countPageNumber(this.props.clickConvertPageM(this.props.pageNumbersM+e));}}>
                      {this.props.pageNumbersM+e}
                      </PaginationLink>
                    </PaginationItem>)
                    return null;
                  })}
                  {this.props.pageNumbersM === this.state.total ? '' :
                  <PaginationItem>
                    <PaginationLink next onClick={() => {this.countPageNumber(this.props.clickConvertPageM(this.props.pageNumbersM+1))}}/>
                  </PaginationItem>}
                </Pagination>
                
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

}

export default List;
