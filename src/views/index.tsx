import { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import PermissionControlled from "@/components/PermissionControlled"

function Index() {
  const [ count, setCounts ] = useState('非受控组件')
  useEffect(()=>{
    console.log('home');
    
  }, [])
  return (
    <Card 
      hoverable 
      bordered={false}
    >
      <h2>vite4+react+ts</h2>
      <PermissionControlled isEvery access={['home:list','home:update']}>
        <p className='text-lime-400'>受控组件</p>
        <Input type="text" value={count} onChange={ (e)=>setCounts(e.target.value) } />
        <br />
        <p className='text-lime-400'>非受控组件</p>
        <Input type="text" />
      </PermissionControlled>
    </Card>
  )
}
export default Index;