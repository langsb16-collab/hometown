import { Hono } from 'hono'
import type { Bindings, Region } from '../types/database'

const regions = new Hono<{ Bindings: Bindings }>()

// 모든 지역 조회
regions.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM regions 
      ORDER BY population_risk_level DESC, name ASC
    `).all<Region>()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch regions' }, 500)
  }
})

// 인구 소멸 위험 지역 필터링
regions.get('/risk/:level', async (c) => {
  try {
    const level = parseInt(c.req.param('level'))
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM regions 
      WHERE population_risk_level >= ?
      ORDER BY population_risk_level DESC, elderly_rate DESC
    `).bind(level).all<Region>()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch regions by risk level' }, 500)
  }
})

// 특정 지역 상세 정보
regions.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const region = await c.env.DB.prepare(`
      SELECT * FROM regions WHERE id = ?
    `).bind(id).first<Region>()
    
    if (!region) {
      return c.json({ success: false, error: 'Region not found' }, 404)
    }
    
    return c.json({ success: true, data: region })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch region' }, 500)
  }
})

export default regions
