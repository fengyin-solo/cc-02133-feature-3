// 成功案例数据（首页与案例展示页共用，保证行业标签与统计口径一致）

// 行业标签
export const INDUSTRY_TAGS = [
  { label: '全部案例', value: 'all' },
  { label: '电商物流', value: 'ecommerce' },
  { label: '快递物流', value: 'express' },
  { label: '零售配送', value: 'retail' },
  { label: '制造业', value: 'manufacturing' }
]

// 实施效果筛选（多选，OR 匹配：命中任一已选效果即展示）
export const EFFECT_FILTERS = [
  { label: '成本降低', value: 'cost' },
  { label: '效率提升', value: 'efficiency' },
  { label: '准确率/质量', value: 'quality' },
  { label: '准时交付', value: 'ontime' },
  { label: '损耗减少', value: 'loss' }
]

export const cases = [
  {
    id: 'ecommerce-platform',
    title: '某大型电商平台',
    industry: '电商物流',
    tag: 'ecommerce',
    scale: '日均订单500万+',
    description: '国内领先的综合电商平台，日均订单量超过500万单',
    summary: '通过部署知运智慧仓储系统，实现仓库作业效率提升40%，库存准确率达99.9%',
    challenge: '仓库作业效率低下，库存准确率不足95%，大促期间频繁出现爆仓情况',
    solution: '部署知运智慧仓储系统，实现库位智能分配、拣货路径优化、库存实时监控',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    effects: ['cost', 'efficiency', 'quality'],
    results: [
      { value: '40%', label: '效率提升' },
      { value: '99.9%', label: '库存准确率' },
      { value: '30%', label: '成本降低' }
    ]
  },
  {
    id: 'express-company',
    title: '某知名快递企业',
    industry: '快递物流',
    tag: 'express',
    scale: '网点覆盖300+城市',
    description: '全国性快递服务商，网点覆盖全国300+城市',
    summary: '采用知运运输管理系统，优化运输路线，降低运输成本25%，时效提升20%',
    challenge: '运输成本居高不下，车辆利用率低，运输时效难以保障',
    solution: '采用知运运输管理系统，实现智能路径规划、运力资源整合、全程可视追踪',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    effects: ['cost', 'efficiency'],
    results: [
      { value: '25%', label: '成本降低' },
      { value: '20%', label: '时效提升' },
      { value: '35%', label: '车辆利用率提升' }
    ]
  },
  {
    id: 'retail-group',
    title: '某连锁零售集团',
    industry: '零售配送',
    tag: 'retail',
    scale: '2000+门店',
    description: '拥有2000+门店的连锁零售企业，覆盖华南地区',
    summary: '使用知运配送调度系统，实现门店配送准时率提升至98%，客户满意度显著提高',
    challenge: '门店配送准时率低，客户投诉多，配送成本高',
    solution: '使用知运配送调度系统，实现智能派单、路线优化、电子签收',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    effects: ['cost', 'ontime'],
    results: [
      { value: '98%', label: '准时率' },
      { value: '50%', label: '投诉减少' },
      { value: '20%', label: '成本降低' }
    ]
  },
  {
    id: 'auto-parts-manufacturer',
    title: '某汽车零部件制造商',
    industry: '制造业',
    tag: 'manufacturing',
    scale: '服务多家主机厂',
    description: '国内知名汽车零部件供应商，服务多家主机厂',
    summary: '部署知运全套物流系统，供应链可视化，库存周转提升40%，准时交付率99.5%',
    challenge: '供应链协同困难，库存周转慢，无法满足JIT配送要求',
    solution: '部署知运全套物流系统，实现供应链可视化、库存精准管控、准时配送',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    effects: ['cost', 'efficiency', 'ontime'],
    results: [
      { value: '99.5%', label: '准时交付率' },
      { value: '40%', label: '库存周转提升' },
      { value: '15%', label: '运营成本降低' }
    ]
  },
  {
    id: 'fresh-ecommerce',
    title: '某生鲜电商平台',
    industry: '电商物流',
    tag: 'ecommerce',
    scale: '主打2小时达',
    description: '专注生鲜配送的电商平台，主打2小时达服务',
    summary: '定制化冷链物流解决方案，生鲜损耗降低60%，2小时达成率95%',
    challenge: '生鲜损耗率高，配送时效难以保障，冷链管理困难',
    solution: '定制化冷链物流解决方案，实现温度全程监控、智能调度、损耗预警',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    effects: ['cost', 'efficiency', 'ontime', 'loss'],
    results: [
      { value: '60%', label: '损耗降低' },
      { value: '95%', label: '2小时达成率' },
      { value: '25%', label: '成本优化' }
    ]
  },
  {
    id: 'pharma-distributor',
    title: '某医药流通企业',
    industry: '制造业',
    tag: 'manufacturing',
    scale: '服务5000+医疗机构',
    description: '华南地区领先的医药流通企业，服务5000+医疗机构',
    summary: '部署符合GSP要求的仓储系统，追溯覆盖率100%，整体作业效率提升30%',
    challenge: '药品追溯要求严格，效期管理复杂，合规风险高',
    solution: '部署符合GSP要求的仓储系统，实现全程追溯、效期预警、合规管理',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    effects: ['efficiency', 'quality'],
    results: [
      { value: '100%', label: '追溯覆盖率' },
      { value: '0', label: '合规问题' },
      { value: '30%', label: '效率提升' }
    ]
  }
]

// 行业案例数量（与案例页行业标签统计口径一致）
export const getIndustryCount = (tagValue) => {
  if (tagValue === 'all') return cases.length
  return cases.filter(c => c.tag === tagValue).length
}

export const getCaseById = (id) => cases.find(c => c.id === id)

export const getIndustryTag = (tagValue) =>
  INDUSTRY_TAGS.find(t => t.value === tagValue)
