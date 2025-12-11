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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RuralBase - 귀농·귀촌 인큐베이터 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            #map { height: 600px; width: 100%; }
            .marker-cluster { background: rgba(59, 130, 246, 0.6); border-radius: 50%; }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- 헤더 -->
        <header class="bg-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-seedling text-green-600 text-3xl"></i>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">RuralBase</h1>
                        <p class="text-sm text-gray-500">귀농·귀촌 인큐베이터 플랫폼</p>
                    </div>
                </div>
                <nav class="hidden md:flex space-x-6">
                    <a href="#regions" class="text-gray-700 hover:text-green-600 transition">지역 찾기</a>
                    <a href="#education" class="text-gray-700 hover:text-green-600 transition">교육/체험</a>
                    <a href="#support" class="text-gray-700 hover:text-green-600 transition">정착 지원</a>
                    <a href="#stories" class="text-gray-700 hover:text-green-600 transition">성공 사례</a>
                </nav>
                <button class="md:hidden">
                    <i class="fas fa-bars text-2xl text-gray-700"></i>
                </button>
            </div>
        </header>

        <!-- 히어로 섹션 -->
        <section class="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">
                    농촌의 미래와 귀농인의 꿈을 한곳에서
                </h2>
                <p class="text-xl mb-8 text-green-100">
                    인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 종합 플랫폼
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button onclick="scrollToMap()" class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                        <i class="fas fa-map-marked-alt mr-2"></i>지역 찾기
                    </button>
                    <button class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
                        <i class="fas fa-play-circle mr-2"></i>소개 영상 보기
                    </button>
                </div>
            </div>
        </section>

        <!-- 주요 기능 -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4">
                <h3 class="text-3xl font-bold text-center mb-12">무엇을 도와드릴까요?</h3>
                <div class="grid md:grid-cols-4 gap-8">
                    <div class="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer">
                        <i class="fas fa-home text-5xl text-blue-500 mb-4"></i>
                        <h4 class="text-xl font-semibold mb-2">빈집 찾기</h4>
                        <p class="text-gray-600">저렴한 주거 공간 매칭</p>
                    </div>
                    <div class="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer">
                        <i class="fas fa-tractor text-5xl text-green-500 mb-4"></i>
                        <h4 class="text-xl font-semibold mb-2">스마트팜</h4>
                        <p class="text-gray-600">첨단 농업 기술 체험</p>
                    </div>
                    <div class="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer">
                        <i class="fas fa-graduation-cap text-5xl text-purple-500 mb-4"></i>
                        <h4 class="text-xl font-semibold mb-2">교육/체험</h4>
                        <p class="text-gray-600">농업 기술 교육 과정</p>
                    </div>
                    <div class="text-center p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition cursor-pointer">
                        <i class="fas fa-hand-holding-usd text-5xl text-yellow-500 mb-4"></i>
                        <h4 class="text-xl font-semibold mb-2">지원금 안내</h4>
                        <p class="text-gray-600">정착 지원 패키지</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 지도 및 필터 섹션 -->
        <section id="map-section" class="py-16 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4">
                <h3 class="text-3xl font-bold text-center mb-8">빈집 & 스마트팜 위치</h3>
                
                <!-- 필터 및 지도 토글 -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div class="flex gap-2">
                            <button id="showEmptyHouses" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                <i class="fas fa-home mr-2"></i>빈집 보기
                            </button>
                            <button id="showSmartFarms" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                <i class="fas fa-tractor mr-2"></i>스마트팜 보기
                            </button>
                            <button id="showAll" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                                <i class="fas fa-eye mr-2"></i>전체 보기
                            </button>
                        </div>
                        <div class="flex gap-2">
                            <button id="useGoogleMaps" class="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition">
                                <i class="fab fa-google mr-2"></i>Google Maps
                            </button>
                            <button id="useNaverMaps" class="px-4 py-2 border-2 border-green-500 text-green-500 rounded-lg hover:bg-green-50 transition">
                                <i class="fas fa-map mr-2"></i>Naver Maps
                            </button>
                        </div>
                    </div>
                    
                    <!-- 지역 필터 -->
                    <div class="flex flex-wrap gap-2">
                        <select id="regionFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">전체 지역</option>
                        </select>
                        <select id="riskLevelFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">전체 위험도</option>
                            <option value="3">소멸위기 (3단계)</option>
                            <option value="2">위험 (2단계)</option>
                            <option value="1">주의 (1단계)</option>
                        </select>
                    </div>
                </div>

                <!-- 지도 컨테이너 -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <div id="map"></div>
                    <div id="map-placeholder" class="h-96 flex items-center justify-center bg-gray-100">
                        <div class="text-center">
                            <i class="fas fa-map-marked-alt text-6xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">지도 API 키를 설정하면 지도가 표시됩니다</p>
                            <p class="text-sm text-gray-500 mt-2">Google Maps 또는 Naver Maps API 키가 필요합니다</p>
                        </div>
                    </div>
                </div>

                <!-- 데이터 리스트 -->
                <div id="dataList" class="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- 동적으로 채워짐 -->
                </div>
            </div>
        </section>

        <!-- 인구 소멸 지역 우선 지원 -->
        <section class="py-16 bg-red-50">
            <div class="max-w-7xl mx-auto px-4">
                <div class="text-center mb-12">
                    <h3 class="text-3xl font-bold mb-4 text-red-800">
                        <i class="fas fa-exclamation-triangle mr-2"></i>인구 소멸 위기 지역 특별 지원
                    </h3>
                    <p class="text-lg text-gray-700">인구 소멸 위험이 높은 지역일수록 더 많은 지원을 받을 수 있습니다</p>
                </div>
                <div id="riskRegions" class="grid md:grid-cols-3 gap-6">
                    <!-- 동적으로 채워짐 -->
                </div>
            </div>
        </section>

        <!-- 푸터 -->
        <footer class="bg-gray-800 text-white py-12">
            <div class="max-w-7xl mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4">RuralBase</h4>
                        <p class="text-gray-400">인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 플랫폼</p>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-4">서비스</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition">지역 찾기</a></li>
                            <li><a href="#" class="hover:text-white transition">빈집 매칭</a></li>
                            <li><a href="#" class="hover:text-white transition">스마트팜 교육</a></li>
                            <li><a href="#" class="hover:text-white transition">정착 지원</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-4">지원</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="#" class="hover:text-white transition">FAQ</a></li>
                            <li><a href="#" class="hover:text-white transition">고객 센터</a></li>
                            <li><a href="#" class="hover:text-white transition">커뮤니티</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-semibold mb-4">문의</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><i class="fas fa-phone mr-2"></i>1588-1234</li>
                            <li><i class="fas fa-envelope mr-2"></i>info@ruralbase.kr</li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 RuralBase. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // API 베이스 URL
            const API_BASE = '/api';
            
            // 전역 데이터 저장
            let regionsData = [];
            let emptyHousesData = [];
            let smartFarmsData = [];
            let currentMapType = 'none'; // 'google', 'naver', 'none'
            
            // 페이지 로드 시 데이터 가져오기
            async function loadData() {
                try {
                    // 지역 데이터
                    const regionsRes = await axios.get(API_BASE + '/regions');
                    regionsData = regionsRes.data.data || [];
                    
                    // 빈집 마커 데이터
                    const housesRes = await axios.get(API_BASE + '/empty-houses/map/markers');
                    emptyHousesData = housesRes.data.data || [];
                    
                    // 스마트팜 마커 데이터
                    const farmsRes = await axios.get(API_BASE + '/smart-farms/map/markers');
                    smartFarmsData = farmsRes.data.data || [];
                    
                    // UI 업데이트
                    updateRegionFilter();
                    updateRiskRegions();
                    updateDataList('all');
                    
                    console.log('Data loaded:', {
                        regions: regionsData.length,
                        houses: emptyHousesData.length,
                        farms: smartFarmsData.length
                    });
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            }
            
            // 지역 필터 업데이트
            function updateRegionFilter() {
                const select = document.getElementById('regionFilter');
                regionsData.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region.id;
                    option.textContent = region.province + ' ' + region.name;
                    select.appendChild(option);
                });
            }
            
            // 인구 소멸 위험 지역 표시
            function updateRiskRegions() {
                const container = document.getElementById('riskRegions');
                const highRiskRegions = regionsData.filter(r => r.population_risk_level >= 3).slice(0, 6);
                
                container.innerHTML = highRiskRegions.map(region => \`
                    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-xl font-semibold">\${region.province} \${region.name}</h4>
                            <span class="px-3 py-1 bg-red-500 text-white text-sm rounded-full">위험 \${region.population_risk_level}단계</span>
                        </div>
                        <div class="space-y-2 text-sm text-gray-600">
                            <p><i class="fas fa-user-clock mr-2 text-red-500"></i>고령화율: \${region.elderly_rate}%</p>
                            <p><i class="fas fa-home mr-2 text-blue-500"></i>빈집률: \${region.empty_house_rate}%</p>
                            <p><i class="fas fa-won-sign mr-2 text-green-500"></i>지원 예산: \${(region.support_budget / 10000).toFixed(0)}억원</p>
                        </div>
                        <p class="mt-4 text-sm text-gray-700">\${region.description || ''}</p>
                        <button class="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            상세 보기
                        </button>
                    </div>
                \`).join('');
            }
            
            // 데이터 리스트 업데이트
            function updateDataList(type) {
                const container = document.getElementById('dataList');
                let items = [];
                
                if (type === 'houses' || type === 'all') {
                    items = items.concat(emptyHousesData.map(house => ({
                        type: 'house',
                        ...house
                    })));
                }
                
                if (type === 'farms' || type === 'all') {
                    items = items.concat(smartFarmsData.map(farm => ({
                        type: 'farm',
                        ...farm
                    })));
                }
                
                container.innerHTML = items.slice(0, 12).map(item => {
                    if (item.type === 'house') {
                        return \`
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                                <div class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                    <i class="fas fa-home text-white text-6xl"></i>
                                </div>
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">빈집</span>
                                        <span class="text-sm text-gray-500">\${item.region_name}</span>
                                    </div>
                                    <h4 class="text-lg font-semibold mb-2">\${item.house_type || '주택'}</h4>
                                    <p class="text-sm text-gray-600 mb-4">\${item.address}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-xl font-bold text-green-600">\${item.price ? (item.price / 100).toFixed(0) + '억' : '가격미정'}</span>
                                        <span class="text-sm text-gray-500">\${item.rental_type || '매매'}</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    } else {
                        return \`
                            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                                <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                    <i class="fas fa-tractor text-white text-6xl"></i>
                                </div>
                                <div class="p-6">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">스마트팜</span>
                                        <span class="text-sm text-gray-500">\${item.region_name}</span>
                                    </div>
                                    <h4 class="text-lg font-semibold mb-2">\${item.name}</h4>
                                    <p class="text-sm text-gray-600 mb-4">\${item.address}</p>
                                    <div class="flex justify-between items-center">
                                        <span class="text-sm text-gray-700">\${item.crop_type || '복합 재배'}</span>
                                        <span class="text-sm font-semibold text-green-600">\${item.farm_type || '교육형'}</span>
                                    </div>
                                </div>
                            </div>
                        \`;
                    }
                }).join('');
            }
            
            // 스크롤 함수
            function scrollToMap() {
                document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
            }
            
            // 이벤트 리스너
            document.getElementById('showEmptyHouses').addEventListener('click', () => updateDataList('houses'));
            document.getElementById('showSmartFarms').addEventListener('click', () => updateDataList('farms'));
            document.getElementById('showAll').addEventListener('click', () => updateDataList('all'));
            
            document.getElementById('useGoogleMaps').addEventListener('click', () => {
                alert('Google Maps API 키가 필요합니다. wrangler.jsonc에 API 키를 설정해주세요.');
            });
            
            document.getElementById('useNaverMaps').addEventListener('click', () => {
                alert('Naver Maps API 키가 필요합니다. wrangler.jsonc에 API 키를 설정해주세요.');
            });
            
            // 초기 로드
            loadData();
        </script>
    </body>
    </html>
  `)
})

export default app
