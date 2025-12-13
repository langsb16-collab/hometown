import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types/database'
import regions from './routes/regions'
import emptyHouses from './routes/empty-houses'
import smartFarms from './routes/smart-farms'

const app = new Hono<{ Bindings: Bindings }>()

// CORS 활성화
app.use('/api/*', cors())

// API 라우트
app.route('/api/regions', regions)
app.route('/api/empty-houses', emptyHouses)
app.route('/api/smart-farms', smartFarms)

// 메인 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>RuralBase - 귀농·귀촌 인큐베이터 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-size: 14px; line-height: 1.4; }
            #map { height: 300px; width: 100%; }
            .compact-section { padding: 1rem 0; }
            .compact-container { max-width: 100%; padding: 0 0.75rem; }
            .lang-btn { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
            }
            .lang-btn:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
            }
            .lang-btn.active {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                border-color: #fff;
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 컴팩트 헤더 -->
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="compact-container py-2 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-seedling text-green-600 text-lg"></i>
                    <div>
                        <h1 class="text-sm font-bold text-gray-800">RuralBase</h1>
                        <p class="text-xs text-gray-500">귀농·귀촌 플랫폼</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="switchLanguage('ko')" id="btn-ko" class="lang-btn active">
                        🇰🇷 한국어
                    </button>
                    <button onclick="switchLanguage('en')" id="btn-en" class="lang-btn">
                        🇺🇸 English
                    </button>
                </div>
            </div>
        </header>

        <!-- 컴팩트 히어로 -->
        <section class="bg-gradient-to-r from-green-600 to-emerald-700 text-white compact-section py-4">
            <div class="compact-container text-center">
                <h2 class="text-lg font-bold mb-2" data-ko="농촌의 미래와 귀농인의 꿈을 한곳에서" data-en="Rural Future & Farmer's Dream in One Place">
                    농촌의 미래와 귀농인의 꿈을 한곳에서
                </h2>
                <p class="text-xs mb-3 text-green-100" data-ko="인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 종합 플랫폼" data-en="Comprehensive platform turning depopulation crisis into opportunity">
                    인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 종합 플랫폼
                </p>
                <div class="flex justify-center gap-2">
                    <button onclick="scrollToMap()" class="bg-white text-green-600 px-4 py-1.5 rounded-md text-xs font-semibold">
                        <i class="fas fa-map-marked-alt mr-1"></i><span data-ko="지역 찾기" data-en="Find Region">지역 찾기</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- 컴팩트 주요 기능 -->
        <section class="compact-section py-3 bg-white">
            <div class="compact-container">
                <h3 class="text-base font-bold text-center mb-3" data-ko="무엇을 도와드릴까요?" data-en="How can we help?">무엇을 도와드릴까요?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <div class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition">
                        <i class="fas fa-home text-2xl text-blue-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="빈집 찾기" data-en="Empty Houses">빈집 찾기</h4>
                        <p class="text-xs text-gray-600" data-ko="저렴한 주거 공간" data-en="Affordable Housing">저렴한 주거 공간</p>
                    </div>
                    <div class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition">
                        <i class="fas fa-tractor text-2xl text-green-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="스마트팜" data-en="Smart Farm">스마트팜</h4>
                        <p class="text-xs text-gray-600" data-ko="첨단 농업 기술" data-en="Advanced Tech">첨단 농업 기술</p>
                    </div>
                    <div class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition">
                        <i class="fas fa-graduation-cap text-2xl text-purple-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="교육/체험" data-en="Education">교육/체험</h4>
                        <p class="text-xs text-gray-600" data-ko="농업 기술 교육" data-en="Farming Education">농업 기술 교육</p>
                    </div>
                    <div class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition">
                        <i class="fas fa-hand-holding-usd text-2xl text-yellow-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="지원금 안내" data-en="Support Fund">지원금 안내</h4>
                        <p class="text-xs text-gray-600" data-ko="정착 지원 패키지" data-en="Settlement Package">정착 지원 패키지</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 컴팩트 지도 섹션 -->
        <section id="map-section" class="compact-section py-3 bg-gray-50">
            <div class="compact-container">
                <h3 class="text-base font-bold text-center mb-2" data-ko="빈집 & 스마트팜 위치" data-en="Empty Houses & Smart Farms">빈집 & 스마트팜 위치</h3>
                
                <!-- 컴팩트 필터 -->
                <div class="bg-white rounded-lg shadow-sm p-2 mb-2">
                    <div class="flex justify-between items-center gap-1 mb-2">
                        <div class="flex gap-1 flex-1">
                            <button id="showEmptyHouses" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                <i class="fas fa-home mr-1"></i><span data-ko="빈집" data-en="Houses">빈집</span>
                            </button>
                            <button id="showSmartFarms" class="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs">
                                <i class="fas fa-tractor mr-1"></i><span data-ko="스마트팜" data-en="Farms">스마트팜</span>
                            </button>
                            <button id="showAll" class="flex-1 px-2 py-1 bg-gray-500 text-white rounded text-xs">
                                <i class="fas fa-eye mr-1"></i><span data-ko="전체" data-en="All">전체</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex gap-1">
                        <select id="regionFilter" class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                            <option value="" data-ko="전체 지역" data-en="All Regions">전체 지역</option>
                        </select>
                    </div>
                </div>

                <!-- 컴팩트 데이터 리스트 -->
                <div id="dataList" class="grid grid-cols-2 gap-2"></div>
            </div>
        </section>

        <!-- 컴팩트 인구 소멸 지역 -->
        <section class="compact-section py-3 bg-red-50">
            <div class="compact-container">
                <div class="text-center mb-3">
                    <h3 class="text-base font-bold mb-1 text-red-800">
                        <i class="fas fa-exclamation-triangle mr-1"></i><span data-ko="인구 소멸 위기 지역" data-en="Depopulation Crisis Regions">인구 소멸 위기 지역</span>
                    </h3>
                    <p class="text-xs text-gray-700" data-ko="위험이 높은 지역일수록 더 많은 지원" data-en="Higher risk = More support">위험이 높은 지역일수록 더 많은 지원</p>
                </div>
                <div id="riskRegions" class="grid grid-cols-1 gap-2"></div>
            </div>
        </section>

        <!-- 컴팩트 푸터 -->
        <footer class="bg-gray-800 text-white py-4">
            <div class="compact-container">
                <div class="text-center">
                    <h4 class="text-sm font-bold mb-2">RuralBase</h4>
                    <p class="text-xs text-gray-400 mb-2" data-ko="인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 플랫폼" data-en="Platform turning crisis into opportunity">인구 소멸 위기를 기회로 바꾸는 플랫폼</p>
                    <div class="text-xs text-gray-400 space-y-1">
                        <p><i class="fas fa-phone mr-1"></i>1588-1234</p>
                        <p><i class="fas fa-envelope mr-1"></i>info@ruralbase.kr</p>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-3 pt-3 text-center text-xs text-gray-400">
                    <p>&copy; 2024 RuralBase. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            const API_BASE = '/api';
            let regionsData = [];
            let emptyHousesData = [];
            let smartFarmsData = [];
            let currentLang = 'ko';
            
            // 언어 전환
            function switchLanguage(lang) {
                currentLang = lang;
                document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('btn-' + lang).classList.add('active');
                
                document.querySelectorAll('[data-' + lang + ']').forEach(el => {
                    el.textContent = el.getAttribute('data-' + lang);
                });
            }
            
            async function loadData() {
                try {
                    const [regionsRes, housesRes, farmsRes] = await Promise.all([
                        axios.get(API_BASE + '/regions'),
                        axios.get(API_BASE + '/empty-houses/map/markers'),
                        axios.get(API_BASE + '/smart-farms/map/markers')
                    ]);
                    
                    regionsData = regionsRes.data.data || [];
                    emptyHousesData = housesRes.data.data || [];
                    smartFarmsData = farmsRes.data.data || [];
                    
                    updateRegionFilter();
                    updateRiskRegions();
                    updateDataList('all');
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            }
            
            function updateRegionFilter() {
                const select = document.getElementById('regionFilter');
                regionsData.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.province + ' ' + region.name;
                    select.appendChild(option);
                });
            }
            
            function updateRiskRegions() {
                const container = document.getElementById('riskRegions');
                const highRiskRegions = regionsData.filter(r => r.population_risk_level >= 3).slice(0, 3);
                
                container.innerHTML = highRiskRegions.map(region => \`
                    <div class="bg-white rounded-lg shadow-sm p-3">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-semibold">\${region.province} \${region.name}</h4>
                            <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">위험 \${region.population_risk_level}</span>
                        </div>
                        <div class="space-y-1 text-xs text-gray-600">
                            <p><i class="fas fa-user-clock mr-1 text-red-500"></i>고령화: \${region.elderly_rate}%</p>
                            <p><i class="fas fa-home mr-1 text-blue-500"></i>빈집률: \${region.empty_house_rate}%</p>
                            <p><i class="fas fa-won-sign mr-1 text-green-500"></i>지원: \${(region.support_budget / 10000).toFixed(0)}억원</p>
                        </div>
                        <button class="mt-2 w-full px-2 py-1 bg-green-500 text-white rounded text-xs">
                            상세 보기
                        </button>
                    </div>
                \`).join('');
            }
            
            function updateDataList(type) {
                const container = document.getElementById('dataList');
                let items = [];
                
                if (type === 'houses' || type === 'all') {
                    items = items.concat(emptyHousesData.map(house => ({ type: 'house', ...house })));
                }
                
                if (type === 'farms' || type === 'all') {
                    items = items.concat(smartFarmsData.map(farm => ({ type: 'farm', ...farm })));
                }
                
                container.innerHTML = items.slice(0, 8).map(item => {
                    if (item.type === 'house') {
                        return \`
                            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div class="h-24 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <i class="fas fa-home text-white text-3xl"></i>
                                </div>
                                <div class="p-2">
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">빈집</span>
                                    <h4 class="text-xs font-semibold mt-1">\${item.house_type || '주택'}</h4>
                                    <p class="text-xs text-gray-600 truncate">\${item.address}</p>
                                    <div class="flex justify-between items-center mt-1">
                                        <span class="text-sm font-bold text-green-600">\${item.price ? (item.price / 100).toFixed(0) + '억' : '미정'}</span>
                                        <span class="text-xs text-gray-500">\${item.rental_type || '매매'}</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    } else {
                        return \`
                            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div class="h-24 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <i class="fas fa-tractor text-white text-3xl"></i>
                                </div>
                                <div class="p-2">
                                    <span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">스마트팜</span>
                                    <h4 class="text-xs font-semibold mt-1">\${item.name}</h4>
                                    <p class="text-xs text-gray-600 truncate">\${item.address}</p>
                                    <div class="flex justify-between items-center mt-1">
                                        <span class="text-xs text-gray-700">\${item.crop_type || '복합'}</span>
                                        <span class="text-xs font-semibold text-green-600">\${item.farm_type || '교육형'}</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }
                }).join('');
            }
            
            function scrollToMap() {
                document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
            }
            
            document.getElementById('showEmptyHouses').addEventListener('click', () => updateDataList('houses'));
            document.getElementById('showSmartFarms').addEventListener('click', () => updateDataList('farms'));
            document.getElementById('showAll').addEventListener('click', () => updateDataList('all'));
            
            loadData();
        </script>
    </body>
    </html>
  `)
})

export default app
