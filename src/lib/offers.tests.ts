import { describe, it, expect } from 'vitest'
import { allOffers, CATEGORY_LABELS } from './offers'

describe('offers data', () => {
    it('exports known category labels', () => {
        expect(CATEGORY_LABELS.phone).toBe('Mobiler')
        expect(CATEGORY_LABELS.tablet).toBe('Tablets')
    })

    it('contains offers with required fields', () => {
        expect(allOffers.length).toBeGreaterThan(0)
        expect(allOffers.every(o => o.provider && o.product_name && o.link)).toBe(true)
    })
})
