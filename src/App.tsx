import { useState } from 'react'
import { Button, Space, Table, Card } from 'antd';
import { useCustomerSetting } from './ocean-components/CustomerSetting/hooks/useCustomSetting';
import { staticSystemFields } from './ocean-components/CustomerSetting/static/systemFields';
import { staticUserFields } from './ocean-components/CustomerSetting/static/userFields';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // 使用自定义设置组件
  const { fields, loading, save, openCustomColumnsSetting, renderCustomColumnsSetting } = useCustomerSetting({
    storageKey: 'customer-table-columns',
    systemFields: staticSystemFields,
    initialUserFields: staticUserFields,
  });

  // 模拟表格列定义
  const columns = fields
    .filter(field => field.checked)
    .map(field => ({
      title: field.label,
      dataIndex: field.field,
      key: field.field,
    }));

  // 模拟表格数据
  const data = [
    {
      key: '1',
      impressions: 12345,
      clicks: 123,
      cost: 456.78,
      cpc: 3.71,
      conversions: 12,
      conversion_rate: 9.76,
      conversion_cost: 38.07,
      phone_click: 5,
      map_search: 8,
      form_submission: 3,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>自定义列设置演示</h1>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCustomColumnsSetting}>
          自定义列设置
        </Button>
      </Space>

      <Card title="数据表格">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      </Card>

      {/* 渲染自定义设置组件 */}
      {renderCustomColumnsSetting}
    </div>
  )
}

export default App
