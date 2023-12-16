import React, { useState } from "react";
import { Input } from 'antd';

const RoleIndex = () => {

  const [ count, setCounts ] = useState('不缓存')
  return (
    <div>
      <h2>不缓存</h2>
      <Input type="text" value={count} onChange={ (e)=>setCounts(e.target.value) } />
    </div>
  )
}

export default  RoleIndex;