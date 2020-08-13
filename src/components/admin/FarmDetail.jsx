import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import Detail from "../common/Detail";
import _fetch from '../../fetch';
import {Badge} from 'reactstrap';

const User = () => {
  let {id} = useParams();
  const [content, setContent] = useState({})

  useEffect(() => {
    _fetch(`/api/admin/company/detail/${id}`, 'GET', null, (data) => {
      data[0].mallVisible = data[0].mallVisible ? <Badge color="primary">공개</Badge> : <Badge color="danger">비공개</Badge>
      setContent(data[0])
    })
  }, [])

  const detailProps = {
    detailTitle : '농장정보',

    detailName: {
      name : '농장 이름',
      ceoName : '대표자 이름',
      phone : '대표자 연락처',
      address : '주소',
      addressDetail : '주소 2',
      postcode: '우편번호',
      mallVisible: '상점 공개 여부',
      // image : '생산자 이미지',
      crNumber : '사업자 등록 번호',
    },

    detailContent: content,
  };

  return (
    <div className="animated fadeIn">
      <Detail {...detailProps} />
    </div>
  );
};

export default User;