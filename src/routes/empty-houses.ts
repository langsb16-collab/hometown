import { Hono } from 'hono'
import type { Bindings, EmptyHouse } from '../types/database'

const emptyHouses = new Hono<{ Bindings: Bindings }>()

// 모든 빈집 조회
emptyHouses.get('/', async (c) => {
  try {
    const status = c.req.query('status') || 'available'
    const region_id = c.req.query('region_id')
    
    let query = `
      SELECT eh.*, r.name as region_name, r.province, r.city
      FROM empty_houses eh
      JOIN regions r ON eh.region_id = r.id
      WHERE eh.status = ?
    `
    const params: any[] = [status]
    
    if (region_id) {
      query += ` AND eh.region_id = ?`
      params.push(parseInt(region_id))
    }
    
    query += ` ORDER BY eh.created_at DESC`
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch empty houses' }, 500)
  }
})

// 특정 빈집 상세 정보
emptyHouses.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const house = await c.env.DB.prepare(`
      SELECT eh.*, r.name as region_name, r.province, r.city
      FROM empty_houses eh
      JOIN regions r ON eh.region_id = r.id
      WHERE eh.id = ?
    `).bind(id).first()
    
    if (!house) {
      return c.json({ success: false, error: 'Empty house not found' }, 404)
    }
    
    return c.json({ success: true, data: house })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch empty house' }, 500)
  }
})

// 지도 마커용 빈집 위치 데이터
emptyHouses.get('/map/markers', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        eh.id, eh.lat, eh.lng, eh.address, eh.price, 
        eh.rental_type, eh.house_type, eh.status,
        r.name as region_name
      FROM empty_houses eh
      JOIN regions r ON eh.region_id = r.id
      WHERE eh.status = 'available'
    `).all()
    
    return c.json({ success: true, data: results })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch map markers' }, 500)
  }
})

export default emptyHouses
