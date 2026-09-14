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
    { presetId: 'paired-glass', catalogProductId: null, sourceSku: 'KM-PAIR-001' },
  )

  assert.equal(envelope.channel, HOST_BRIDGE_CHANNEL)
  assert.equal(envelope.version, HOST_BRIDGE_VERSION)
  assert.equal(envelope.type, 'REQUEST_QUOTE')
  assert.equal(envelope.projectSchemaVersion, 6)
  assert.equal(envelope.project.steles.length, 2)
  assert.equal(envelope.source.catalogProductId, null)
  assert.equal(envelope.source.sourceSku, 'KM-PAIR-001')
  assert.equal(envelope.source.projectCatalogModelId, null)
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
