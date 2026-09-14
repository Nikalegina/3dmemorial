import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'
import { buildProjectSpecification } from '../src/domain/projectSpec.ts'
import { createProjectFromSourceCatalogModel } from '../src/domain/sourceCatalog.ts'

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


test('source catalog project specification preserves model, size and stone provenance', () => {
  const project = createProjectFromSourceCatalogModel('ERMIS-SINGLE-20')
  const spec = buildProjectSpecification(project)
  const source = spec.sections.find((section) => section.title === 'Источник модели')
  assert.equal(source?.rows.find((row) => row.label === 'Модель')?.value, '№ 20')
  assert.equal(source?.rows.find((row) => row.label === 'Страница каталога')?.value, '12')
  assert.equal(source?.rows.find((row) => row.label === 'Исходный типоразмер')?.value, '1100 × 600 × 70 мм (В × Ш × Т)')
  assert.equal(source?.rows.find((row) => row.label === 'Код камня')?.value, 'К06 — BLACK GABBRO')

  const monument = spec.sections.find((section) => section.title === 'Памятник')
  assert.equal(monument?.rows.find((row) => row.label === 'Поверхность')?.value, 'К06 — BLACK GABBRO')
})

test('glass panel flowerbed keeps its managed name in specification', () => {
  const project = createDefaultProject()
  project.flowerBed.enabled = true
  project.flowerBed.styleId = 'glass-panel-granite-frame'
  const spec = buildProjectSpecification(project)
  const complex = spec.sections.find((section) => section.title === 'Мемориальный комплекс')
  assert.equal(complex?.rows.find((row) => row.label === 'Цветник')?.value, 'Стеклянная панель в гранитной рамке')
})
