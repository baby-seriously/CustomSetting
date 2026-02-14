import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, Card, Button, Table, Tabs, Tag, Tour, Divider, Drawer, Anchor } from 'antd';
import { SettingOutlined, CodeOutlined, HomeOutlined, ApiOutlined, MenuOutlined } from '@ant-design/icons';
import { useCustomerSetting } from './ocean-components/CustomerSetting/hooks/useCustomSetting';
import { staticSystemFields } from './ocean-components/CustomerSetting/static/instructionFields';
import { staticSystemFields as systemFieldsForExample3 } from './ocean-components/CustomerSetting/static/systemFields';
import { staticSystemFields as oneGradFields } from './ocean-components/CustomerSetting/static/oneGradFieds';
import { staticSystemFields as cardSystemFields } from './ocean-components/CustomerSetting/static/cardFields';
import { staticUserFields } from './ocean-components/CustomerSetting/static/userFields';
import significance from './ocean-components/CustomerSetting/photo/significance.png';
import diffImage from './ocean-components/CustomerSetting/photo/diff.png';
import './App.css'

const { TabPane } = Tabs;

function App() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [tourVisible, setTourVisible] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 检查是否是首次访问，首次访问时显示新手引导
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedCustomerSetting');
    if (!hasVisited) {
      // 延迟显示，确保页面已经渲染完成
      setTimeout(() => {
        setTourVisible(true);
      }, 500);
      // 标记为已访问
      localStorage.setItem('hasVisitedCustomerSetting', 'true');
    }
  }, []);

  // 新手引导步骤
  const tourSteps = [
    {
      title: '自定义设置',
      description: '点击此按钮打开自定义字段设置面板',
      target: () => document.querySelector('.ant-btn-primary'),
    },
  ];

  // 右侧目录导航配置
  const tocItems = useMemo(() => {
    const items: Record<string, { title: string; href: string; level: number }[]> = {
      home: [
        { title: '介绍', href: '#home-intro', level: 1 },
        { title: '业务痛点', href: '#home-pain-points', level: 1 },
        { title: '解法', href: '#home-solution', level: 1 },
      ],
      use: [
        { title: '使用方法', href: '#use-intro', level: 2 },
        { title: '参数说明', href: '#use-params', level: 2 },
        { title: 'fields 如何用于主列表渲染', href: '#use-fields', level: 4 },
        { title: '字段设置面板的使用方式', href: '#use-panel', level: 4 },
        { title: '最小完整实例', href: '#use-example', level: 4 },
      ],
      examples: [
        { title: '场景案例', href: '#examples-intro', level: 2 },
        { title: '列表场景', href: '#examples-list', level: 2 },
        { title: '二级分组字段', href: '#examples-list-level2', level: 4 },
        { title: '三级分组字段', href: '#examples-list-level3', level: 4 },
        { title: '卡片场景', href: '#examples-card', level: 2 },
      ],
      api: [
        { title: '数据结构', href: '#api-structures', level: 3 },
        { title: 'Hook 入参', href: '#api-input', level: 3 },
        { title: '入参说明', href: '#api-input-desc', level: 4 },
        { title: 'Hook 输出', href: '#api-output', level: 3 },
      ],
    };
    return items;
  }, []);

  // 示例1：直接传入systemFields
  const {
    fields: fieldsExample1,
    openCustomColumnsSetting: openSettingExample1,
    renderCustomColumnsSetting: renderSettingExample1
  } = useCustomerSetting({
    storageKey: 'customer-table-example-1',
    systemFields: staticSystemFields,
    initialUserFields: staticUserFields,
    maxSelectedCount: 16,
  });

  // 示例2：使用getSystemFields函数
  const getSystemFields = useCallback(async () => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return staticSystemFields;
  }, []);

  const {
    fields: fieldsExample2,
  } = useCustomerSetting({
    storageKey: 'customer-table-example-2',
    getSystemFields,
    initialUserFields: staticUserFields,
  });

  // 示例1的表格列定义
  const columnsExample1 = useMemo(() => {
    // Step 1: 过滤出选中的字段并按order排序
    const selectedFields = fieldsExample1.filter(field => field.checked || field.fixed || field.disabled).sort((a, b) => a.order - b.order);
    console.log('wgr columnsExample1 - selectedFields:', selectedFields.map(f => ({ field: f.field, label: f.label, checked: f.checked, order: f.order })));

    // Step 2: 按二级group进行归类
    const grouped: Record<string, typeof selectedFields> = {};

    for (const field of selectedFields) {
      // 从field.groups中获取二级group信息
      const rootGroup = field.groups?.[1]?.title || field.groups?.[0]?.title || null;

      if (!rootGroup) continue;

      if (!grouped[rootGroup]) {
        grouped[rootGroup] = [];
      }

      grouped[rootGroup].push(field);
    }

    console.log('wgr  - grouped:', Object.keys(grouped).map(key => ({ group: key, fields: grouped[key].map(f => f.field) })));

    // Step 3: 处理fixed字段
    const startFixed: any[] = [];
    const normal: any[] = [];
    const endFixed: any[] = [];

    for (const [groupTitle, fields] of Object.entries(grouped)) {
      const fixedFields = fields.filter(f => f.fixed);
      const normalFields = fields.filter(f => !f.fixed);

      if (fixedFields.length) {
        const target = fixedFields[0].fixed === 'start' ? startFixed : endFixed;

        target.push({
          title: groupTitle,
          children: fixedFields.map(f => ({
            title: f.label,
            dataIndex: f.field,
            key: f.field,
            fixed: f.fixed
          }))
        });
      }

      if (normalFields.length) {
        normal.push({
          title: groupTitle,
          children: normalFields.map(f => ({
            title: f.label,
            dataIndex: f.field,
            key: f.field
          }))
        });
      }
    }

    const result = [...startFixed, ...normal, ...endFixed];
    console.log('wgr columnsExample1 - 最终columns:', result);
    return result;
  }, [fieldsExample1]);

  // 示例2的表格列定义
  const columnsExample2 = useMemo(() => {
    console.log('wgr columnsExample2 - fieldsExample2:', fieldsExample2.map(f => ({ field: f.field, label: f.label, checked: f.checked, order: f.order })));
    const result = fieldsExample2
      .filter(field => field.checked || field.fixed || field.disabled)
      .sort((a, b) => a.order - b.order)
      .map(field => ({
        title: field.label,
        dataIndex: field.field,
        key: field.field,
      }));
    console.log('wgr columnsExample2 - 最终columns:', result);
    return result;
  }, [fieldsExample2]);

  // 模拟表格数据
  const data = [
    {
      key: '1',
      impressions: '-',
      clicks: '-',
      cost: '-',
      cpc: '-',
      cpm: '-',
      conversions: '-',
      conversion_rate: '-',
      conversion_cost: '-',
      phone_click: '-',
      map_search: '-',
      form_submission: '-',
      deep_conversion_cost: '-',
    },
  ];

  // 渲染导航菜单
  const renderMenu = (
    <Menu
      mode="inline"
      selectedKeys={[activeMenu]}
      style={{ height: '100%', borderRight: 0 }}
      onSelect={({ key }) => {
        setActiveMenu(key);
        setMobileMenuVisible(false);
      }}
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        介绍
      </Menu.Item>
      <Menu.Item key="use" icon={<CodeOutlined />}>
        使用方法
      </Menu.Item>
      <Menu.Item key="examples" icon={<CodeOutlined />}>
        场景案例
      </Menu.Item>

      <Menu.Item key="api" icon={<ApiOutlined />}>
        API
      </Menu.Item>
    </Menu>
  );

  // 渲染首页内容
  const renderHome = (
    <div>
      <Card
        style={{ marginBottom: 24 }}
      >
        <h1 id="home-intro" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: 16 }}>介绍</h1>
        <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <p>CustomerSetting 是自定义字段管理组件，在支持用户自由配置字段的同时，通过 Diff 机制自动处理系统字段的新增、废弃与顺序变化。</p>
          <p>请点击表格右上角的「自定义设置」图标，修改字段配置，关闭弹窗即可看到列表的即时变化。</p>
        </div>
      </Card>

      <Card title="快速预览">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
              setTourVisible(false);
              openSettingExample1();
            }}
          >
            自定义列设置
          </Button>
        </div>
        <Table
          columns={columnsExample1}
          dataSource={data}
          pagination={false}
          bordered
        />
      </Card>
      {renderSettingExample1()}
      <div>
        <Card >
          <h1 id="home-pain-points" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: 16 }}>业务痛点</h1>
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <p>在传统的字段管理方案中，当系统字段发生变化时（如上新增字段或下架字段），会出现以下问题：</p>
            <ul style={{ marginLeft: 24, marginBottom: 16 }}>
              <li><strong>字段不同步：</strong>在用户之前已修改过字段的选中状态或排序的情况下，自定义组件仍从上次保存的配置中获取字段信息，导致系统字段已增删但自定义组件中显示的内容不符</li>
              <li><strong>开发负担重：</strong>每次系统字段变更时，开发人员需要手动修改 storageKey 来强制用户重新配置，增加了维护成本</li>
              <li><strong>用户体验差：</strong>用户在列表中看到的字段与自定义设置面板中看到的不一致，或者用户在自定义设置面板中的配置被强行重置</li>
              <li><strong>异步请求耦合：</strong>列表渲染时候需要依赖自定义组件更改后的状态请求后端，但是组件内部状态更改后也需要重新发起请求，还可能存在列表渲染的数据还要依赖组件状态的情况，导致本末倒置。</li>
            </ul>

          </div>
        </Card>
        <Card style={{ marginBottom: 24 }}>
          <h1 id="home-solution" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: 16 }}>解法</h1>
          <ul style={{ marginLeft: 24 }}>
            <li><strong>业务逻辑与组件渲染整合为hook方法：</strong>先通过diff算法处理系统与用户保存字段差异，再根据diff结果更新自定义设置面板中的字段列表，最大化保留用户配置。</li>

            <h2 style={{ marginBottom: 8 }}>diff算法</h2>
            <li><strong>产生：</strong>由于用户在配置字段时可以对字段进行拖拽排序导致用户配置的字段顺序与系统字段顺序不一致。并且字段可能存在多级分组的情况，为保证即使添加新增字段也要在用户视角下不突兀，尽可能保留用户更改，因此需要通过diff算法处理插入新增字段的正确位置。下面将diff算法能够解决的其中一种场景可视化方便理解</li>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <img
                src={significance}
                alt="diff算法实现效果"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }}
              />

            </div>
            图中小写字母表示的是具有唯一标识符，选中状态，能否跨组拖拽，hover文案等属性的真正在列表或其他自定义场景中显示出来的字段，大写字母仅表示所属分组，不是直接操控字段。通过对比图中系统和用户字段不难发现a3字段属于新增字段，d1属于下架（废弃）字段。而且用户已经将字段改变过顺序，为了最大化的保留用户配置，diff算法最后的结果需要在用户字段中删去d,并且依据系统配置把新增字段a3插在a2后面。

            <Divider />

            <li><strong>字段差异对比：</strong>自动对比系统与用户保存的字段，diff算法处理新增、废弃和顺序变化。</li>
            <li><strong>分组标识：</strong>通过排序分组标题生成唯一标识，例如：["基础信息", "客户属性"] → "客户属性-基础信息"。</li>
            <li><strong>字段属性同步：</strong>自动更新字段标题、提示等属性为系统最新配置，同时优先保留用户的选择状态。</li>
            <li><strong>锚点定位：</strong>基于系统字段顺序找到前一个不同分组的字段作为锚点，确保新增字段插入位置符合业务逻辑。</li>
            <li><strong>连续新增字段顺序保证：</strong>使用reduce累积处理，每次插入都基于最新字段列表，确保多个新增字段按系统顺序正确插入。下方是diff算法流程图</li>


            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <img
                src={diffImage}
                alt="diff算法流程图"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>
            <h2>生命周期</h2>
            <li>经过diff算法与组件的封装，整个业务组件开箱即用，使用者不需要感知内部diff逻辑和组件渲染，只需要输入存放用户配置的storgeKey和系统配置的字段，组件会内部处理字段差异对比和更新。如果用户首次打开自定义组件或者之前没有进行字段状态更改，也会经过diff流程，最终组件渲染的是系统字段配置；并且内部已经做了由业务数据结构向UI渲染所用结构的转化，不需要使用者手动拼接diff算法和组件渲染和关心其中的数据流转。使用者只需要解构出打开自定义组件的方法和渲染方法。关于详细使用请点击左侧使用方法一栏。</li>
          </ul>

        </Card>

      </div>

    </div>

  );
  // 示例3：组件demo展示（类似vis-tree-react的方式）
  const [activeTabExample3, setActiveTabExample3] = useState('demo');
  const {
    fields: fieldsExample3,
    openCustomColumnsSetting: openSettingExample3,
    renderCustomColumnsSetting: renderSettingExample3
  } = useCustomerSetting({
    storageKey: 'customer-table-example-3',
    systemFields: systemFieldsForExample3,
    initialUserFields: staticUserFields,
  });

  // 示例3的表格列定义
  const columnsExample3 = useMemo(() => {
    // Step 1: 过滤出选中的字段并按order排序
    const selectedFields = fieldsExample3.filter(field => field.checked || field.fixed || field.disabled).sort((a, b) => a.order - b.order);
    console.log('wgr columnsExample3 - selectedFields:', selectedFields.map(f => ({ field: f.field, label: f.label, checked: f.checked, order: f.order })));

    // Step 2: 按二级group进行归类
    const grouped: Record<string, typeof selectedFields> = {};

    for (const field of selectedFields) {
      // 从field.groups中获取二级group信息
      const rootGroup = field.groups?.[1]?.title || field.groups?.[0]?.title || null;

      if (!rootGroup) continue;

      if (!grouped[rootGroup]) {
        grouped[rootGroup] = [];
      }

      grouped[rootGroup].push(field);
    }

    console.log('wgr columnsExample3 - grouped:', Object.keys(grouped).map(key => ({ group: key, fields: grouped[key].map(f => f.field) })));

    // Step 3: 处理fixed字段
    const startFixed: any[] = [];
    const normal: any[] = [];
    const endFixed: any[] = [];

    for (const [groupTitle, fields] of Object.entries(grouped)) {
      const fixedFields = fields.filter(f => f.fixed);
      const normalFields = fields.filter(f => !f.fixed);

      if (fixedFields.length) {
        const target = fixedFields[0].fixed === 'start' ? startFixed : endFixed;

        target.push({
          title: groupTitle,
          children: fixedFields.map(f => ({
            title: f.label,
            dataIndex: f.field,
            key: f.field,
            fixed: f.fixed
          }))
        });
      }

      if (normalFields.length) {
        normal.push({
          title: groupTitle,
          children: normalFields.map(f => ({
            title: f.label,
            dataIndex: f.field,
            key: f.field
          }))
        });
      }
    }

    const result = [...startFixed, ...normal, ...endFixed];
    console.log('wgr columnsExample3 - 最终columns:', result);
    return result;
  }, [fieldsExample3]);

  // 示例4：一级分组字段（不进行分组归类）
  const [activeTabExample4, setActiveTabExample4] = useState('demo');
  const {
    fields: fieldsExample4,
    openCustomColumnsSetting: openSettingExample4,
    renderCustomColumnsSetting: renderSettingExample4
  } = useCustomerSetting({
    storageKey: 'customer-table-example-4',
    systemFields: oneGradFields,
    initialUserFields: staticUserFields,
  });

  // 示例4的表格列定义（不进行分组归类）
  const columnsExample4 = useMemo(() => {
    return fieldsExample4
      .filter(field => field.checked || field.fixed || field.disabled)
      .sort((a, b) => a.order - b.order)
      .map(field => ({
        title: field.label,
        dataIndex: field.field,
        key: field.field,
        fixed: field.fixed,
      }));
  }, [fieldsExample4]);

  // 卡片场景示例
  const { fields: fieldsCardExample, openCustomColumnsSetting: openSettingCardExample, renderCustomColumnsSetting: renderSettingCardExample } = useCustomerSetting({
    storageKey: 'customer-card-example',
    systemFields: cardSystemFields,
    initialUserFields: staticUserFields,
  });

  // 卡片字段配置，包括颜色和类型
  const cardFields = useMemo(() => {
    // 定义字段颜色映射
    const fieldColors: Record<string, string> = {
      custom: '#FFB6C1', // 浅粉红
      time: '#FFFFE0', // 亮黄
      mast: '#ADD8E6', // 浅蓝色
      custm: '#E6E6FA', // 淡紫色
      possession: '#98FB98', // 淡绿色
      debt: '#FFDAB9', // 桃红色
      deadline: '#D8BFD8', // 李子色
      delay: '#FFE4E1', // 薄雾玫瑰色
    };

    // 定义字段类型映射（full 表示占满整行，half 表示占半行）
    const fieldTypes: Record<string, 'full' | 'half'> = {
      custom: 'full',
      time: 'half',
      mast: 'half',
      custm: 'full',
      possession: 'half',
      debt: 'half',
      deadline: 'half',
      delay: 'half',
    };

    // 过滤出选中的字段并按 order 排序
    return fieldsCardExample
      .filter(field => field.checked || field.fixed || field.disabled)
      .sort((a, b) => a.order - b.order)
      .map(field => ({
        ...field,
        color: fieldColors[field.key] || '#F0F0F0',
        type: fieldTypes[field.key] || 'half',
      }));
  }, [fieldsCardExample]);

  // 渲染使用示例
  const renderUse = (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <h1 id="use-intro" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 16 }}>使用方法</h1>
        <h2 id="use-params" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 12 }}>参数说明</h2>
        <p>该 Hook 仅依赖两类输入数据源，用于生成并维护用户自定义字段状态：</p>

        <ul>
          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f8fbf9', borderRadius: 4, border: '1px solid #e6f0ea' }}>
            <h5>props定义：</h5>
            <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 1, borderRadius: 4, overflow: 'auto' }}>
              {`export type UseCustomerSettingProps = MergeExclusive<\n    { storageKey: string; systemFields: SystemField[] },\n    { storageKey: string; getSystemFields: () => Promise<SystemField[]> }>;`}
            </pre>
          </div>

          <li><strong>用户字段（User Fields）</strong>
            已经有远端接口可以存放用户配置，使用者可以通过 <code>storageKey</code> 指定用户字段的存储位置</li>
        </ul>

        <ul><li><strong>系统配置字段（System Fields）</strong>
          系统配置字段可以传入异步函数，若业务方已经持有静态字段也可以直接传入，由使用者根据实际情况择其一。下面分别列举两种情况的示例：</li></ul>

        <Tabs defaultActiveKey="example1">
          <TabPane tab="示例 1: 传入异步函数" key="example1">

            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f8fbf9', borderRadius: 4, border: '1px solid #e6f0ea' }}>
              <h5>
                当系统字段来源于远端接口时，使用者需要提供一个异步函数例如`getSystemFields`。</h5>
              <ul>
                <li>该函数 <strong>内部应调用具体的业务接口。</strong></li>
                <li>  返回值必须是 `SystemField[]`（详见API栏）。
                </li>
                <li>  Hook 会在初始化阶段自动调用该函数，并在数据准备完成后更新内部状态。   </li>

                <li>  Hook 不关心接口地址、鉴权方式或请求库（fetch / axios 等）。
                  下面分别列举分别用fetch/axios调用的示例：
                </li>
              </ul>
              <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`const getSystemFields = async (): Promise<SystemField[]> => {\n  const res = await fetch('/api/system/fields');    // 使用时请替换真实业务接口\n  const data = await res.json();\n  return data;\n};\n\nconst { fields, openCustomColumnsSetting, renderCustomColumnsSetting, loading } = \nuseCustomerSetting({\n  storageKey: 'customer-table-columns',             // 使用时请替换真实storgeKey\n  getSystemFields\n});\n`}
              </pre>
              <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`const getSystemFields = async () => {\n  const { data } = await axios.get<SystemField[]>('/api/system/fields');    //使用时请替换真实业务接口\n  return data;\n};\n\nconst { fields, openCustomColumnsSetting, renderCustomColumnsSetting, loading} = \nuseCustomerSetting({\n  storageKey: 'customer-table-columns',             // 使用时请替换真实storgeKey\n  getSystemFields,});});`}
              </pre>
            </div>
            <div style={{ marginTop: 16, color: '#3e6245' }}>
              <h4>
                loading状态说明
              </h4>          当使用 getSystemFields（异步）时，Hook 会进入 loading 状态，loading = true 表示字段配置尚未准备完成，不建议此时渲染主列表；当成功获取系统字段后，loading 会变为 false,loading 状态从 true 变为 false 是在 所有操作完成后 ，包括：
              获取系统字段（同步/异步）;获取用户保存字段; diff/merge/transform 操作;产出稳定、可消费的 fields 状态"
              <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`if (loading) {\n  return <Spin />;\n}\n`}
              </pre>

            </div>

          </TabPane>

          <TabPane tab="示例 2: 直接传入静态字段" key="example2">
            <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f8fbf9', borderRadius: 4, border: '1px solid #e6f0ea' }}>
              <h4>已有静态字段：</h4>
              <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`\nconst systemFields: SystemField[] = [...];\n\nuseCustomerSetting({\n  storageKey: 'customer-table-columns',\n  systemFields,\n});\n`}
              </pre>
            </div>
            {renderSettingExample1()}
          </TabPane>
        </Tabs>
        <h4>fields 如何用于主列表渲染</h4>
        <p>fields 是 Hook 提供的中间态，业务方可根据自身需求自由转换。</p>
        <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
          {`const columns = fields\n  .filter(field => field.checked || field.fixed)\n  .sort((a, b) => a.order - b.order)\n  .map(field => ({\n    title: field.label,\n    dataIndex: field.field,\n    key: field.field,\n  }));`}
        </pre>
        <h4>字段设置面板的使用方式</h4>
        <p>设置面板的显示状态由 Hook 内部管理,使用者仅需负责触发与挂载</p>
        <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
          {`<Button onClick={openCustomColumnsSetting}>自定义字段图标</Button>\n{renderCustomColumnsSetting()}`}
        </pre>
        <h4 id="use-fields" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 12 }}>fields 如何用于主列表渲染</h4>
        <p>fields 是 Hook 提供的中间态，业务方可根据自身需求自由转换。</p>
        <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
          {`const columns = fields\n  .filter(field => field.checked || field.fixed)\n  .sort((a, b) => a.order - b.order)\n  .map(field => ({\n    title: field.label,\n    dataIndex: field.field,\n    key: field.field,\n  }));`}
        </pre>
        <h4 id="use-panel" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 12 }}>字段设置面板的使用方式</h4>
        <p>设置面板的显示状态由 Hook 内部管理,使用者仅需负责触发与挂载</p>
        <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
          {`<Button onClick={openCustomColumnsSetting}>自定义字段图标</Button>\n{renderCustomColumnsSetting()}`}
        </pre>
        <h4 id="use-example" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 12 }}>最小完整实例</h4>
        <pre style={{ backgroundColor: '#f8fbf9', border: '1px solid #e6f0ea', padding: 12, borderRadius: 4, overflow: 'auto' }}>
          {`import { useCustomerSetting } from 'xxx';\nconst { fields, openCustomColumnsSetting, renderCustomColumnsSetting } = useCustomerSetting({\n  storageKey: 'customer-table-demo',\n  systemFields: staticSystemFields,\n});\nconst columns = fields\n  .filter(field => field.checked)\n  .map(field => ({\n    title: field.label,\n    dataIndex: field.field,\n    key: field.field,\n  }));\n\nreturn (\n  <div>\n    <Button onClick={openCustomColumnsSetting}>\n      自定义列设置\n    </Button>\n    <Table\n      columns={columns}\n      dataSource={data}\n    />\n    {renderCustomColumnsSetting}\n  </div>\n);`}
        </pre>

      </Card>
    </div>
  );

  const renderExamples = (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <h1 id="examples-intro" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 16 }}>场景案例</h1>
        <h2 id="examples-list" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 12 }}>列表场景</h2>
        <h4 id="examples-list-level2" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 8 }}>二级分组字段</h4>
        <p>例如：【互动指标（一级）-地图搜索（二级）】</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
              setTourVisible(false);
              openSettingExample4();
            }}
          >
            自定义列设置
          </Button>
        </div>
        <Table
          columns={columnsExample4}
          dataSource={data}
          pagination={false}
          bordered
        />
        {renderSettingExample4()}
        <Divider />

        <h4 id="examples-list-level3" style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: 8 }}>三级分组字段</h4>
        <p>例如：【基础指标（一级）-展现数据（二级）-转化成本（三级）】
          .使用者在渲染列表时需要把属于一个二级分组下的字段在列表中归类渲染，并且用户使用自定义组件拖拽排序的时候由业务方选择是否可以跨二级分组拖拽。</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
              setTourVisible(false);
              openSettingExample3();
            }}
          >
            自定义列设置
          </Button>
        </div>
        <Table
          columns={columnsExample3}
          dataSource={data}
          pagination={false}
          bordered
        />
        {renderSettingExample3()}
        <Divider />

        <h2 id="examples-card" style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: 12 }}>卡片场景</h2>
        <div style={{ marginBottom: 16 }}>
          <p>
            在首页或总览页中，常见通过「卡片」形式展示核心指标。
            不同用户对关注指标的偏好不同，且卡片顺序、显隐需要可配置。CustomerSetting 仅负责「字段配置」， 不关心卡片样式，
            仅负责输出「用户关注的指标集合及顺序」，具体渲染形态由使用自行决定。</p>
          <p>
            下面提供一个首页工作台场景示例： 用不同颜色表示的业务模块（如平台资金、实时数据等）
            均可视为一种「字段分组」，
            CustomerSetting 统一管理这些模块的展示与排序。
          </p>

        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={() => {
              setTourVisible(false);
              openSettingCardExample();
            }}
          >
            自定义卡片配置
          </Button>
        </div>
        <div style={{ height: '500px', border: '1px solid #e8e8e8', borderRadius: 8, padding: 16, margin: '0 auto', overflow: 'auto', backgroundColor: '#f9f9f9', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {cardFields.map((field) => (
              <div
                key={field.field}
                style={{
                  backgroundColor: field.color,
                  borderRadius: 6,
                  padding: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e8e8e8',
                  height: field.type === 'full' ? 120 : 80,
                  gridColumn: field.type === 'full' ? '1 / -1' : undefined,
                }}
              >
                <div style={{ textAlign: 'center', color: '#333', fontSize: 12, fontWeight: 'bold' }}>
                  {field.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {renderSettingCardExample()}
      </Card>

    </div>
  );

  // 渲染API文档
  const renderApi = (
    <div>
      <Card title="API 文档" bordered={false} style={{ marginBottom: 24 }}>
        <h3 id="api-structures" style={{ marginBottom: 16, fontSize: '22px', fontWeight: 'bold' }}>一、数据结构（Data Structures）</h3>
        <Tabs defaultActiveKey="systemField">
          <TabPane tab="SystemField（系统字段定义）" key="systemField">
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <p>用于描述系统侧提供的完整字段元数据。</p>
              <div style={{ marginBottom: 16, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e8e8e8' }}>
                  <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>属性</th>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>类型</th>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        key <Tag color="red">必填</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>字段唯一标识</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        title <Tag color="red">必填</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string | () =&gt; string</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>字段展示名称</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        groups <Tag color="red">必填</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>{`{ title: string; dragScope?: true }[]`}</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>所属分组，用于拖拽范围控制</td>
                    </tr>

                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        defaultSelect <Tag color="green">可选</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>boolean</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>是否默认选中</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        tips <Tag color="green">可选</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>hover 提示文案</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        fixed <Tag color="green">可选</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>{`'start' | 'end'`}</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>固定列（不可取消）</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        onlineDate <Tag color="green">可选</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>上线时间，用于 NEW 标识</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
          <TabPane tab="UserField（用户字段偏好）" key="userField">
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <p>用于描述用户保存后的字段选择状态。</p>
              <div style={{ marginBottom: 16, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e8e8e8' }}>
                  <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>属性</th>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>类型</th>
                      <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        key <Tag color="red">必填</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>字段唯一标识</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                        maxSelectedCount <Tag color="green">可选</Tag>
                      </td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>number</td>
                      <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>最大可选择的字段数量，默认16</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabPane>
        </Tabs>

        <div style={{ marginTop: 32 }}>
          <h3 id="api-input" style={{ marginBottom: 16, fontSize: '22px', fontWeight: 'bold' }}>二、Hook 入参（Input API）</h3>
          <p>useCustomerSetting(props)</p>
          <div style={{ marginBottom: 16 }}>
            <h4>类型定义</h4>
            <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
              <pre style={{ backgroundColor: '#fff', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`type UseCustomerSettingProps = 
  | { 
      storageKey: string;
      systemFields: SystemField[];
      maxSelectedCount?: number;
    }
  | { 
      storageKey: string;
      getSystemFields: () => Promise<SystemField[]>;
      maxSelectedCount?: number;
    };`}
              </pre>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h4 id="api-input-desc" style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: 12 }}>入参说明</h4>
            <div style={{ marginBottom: 16, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e8e8e8' }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>参数</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>类型</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                      storageKey <Tag color="red">必填</Tag>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>string</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>用户配置持久化标识</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                      systemFields <Tag color="orange">条件</Tag>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>SystemField[]</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>直接传入静态字段</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                      getSystemFields <Tag color="orange">条件</Tag>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>() =&gt; Promise&lt;SystemField[]&gt;</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>异步获取系统字段</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>
                      maxSelectedCount <Tag color="green">可选</Tag>
                    </td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>number</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>最大可选择的字段数量，默认16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3 id="api-output" style={{ marginBottom: 16, fontSize: '22px', fontWeight: 'bold' }}>三、Hook 输出（Return API）</h3>
          <div style={{ marginBottom: 16 }}>
            <h4>接口定义</h4>
            <div style={{ padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
              <pre style={{ backgroundColor: '#fff', padding: 12, borderRadius: 4, overflow: 'auto' }}>
                {`interface UseCustomerSettingReturn { 
  fields: CustomField[];
  loading: boolean;
  save: () => void;
  updateFields: (newFields: CustomField[]) => void;
  openCustomColumnsSetting: () => void;
  renderCustomColumnsSetting: () => JSX.Element;
}`}
              </pre>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h4>返回值说明</h4>
            <div style={{ marginBottom: 16, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e8e8e8' }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                  <tr>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>字段</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>类型</th>
                    <th style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>fields</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>CustomField[]</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>最终用于 UI 渲染的字段</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>loading</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>boolean</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>是否正在加载系统字段</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>save</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>() =&gt; void</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>保存用户字段配置</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>updateFields</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>(fields) =&gt; void</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>手动更新字段</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>openCustomColumnsSetting</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>() =&gt; void</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>打开设置弹窗</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>renderCustomColumnsSetting</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>() =&gt; JSX.Element</td>
                    <td style={{ padding: '8px 12px', border: '1px solid #e8e8e8' }}>渲染设置组件</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // 根据当前激活的菜单渲染对应的内容
  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return renderHome;
      case 'use':
        return renderUse;
      case 'examples':
        return renderExamples;
      case 'api':
        return renderApi;
      default:
        return renderHome;
    }
  };

  return (
    <>
      <style>{`
        /* 固定布局样式 */
        .app-layout {
          min-height: 100vh;
        }
        
        .app-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
          background: #fff;
          padding: 0 24px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .app-sidebar {
          position: fixed;
          top: 64px;
          left: 0;
          bottom: 0;
          width: 200px;
          background: #fff;
          overflow-y: auto;
          border-right: 1px solid #e8e8e8;
          z-index: 999;
          transition: transform 0.3s ease;
        }
        
        .app-content {
          margin-left: 200px;
          margin-top: 64px;
          background: #f0f2f5;
          min-height: calc(100vh - 64px);
        }
        
        .app-content-wrapper {
          background: #fff;
          padding: 24px;
          border-radius: 4;
          min-height: 80vh;
          padding-right: 280px;
        }
        
        .app-toc {
          position: fixed;
          top: 100px;
          right: 24px;
          width: 240px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          background: #fff;
          border-radius: 4;
          padding: 16px;
        }
        
        .app-toc-item {
          display: block;
          padding: 4px 0;
          color: #666;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .app-toc-item:hover {
          color: #2d5a3d;
        }
        
        .app-toc-item.level-1 {
          font-size: 14px;
          font-weight: 500;
          margin-top: 8px;
        }
        
        .app-toc-item.level-2 {
          font-size: 13px;
          padding-left: 12px;
        }
        
        .app-toc-item.level-3 {
          font-size: 12px;
          padding-left: 24px;
        }
        
        .app-toc-item.level-4 {
          font-size: 12px;
          padding-left: 36px;
        }
        
        /* 移动端菜单按钮 */
        .mobile-menu-btn {
          display: none;
          margin-right: 16px;
          cursor: pointer;
        }
        
        /* 响应式布局 */
        @media (max-width: 1200px) {
          .app-content-wrapper {
            padding-right: 24px;
          }
          
          .app-toc {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .app-sidebar {
            transform: translateX(-100%);
          }
          
          .app-sidebar.mobile-visible {
            transform: translateX(0);
          }
          
          .app-content {
            margin-left: 0;
          }
          
          .mobile-menu-btn {
            display: block;
          }
        }
        
        /* 覆盖Ant Design Tabs的默认蓝色主题为森林绿 */
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #2d5a3d !important;
          font-weight: 500 !important;
        }
        
        .ant-tabs-ink-bar {
          background-color: #2d5a3d !important;
        }
        
        .ant-tabs-tab:hover .ant-tabs-tab-btn {
          color: #3e7a52 !important;
        }
        
        .ant-tabs-tab {
          color: #666 !important;
        }
        
        .ant-tabs-tab:hover {
          color: #3e7a52 !important;
        }
        
        /* 覆盖Ant Design Button的默认蓝色主题为森林绿 */
        .ant-btn-primary {
          background-color: #2d5a3d !important;
          border-color: #2d5a3d !important;
        }
        
        .ant-btn-primary:hover,
        .ant-btn-primary:focus {
          background-color: #3e7a52 !important;
          border-color: #3e7a52 !important;
        }
        
        .ant-btn-primary:active {
          background-color: #1e3d29 !important;
          border-color: #1e3d29 !important;
        }
        
        /* 覆盖Ant Design Link的默认蓝色主题为森林绿 */
        a {
          color: #2d5a3d !important;
        }
        
        a:hover {
          color: #3e7a52 !important;
        }
      `}</style>
      <div className="app-layout">
        <div className="app-header">
          <div className="mobile-menu-btn" onClick={() => setMobileMenuVisible(true)}>
            <MenuOutlined style={{ fontSize: 20, color: '#4a7c59' }} />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4a7c59' }}>
            CustomerSetting 组件文档
          </div>
        </div>
        <div className={`app-sidebar ${mobileMenuVisible ? 'mobile-visible' : ''}`}>
          {renderMenu}
        </div>
        <div className="app-content">
          <div className="app-content-wrapper">
            {renderContent()}
          </div>
        </div>
        {isLargeScreen && (
          <div className="app-toc">
            <Anchor
              offsetTop={80}
              affix={false}
              showInkInFixed={true}
              items={tocItems[activeMenu]?.map((item, index) => ({
                key: index.toString(),
                href: item.href,
                title: <span className={`app-toc-item level-${item.level}`}>{item.title}</span>,
              })) || []}
            />
          </div>
        )}
        <Drawer
          title="导航菜单"
          placement="left"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={200}
          style={{ display: !isLargeScreen ? 'block' : 'none' }}
        >
          {renderMenu}
        </Drawer>
        <Tour
          open={tourVisible}
          current={tourStepIndex}
          onClose={() => setTourVisible(false)}
          steps={tourSteps}
        />
      </div>
    </>
  );
}

export default App
