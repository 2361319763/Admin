import { useState } from 'react';
import { Card, Input } from 'antd';

function Index() {
  const [ count, setCounts ] = useState('非受控组件')

  return (
    <Card 
      hoverable 
      bordered={false}
    >
      <h2>vite4+react+ts</h2>
      <p className='text-lime-400'>受控组件</p>
      <Input type="text" value={count} onChange={ (e)=>setCounts(e.target.value) } />
      <br />
      <p className='text-lime-400'>非受控组件</p>
      <Input type="text" />
    </Card>
  )
}
export default Index;