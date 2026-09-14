import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'
import { createSourceCatalogProject } from '../src/domain/sourceCatalogProfiles.ts'
import { buildProjectSpecification } from '../src/domain/projectSpec.ts'

test('single project specification exposes monument and complex without prices', () => {
  const project = createDefaultProject()
  project.projectId = 'TEST-PROJECT'
  project.fence.enabled = true
  project.fence.styleId = 'minimal-black'

  const spec = buildProjectSpecification(project)
  assert.equal(spec.projectId, 'TEST-PROJECT')
  assert.ok(spec.sections.some((section) => section.title === 'Памятник'))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.value === 'Минималистичная ограда')))

  const serialized = JSON.stringify(spec).toLowerCase()
  assert.equal(serialized.includes('цена'), false)
  assert.equal(serialized.includes('стоимость:'), false)
})

test('paired project specification lists both memorial subjects independently', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].inscription.name = 'ПЕРВЫЙ'
  project.steles[1].inscription.name = 'ВТОРОЙ'
  const spec = buildProjectSpecification(project)

  assert.ok(spec.sections.some((section) => section.title === 'Памятник 1'))
  assert.ok(spec.sections.some((section) => section.title === 'Памятник 2'))
  assert.ok(spec.sections.some((section) => section.title === 'Портрет и надпись 1' && section.rows.some((row) => row.value === 'ПЕРВЫЙ')))
  assert.ok(spec.sections.some((section) => section.title === 'Портрет и надпись 2' && section.rows.some((row) => row.value === 'ВТОРОЙ')))
})

test('glass project specification exposes technical construction without prices', () => {
  const project = createDefaultProject()
  const stele = project.steles[0]
  stele.monument.material = 'glass'
  stele.monument.surfaceId = 'glass-clear'
  stele.monument.widthM = 0.5
  stele.monument.heightM = 1
  stele.monument.depthM = 0.016
  stele.glass.thicknessMm = 16
  stele.glass.clarity = 'low-iron'
  stele.glass.mountType = 'manet'
  stele.glass.uvPrintSides = 2
  stele.glass.printEdgeMarginMm = 12

  const spec = buildProjectSpecification(project)
  const monument = spec.sections.find((section) => section.title === 'Памятник')
  assert.equal(monument?.rows.find((row) => row.label === 'Конструкция стекла')?.value, 'Закалённый триплекс')
  assert.equal(monument?.rows.find((row) => row.label === 'Толщина стекла')?.value, '16 мм (8+8)')
  assert.equal(monument?.rows.find((row) => row.label === 'Крепление')?.value, 'Монтаж на манетах')
  assert.equal(monument?.rows.find((row) => row.label === 'УФ-печать')?.value, 'УФ-печать с двух сторон')
  assert.equal(monument?.rows.find((row) => row.label === 'Минимальный отступ рисунка')?.value, '12 мм')
  assert.equal(monument?.rows.find((row) => row.label === 'Типоразмер стеклянной стелы')?.value, '500 × 1000 мм')

  const serialized = JSON.stringify(spec).toLowerCase()
  assert.equal(serialized.includes('цена'), false)
})

test('project specification keeps inscription placeholders explicit', () => {
  const project = createDefaultProject()
  project.steles[0].portrait.frame = 'oval'
  project.steles[0].portrait.size = 1.1
  project.steles[0].inscription.epitaph = ''
  const spec = buildProjectSpecification(project)
  const inscription = spec.sections.find((section) => section.title === 'Портрет и надпись')
  assert.equal(inscription?.rows.find((row) => row.label === 'Оформление портрета')?.value, 'Овал')
  assert.equal(inscription?.rows.find((row) => row.label === 'Размер портрета')?.value, '110%')
  assert.equal(inscription?.rows.find((row) => row.label === 'Эпитафия')?.value, '—')
})


test('source catalog project specification exposes exact model and source stone provenance', () => {
  const project = createSourceCatalogProject('ermis-105', 0)
  const spec = buildProjectSpecification(project)
  const monument = spec.sections.find((section) => section.title === 'Памятник')

  assert.equal(monument?.rows.find((row) => row.label === 'Форма')?.value, 'Каталог № 105')
  assert.equal(monument?.rows.find((row) => row.label === 'Поверхность')?.value, 'K02 · ROYAL GREEN')
  assert.equal(monument?.rows.find((row) => row.label === 'Порода по каталогу')?.value, 'K02 · ROYAL GREEN')
  assert.equal(monument?.rows.find((row) => row.label === 'Источник характеристик')?.value, 'Исходный каталог, стр. 4')
})

test('glass-panel flowerbed keeps its managed catalog name in specification', () => {
  const project = createDefaultProject()
  project.flowerBed.styleId = 'glass-panel-granite-frame'
  const spec = buildProjectSpecification(project)
  const complex = spec.sections.find((section) => section.title === 'Мемориальный комплекс')
  assert.equal(complex?.rows.find((row) => row.label === 'Цветник')?.value, 'Стеклянная панель в гранитной рамке')
})


test('family source catalog specification preserves family category and exact source material', () => {
  const project = createSourceCatalogProject('ermis-family-71', 0)
  const spec = buildProjectSpecification(project)
  const monument = spec.sections.find((section) => section.title === 'Памятник')

  assert.equal(monument?.rows.find((row) => row.label === 'Форма')?.value, 'Семейный каталог № 71')
  assert.equal(monument?.rows.find((row) => row.label === 'Размеры')?.value, '1.200 × 0.900 × 0.070 м')
  assert.equal(monument?.rows.find((row) => row.label === 'Порода по каталогу')?.value, 'K06 · BLACK GABBRO')
})
