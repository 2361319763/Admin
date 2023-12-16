import React, { useState } from "react";
import { Input } from 'antd';

const UserIndex = () => {

  const [ count, setCounts ] = useState('缓存')
  return (
    <div>
      <h2>缓存</h2>
      <Input type="text" value={count} onChange={ (e)=>setCounts(e.target.value) } />
    </div>
  )
}

export default  UserIndex;