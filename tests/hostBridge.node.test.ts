import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'
import {
  createQuoteRequestEnvelope,
  HOST_BRIDGE_CHANNEL,
  HOST_BRIDGE_VERSION,
  resolveParentOrigin,
} from '../src/integration/hostBridge.ts'

test('quote handoff contains configuration and source attribution but no portrait binary or contact data', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].inscription.name = 'ПЕРВЫЙ'
  project.steles[1].inscription.name = 'ВТОРОЙ'

  const envelope = createQuoteRequestEnvelope(
    project,
    'https://example.test/constructor?project=encoded',
    'catalog',
    { presetId: 'paired-glass', catalogProductId: null, sourceProfileId: null, sourceVariantIndex: null, sourceComponentId: null, sourceSku: 'KM-PAIR-001' },
  )

  assert.equal(envelope.channel, HOST_BRIDGE_CHANNEL)
  assert.equal(envelope.version, HOST_BRIDGE_VERSION)
  assert.equal(envelope.type, 'REQUEST_QUOTE')
  assert.equal(envelope.projectSchemaVersion, 6)
  assert.equal(envelope.project.steles.length, 2)
  assert.equal(envelope.source.catalogProductId, null)
  assert.equal(envelope.source.sourceProfileId, null)
  assert.equal(envelope.source.sourceVariantIndex, null)
  assert.equal(envelope.source.sourceComponentId, null)
  assert.equal(envelope.source.sourceSku, 'KM-PAIR-001')
  assert.deepEqual(envelope.privacy, {
    includesPortraitBinary: false,
    includesContactData: false,
  })

  const serialized = JSON.stringify(envelope)
  assert.equal(serialized.includes('blob:'), false)
  assert.equal(serialized.includes('data:image/'), false)
})

test('parent origin accepts only absolute HTTP(S) referrers', () => {
  assert.equal(resolveParentOrigin('https://memorial.example/path?q=1'), 'https://memorial.example')
  assert.equal(resolveParentOrigin('http://localhost:3000/page'), 'http://localhost:3000')
  assert.equal(resolveParentOrigin('javascript:alert(1)'), null)
  assert.equal(resolveParentOrigin('not a url'), null)
  assert.equal(resolveParentOrigin(''), null)
})


test('quote bridge preserves exact source profile attribution', () => {
  const project = createDefaultProject()
  project.steles[0].monument.shape = 'ermis-105'
  const envelope = createQuoteRequestEnvelope(
    project,
    'https://example.test/constructor?profile=ermis-105&sourceSku=CAT-105',
    'catalog',
    {
      presetId: null,
      catalogProductId: null,
      sourceProfileId: 'ermis-105',
      sourceVariantIndex: 0,
      sourceComponentId: null,
      sourceSku: 'CAT-105',
    },
  )

  assert.equal(envelope.source.sourceProfileId, 'ermis-105')
  assert.equal(envelope.source.sourceVariantIndex, 0)
  assert.equal(envelope.source.sourceSku, 'CAT-105')
  assert.equal(envelope.project.steles[0].monument.shape, 'ermis-105')
})

test('quote bridge carries exact source component attribution', () => {
  const project = createDefaultProject()
  project.fence.enabled = true
  project.fence.styleId = 'ermis-fence-f03'
  const envelope = createQuoteRequestEnvelope(
    project,
    'https://example.test/constructor?component=ermis-fence-f03',
    'catalog',
    {
      presetId: null,
      catalogProductId: null,
      sourceProfileId: null,
      sourceVariantIndex: null,
      sourceComponentId: 'ermis-fence-f03',
      sourceSku: 'F-03',
    },
  )
  assert.equal(envelope.source.sourceComponentId, 'ermis-fence-f03')
  assert.equal(envelope.source.sourceSku, 'F-03')
  assert.equal(envelope.project.fence.styleId, 'ermis-fence-f03')
})
