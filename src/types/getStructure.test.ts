import { describe, it } from 'node:test'
import assert from 'node:assert'

describe('A gay thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 2)
  })

  it('should be ok', () => {
    assert.strictEqual(2, 2)
  })

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3)
    })
  })
})
