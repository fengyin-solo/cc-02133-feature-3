<template>
  <div class="case-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">案例展示</h1>
        <p class="page-subtitle">众多企业的信赖之选，见证智慧物流的力量</p>
      </div>
    </section>

    <!-- 检索与筛选 -->
    <section class="filter-section">
      <div class="container">
        <!-- 关键词搜索 -->
        <div class="search-bar">
          <el-input
            v-model="keyword"
            placeholder="搜索行业、企业名称、挑战或解决方案关键词"
            clearable
            size="large"
            :prefix-icon="Search"
            @input="scheduleQueryUpdate"
            @clear="scheduleQueryUpdate"
            @keyup.enter="flushQueryUpdate"
          />
        </div>

        <!-- 行业筛选 -->
        <div class="filter-row">
          <span class="filter-label">行业：</span>
          <div class="filter-tags">
            <el-button
              v-for="tag in industryTags"
              :key="tag.value"
              :type="activeIndustry === tag.value ? 'primary' : ''"
              round
              @click="setIndustry(tag.value)"
            >
              {{ tag.label }}
              <span class="tag-count">{{ getIndustryCount(tag.value) }}</span>
            </el-button>
          </div>
        </div>

        <!-- 实施效果筛选 -->
        <div class="filter-row">
          <span class="filter-label">实施效果：</span>
          <div class="filter-tags">
            <el-button
              v-for="effect in effectFilters"
              :key="effect.value"
              :type="activeEffects.includes(effect.value) ? 'primary' : ''"
              round
              @click="toggleEffect(effect.value)"
            >
              {{ effect.label }}
            </el-button>
          </div>
        </div>

        <!-- 当前条件与清空 -->
        <div class="filter-summary">
          <span>共找到 <strong>{{ filteredCases.length }}</strong> 个相关案例</span>
          <el-button
            v-if="hasActiveFilters"
            type="primary"
            link
            :icon="RefreshLeft"
            @click="clearAllFilters"
          >
            清空筛选条件
          </el-button>
        </div>
      </div>
    </section>

    <!-- 案例列表 -->
    <section class="section section-gray">
      <div class="container">
        <!-- 无结果状态 -->
        <div v-if="filteredCases.length === 0" class="empty-state">
          <el-icon :size="56"><Search /></el-icon>
          <h3>未找到匹配的成功案例</h3>
          <p>当前行业、实施效果或关键词组合下暂无案例，请尝试调整筛选条件</p>
          <el-button type="primary" round @click="clearAllFilters">清空条件，查看全部案例</el-button>
        </div>

        <div v-else class="case-grid">
          <div
            class="case-detail-card"
            v-for="caseItem in filteredCases"
            :key="caseItem.id"
          >
            <div class="case-header" :style="{ background: caseItem.gradient }">
              <div class="case-logo">
                <el-icon :size="48"><OfficeBuilding /></el-icon>
              </div>
              <div class="case-tag">{{ caseItem.industry }}</div>
            </div>
            <div class="case-body">
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <p class="case-desc">{{ caseItem.description }}</p>

              <div class="case-challenge">
                <h4><el-icon><Warning /></el-icon> 面临挑战</h4>
                <p>{{ caseItem.challenge }}</p>
              </div>

              <div class="case-solution">
                <h4><el-icon><Checked /></el-icon> 解决方案</h4>
                <p>{{ caseItem.solution }}</p>
              </div>

              <div class="case-results">
                <h4>实施效果</h4>
                <div class="result-items">
                  <div class="result-item" v-for="result in caseItem.results" :key="result.label">
                    <span class="result-value">{{ result.value }}</span>
                    <span class="result-label">{{ result.label }}</span>
                  </div>
                </div>
              </div>

              <div class="case-actions">
                <el-button
                  type="primary"
                  plain
                  round
                  @click="goToConsult(caseItem)"
                >
                  <el-icon class="el-icon--left"><ChatLineSquare /></el-icon>
                  意向咨询
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 客户评价 -->
    <section class="section section-light">
      <div class="container">
        <SectionTitle
          title="客户评价"
          subtitle="听听他们怎么说"
        />
        <div class="testimonial-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.name">
            <div class="quote-icon">
              <el-icon :size="32"><ChatDotSquare /></el-icon>
            </div>
            <p class="testimonial-content">{{ testimonial.content }}</p>
            <div class="testimonial-author">
              <div class="author-avatar">
                <el-icon :size="24"><User /></el-icon>
              </div>
              <div class="author-info">
                <h4>{{ testimonial.name }}</h4>
                <p>{{ testimonial.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <div class="container text-center">
        <h2 class="cta-title">想成为下一个成功案例？</h2>
        <p class="cta-desc">联系我们，开启您的智慧物流之旅</p>
        <el-button
          type="primary"
          size="large"
          round
          @click="goToConsult()"
        >
          立即咨询
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, RefreshLeft, ChatLineSquare } from '@element-plus/icons-vue'
import SectionTitle from '@/components/SectionTitle.vue'
import {
  cases,
  INDUSTRY_TAGS,
  EFFECT_FILTERS,
  getIndustryCount
} from '@/data/cases.js'

const route = useRoute()
const router = useRouter()

const industryTags = INDUSTRY_TAGS
const effectFilters = EFFECT_FILTERS

const validIndustryValues = INDUSTRY_TAGS.map(t => t.value)
const validEffectValues = EFFECT_FILTERS.map(e => e.value)

// 解析路由中的搜索与筛选条件（非法值安全回退到默认状态）
const parseQuery = (query) => {
  const industry = validIndustryValues.includes(query.industry)
    ? query.industry
    : 'all'
  const rawEffects = query.effects ? String(query.effects).split(',') : []
  const effects = [...new Set(rawEffects.filter(v => validEffectValues.includes(v)))]
  const kw = typeof query.q === 'string' ? query.q : ''
  return { industry, effects, keyword: kw }
}

// 本地条件为唯一数据源，路由 query 仅作为可分享/可还原的镜像
const initial = parseQuery(route.query)
const activeIndustry = ref(initial.industry)
const activeEffects = ref(initial.effects)
const keyword = ref(initial.keyword)

const hasActiveFilters = computed(() =>
  activeIndustry.value !== 'all' ||
  activeEffects.value.length > 0 ||
  keyword.value.trim() !== ''
)

// 组合筛选：行业（AND）+ 实施效果（多选 OR）+ 关键词全文匹配（AND）
const filteredCases = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return cases.filter(c => {
    if (activeIndustry.value !== 'all' && c.tag !== activeIndustry.value) {
      return false
    }
    if (
      activeEffects.value.length > 0 &&
      !activeEffects.value.some(e => c.effects.includes(e))
    ) {
      return false
    }
    if (kw) {
      const haystack = [
        c.title,
        c.industry,
        c.description,
        c.challenge,
        c.solution
      ].join(' ').toLowerCase()
      if (!haystack.includes(kw)) {
        return false
      }
    }
    return true
  })
})

// 外部路由变化（浏览器前进/后退、从意向咨询返回）时还原本地条件
watch(
  () => [route.query.industry, route.query.effects, route.query.q],
  () => {
    const parsed = parseQuery(route.query)
    if (parsed.industry !== activeIndustry.value) {
      activeIndustry.value = parsed.industry
    }
    const sameEffects =
      parsed.effects.length === activeEffects.value.length &&
      parsed.effects.every((v, i) => v === activeEffects.value[i])
    if (!sameEffects) {
      activeEffects.value = parsed.effects
    }
    if (parsed.keyword !== keyword.value.trim()) {
      keyword.value = parsed.keyword
    }
  }
)

// 将本地条件整体写回路由（replace 不污染历史；状态取自本地，快速连续切换不丢条件）
const syncToRoute = () => {
  const cleaned = {}
  if (activeIndustry.value !== 'all') cleaned.industry = activeIndustry.value
  if (activeEffects.value.length) cleaned.effects = activeEffects.value.join(',')
  const kw = keyword.value.trim()
  if (kw) cleaned.q = kw

  const same =
    (route.query.industry || '') === (cleaned.industry || '') &&
    (route.query.effects || '') === (cleaned.effects || '') &&
    (route.query.q || '') === (cleaned.q || '')
  if (same) return

  router.replace({ path: '/cases', query: cleaned }).catch(() => {})
}

const setIndustry = (value) => {
  activeIndustry.value = value
  syncToRoute()
}

const toggleEffect = (value) => {
  if (activeEffects.value.includes(value)) {
    activeEffects.value = activeEffects.value.filter(v => v !== value)
  } else {
    activeEffects.value = [...activeEffects.value, value]
  }
  syncToRoute()
}

const clearAllFilters = () => {
  keyword.value = ''
  activeIndustry.value = 'all'
  activeEffects.value = []
  syncToRoute()
}

// 关键词防抖，应对快速连续输入
let debounceTimer = null
const scheduleQueryUpdate = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(syncToRoute, 300)
}
const flushQueryUpdate = () => {
  clearTimeout(debounceTimer)
  syncToRoute()
}

onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
})

// 进入意向咨询，携带返回地址（含当前搜索与筛选）与案例标识
const buildCasesPath = () => {
  const params = []
  if (activeIndustry.value !== 'all') {
    params.push(`industry=${encodeURIComponent(activeIndustry.value)}`)
  }
  if (activeEffects.value.length) {
    params.push(`effects=${encodeURIComponent(activeEffects.value.join(','))}`)
  }
  const kw = keyword.value.trim()
  if (kw) params.push(`q=${encodeURIComponent(kw)}`)
  return params.length ? `/cases?${params.join('&')}` : '/cases'
}

const goToConsult = (caseItem = null) => {
  const query = { from: buildCasesPath() }
  if (caseItem) query.case = caseItem.id
  router.push({ path: '/contact', query })
}

const testimonials = [
  {
    content: '知运的智慧仓储系统帮助我们实现了仓库作业的全面升级，效率提升非常明显，团队都很满意。',
    name: '王经理',
    title: '某电商平台物流总监'
  },
  {
    content: '运输管理系统的智能调度功能非常强大，帮我们节省了大量的运输成本，ROI超出预期。',
    name: '李总',
    title: '某快递企业运营副总'
  },
  {
    content: '配送系统上线后，门店配送准时率大幅提升，客户满意度明显提高，非常感谢知运团队。',
    name: '张总监',
    title: '某零售集团供应链总监'
  }
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: $spacing-xxl 0;
  text-align: center;
  color: #fff;
}

.page-title {
  font-size: $font-size-xxxl;
  font-weight: 700;
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-size-lg;
  opacity: 0.75;
}

.filter-section {
  background: $bg-white;
  padding: $spacing-lg 0;
  border-bottom: 1px solid $border-light;
}

.search-bar {
  max-width: 560px;
  margin: 0 auto $spacing-lg;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.filter-label {
  flex-shrink: 0;
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 32px;
  width: 72px;
  text-align: right;
}

.filter-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
}

.tag-count {
  opacity: 0.75;
  margin-left: 2px;
}

.filter-summary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-lg;
  padding-top: $spacing-md;
  border-top: 1px dashed $border-light;
  font-size: $font-size-sm;
  color: $text-secondary;

  strong {
    color: $primary-color;
    font-size: $font-size-base;
  }
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-xl;
}

.empty-state {
  background: $bg-white;
  border-radius: $radius-lg;
  padding: $spacing-xxl $spacing-lg;
  text-align: center;
  color: $text-secondary;

  .el-icon {
    color: $text-placeholder;
    margin-bottom: $spacing-md;
  }

  h3 {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }

  p {
    font-size: $font-size-sm;
    margin-bottom: $spacing-lg;
  }
}

.case-detail-card {
  background: $bg-white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }
}

.case-header {
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.case-tag {
  position: absolute;
  top: $spacing-md;
  right: $spacing-md;
  background: rgba(255, 255, 255, 0.9);
  color: $text-primary;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
  font-size: $font-size-xs;
  font-weight: 500;
}

.case-body {
  padding: $spacing-lg;
}

.case-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.case-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
}

.case-challenge,
.case-solution {
  margin-bottom: $spacing-md;

  h4 {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    color: $text-primary;
    margin-bottom: $spacing-xs;

    .el-icon {
      color: $warning-color;
    }
  }

  p {
    font-size: $font-size-sm;
    color: $text-secondary;
    padding-left: 24px;
  }
}

.case-solution h4 .el-icon {
  color: $success-color;
}

.case-results {
  background: $bg-color;
  margin: 0 (-$spacing-lg) (-$spacing-lg);
  padding: $spacing-md $spacing-lg;

  h4 {
    font-size: $font-size-sm;
    color: $text-primary;
    margin-bottom: $spacing-sm;
  }
}

.result-items {
  display: flex;
  gap: $spacing-lg;
}

.result-item {
  text-align: center;

  .result-value {
    display: block;
    font-size: $font-size-xl;
    font-weight: 700;
    color: $primary-color;
  }

  .result-label {
    font-size: $font-size-xs;
    color: $text-secondary;
  }
}

.case-actions {
  margin-top: $spacing-md;
  text-align: right;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-lg;
}

.testimonial-card {
  background: $bg-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  position: relative;
}

.quote-icon {
  color: rgba($primary-color, 0.2);
  margin-bottom: $spacing-md;
}

.testimonial-content {
  font-size: $font-size-base;
  color: $text-regular;
  line-height: $line-height-loose;
  margin-bottom: $spacing-lg;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.author-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.author-info {
  h4 {
    font-size: $font-size-base;
    color: $text-primary;
  }

  p {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.cta-section {
  background: linear-gradient(135deg, $primary-color, $primary-dark);
  color: #fff;
}

.cta-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  margin-bottom: $spacing-md;
}

.cta-desc {
  font-size: $font-size-lg;
  opacity: 0.85;
  margin-bottom: $spacing-xl;
}

@media (max-width: $breakpoint-lg) {
  .case-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: $breakpoint-md) {
  .page-title {
    font-size: $font-size-xxl;
  }

  .result-items {
    flex-wrap: wrap;
  }

  .filter-row {
    flex-direction: column;
    gap: $spacing-sm;
  }

  .filter-label {
    width: auto;
    text-align: left;
    line-height: 1.4;
  }
}
</style>
