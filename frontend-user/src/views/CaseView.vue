<template>
  <div class="case-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">案例展示</h1>
        <p class="page-subtitle">众多企业的信赖之选，见证智慧物流的力量</p>
      </div>
    </section>

    <!-- 搜索与筛选 -->
    <section class="filter-section">
      <div class="container">
        <div class="search-bar">
          <el-input
            v-model="keywordInput"
            class="case-search"
            placeholder="搜索案例关键词，如：电商、仓储、成本"
            clearable
            :prefix-icon="Search"
          />
        </div>
        <div class="filter-row">
          <span class="filter-label">行业类型</span>
          <div class="filter-tags">
            <el-button
              v-for="tag in tagsWithCount"
              :key="tag.value"
              :type="activeTag === tag.value ? 'primary' : ''"
              round
              @click="activeTag = tag.value"
            >
              {{ tag.label }}（{{ tag.count }}）
            </el-button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label">实施效果</span>
          <el-checkbox-group v-model="activeEffects" class="effect-group">
            <el-checkbox-button
              v-for="dim in effectDimensions"
              :key="dim.value"
              :value="dim.value"
            >
              {{ dim.label }}
            </el-checkbox-button>
          </el-checkbox-group>
          <el-button
            v-if="hasConditions"
            link
            type="primary"
            class="reset-btn"
            @click="resetFilters"
          >
            清空条件
          </el-button>
        </div>
      </div>
    </section>

    <!-- 案例列表 -->
    <section class="section section-gray">
      <div class="container">
        <template v-if="filteredCases.length">
          <div class="result-bar">
            共找到 <strong>{{ filteredCases.length }}</strong> 个符合条件的案例
          </div>
          <div class="case-grid">
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

                <div class="case-footer">
                  <el-button type="primary" plain round @click="goConsult(caseItem)">
                    意向咨询
                    <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <el-empty
          v-else
          class="case-empty"
          description="未找到符合条件的案例，请调整搜索或筛选条件"
        >
          <el-button type="primary" round @click="resetFilters">清空筛选条件</el-button>
        </el-empty>
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
        <el-button type="primary" size="large" round @click="$router.push('/contact')">
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
import { Search } from '@element-plus/icons-vue'
import SectionTitle from '@/components/SectionTitle.vue'
import { industryTags, effectDimensions, filterCases, countCasesByTag } from '@/data/cases'

const route = useRoute()
const router = useRouter()

const validTags = industryTags.map(t => t.value)
const validEffects = effectDimensions.map(e => e.value)

// 从 URL query 解析筛选状态（非法值回退默认，保证状态稳定）
const parseQuery = (query) => {
  const keyword = typeof query.keyword === 'string' ? query.keyword.trim().slice(0, 50) : ''
  const tag = validTags.includes(query.tag) ? query.tag : 'all'
  const rawEffects = typeof query.effects === 'string' ? query.effects.split(',') : []
  // 按固定顺序输出，保证 URL 与状态比较时稳定
  const effects = validEffects.filter(value => rawEffects.includes(value))
  return { keyword, tag, effects }
}

const initialState = parseQuery(route.query)

const keywordInput = ref(initialState.keyword) // 输入框即时值
const keyword = ref(initialState.keyword)      // 防抖后生效的搜索词
const activeTag = ref(initialState.tag)
const activeEffects = ref(initialState.effects)

// 关键词防抖，避免快速连续输入时列表频繁抖动
let debounceTimer = null
watch(keywordInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    keyword.value = val.trim()
  }, 300)
})

onBeforeUnmount(() => clearTimeout(debounceTimer))

const filteredCases = computed(() => filterCases({
  keyword: keyword.value,
  tag: activeTag.value,
  effects: activeEffects.value
}))

const tagsWithCount = computed(() => industryTags.map(tag => ({
  ...tag,
  count: countCasesByTag(tag.value)
})))

const hasConditions = computed(() =>
  Boolean(keywordInput.value) || activeTag.value !== 'all' || activeEffects.value.length > 0
)

const resetFilters = () => {
  keywordInput.value = ''
  keyword.value = ''
  activeTag.value = 'all'
  activeEffects.value = []
}

const sameEffects = (a, b) => a.length === b.length && [...a].sort().join(',') === [...b].sort().join(',')

// 筛选状态变化时同步到 URL（replace 不污染历史记录，便于返回时还原）
watch([keyword, activeTag, activeEffects], () => {
  const current = parseQuery(route.query)
  if (
    current.keyword === keyword.value &&
    current.tag === activeTag.value &&
    sameEffects(current.effects, activeEffects.value)
  ) {
    return
  }
  const query = {}
  if (keyword.value) query.keyword = keyword.value
  if (activeTag.value !== 'all') query.tag = activeTag.value
  if (activeEffects.value.length) query.effects = validEffects.filter(v => activeEffects.value.includes(v)).join(',')
  router.replace({ query }).catch(() => {})
})

// URL 变化（如从咨询页返回、浏览器前进后退）时还原搜索与筛选
watch(() => route.query, (query) => {
  const parsed = parseQuery(query)
  if (parsed.keyword !== keyword.value) {
    keywordInput.value = parsed.keyword
    keyword.value = parsed.keyword
  }
  activeTag.value = parsed.tag
  activeEffects.value = parsed.effects
})

const goConsult = (caseItem) => {
  router.push({ path: '/contact', query: { case: caseItem.title } })
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
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-md;
}

.case-search {
  max-width: 480px;
  width: 100%;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-wrap: wrap;
  justify-content: center;

  & + .filter-row {
    margin-top: $spacing-md;
  }
}

.filter-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  flex-shrink: 0;
}

.filter-tags {
  display: flex;
  gap: $spacing-sm;
  flex-wrap: wrap;
  justify-content: center;

  .el-button {
    margin-left: 0;
  }
}

.effect-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.reset-btn {
  flex-shrink: 0;
}

.result-bar {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-lg;

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
  margin: 0 (-$spacing-lg);
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

.case-footer {
  padding-top: $spacing-md;
  text-align: right;
}

.case-empty {
  padding: $spacing-xxl 0;
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
}
</style>
