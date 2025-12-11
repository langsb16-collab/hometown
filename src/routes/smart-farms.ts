import { Hono } from 'hono'
import type { Bindings, SmartFarm } from '../types/database'

const smartFarms = new Hono<{ Bindings: Bindings }>()

// 모든 스마트팜 조회
smartFarms.get('/', async (c) => {
  try {
    const farm_type = c.req.query('farm_type')
    const region_id = c.req.query('region_id')
    const education_available = c.req.query('education_available')
    
    let query = `
      SELECT sf.*, r.name as region_name, r.province, r.city
      FROM smart_farms sf
      JOIN regions r ON sf.region_id = r.id
      WHERE 1=1
    `
    const params: any[] = []
    
    if (farm_type) {
      query += ` AND sf.farm_type = ?`
      params.push(farm_type)
    }
    
    if (region_id) {
      query += ` AND sf.region_id = ?`
      params.push(parseInt(region_id))
    }
    
    if (education_available) {
      query += ` AND sf.education_available = ?`
      params.push(parseInt(education_available))
    }
    
    query += ` ORDER BY sf.created_at DESC`
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch smart farms' }, 500)
  }
})

// 특정 스마트팜 상세 정보
smartFarms.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const farm = await c.env.DB.prepare(`
      SELECT sf.*, r.name as region_name, r.province, r.city
      FROM smart_farms sf
      JOIN regions r ON sf.region_id = r.id
      WHERE sf.id = ?
    `).bind(id).first()
    
    if (!farm) {
      return c.json({ success: false, error: 'Smart farm not found' }, 404)
    }
    
    return c.json({ success: true, data: farm })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch smart farm' }, 500)
  }
})

// 지도 마커용 스마트팜 위치 데이터
smartFarms.get('/map/markers', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        sf.id, sf.lat, sf.lng, sf.name, sf.address, 
        sf.farm_type, sf.crop_type, sf.education_available,
        r.name as region_name
      FROM smart_farms sf
      JOIN regions r ON sf.region_id = r.id
    `).all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch map markers' }, 500)
  }
})

export default smartFarms
