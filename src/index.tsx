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
                <div class="flex items-center gap-1 flex-wrap">
                    <button onclick="switchLanguage('ko')" id="btn-ko" class="lang-btn active">
                        🇰🇷 한국어
                    </button>
                    <button onclick="switchLanguage('en')" id="btn-en" class="lang-btn">
                        🇺🇸 EN
                    </button>
                    <button onclick="switchLanguage('zh')" id="btn-zh" class="lang-btn">
                        🇨🇳 中文
                    </button>
                    <button onclick="switchLanguage('ja')" id="btn-ja" class="lang-btn">
                        🇯🇵 日本
                    </button>
                    <button onclick="switchLanguage('mn')" id="btn-mn" class="lang-btn">
                        🇲🇳 MN
                    </button>
                    <button onclick="switchLanguage('ru')" id="btn-ru" class="lang-btn">
                        🇷🇺 RU
                    </button>
                    <button onclick="switchLanguage('vi')" id="btn-vi" class="lang-btn">
                        🇻🇳 VN
                    </button>
                </div>
            </div>
        </header>

        <!-- 컴팩트 히어로 -->
        <section class="bg-gradient-to-r from-green-600 to-emerald-700 text-white compact-section py-4">
            <div class="compact-container text-center">
                <h2 class="text-lg font-bold mb-2" 
                    data-ko="농촌의 미래와 귀농인의 꿈을 한곳에서" 
                    data-en="Rural Future & Farmer's Dream in One Place"
                    data-zh="农村的未来与农民的梦想尽在一处"
                    data-ja="農村の未来と農業者の夢を一箇所で"
                    data-mn="Хөдөөгийн ирээдүй болон тариаланчдын мөрөөдөл нэг газарт"
                    data-ru="Будущее села и мечта фермера в одном месте"
                    data-vi="Tương lai nông thôn và ước mơ của nông dân tại một nơi">
                    농촌의 미래와 귀농인의 꿈을 한곳에서
                </h2>
                <p class="text-xs mb-3 text-green-100" 
                    data-ko="인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 종합 플랫폼" 
                    data-en="Comprehensive platform turning depopulation crisis into opportunity"
                    data-zh="将人口消失危机转变为机遇的综合农业定居平台"
                    data-ja="人口減少危機を機会に変える総合農業定住プラットフォーム"
                    data-mn="Хүн амын тоо буурах хямралыг боломж болгон хувиргах цогц хөдөө аж ахуйн суурьшлын платформ"
                    data-ru="Комплексная платформа для превращения кризиса депопуляции в возможность"
                    data-vi="Nền tảng tổng hợp biến khủng hoảng giảm dân số thành cơ hội">
                    인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 종합 플랫폼
                </p>
                <div class="flex justify-center gap-2">
                    <button onclick="scrollToMap()" class="bg-white text-green-600 px-4 py-1.5 rounded-md text-xs font-semibold">
                        <i class="fas fa-map-marked-alt mr-1"></i><span data-ko="지역 찾기" data-en="Find Region" data-zh="查找地区" data-ja="地域を探す" data-mn="Бүс нутаг хайх" data-ru="Найти регион" data-vi="Tìm khu vực">지역 찾기</span>
                    </button>
                </div>
            </div>
        </section>

        <!-- 컴팩트 주요 기능 -->
        <section class="compact-section py-3 bg-white">
            <div class="compact-container">
                <h3 class="text-base font-bold text-center mb-3" data-ko="무엇을 도와드릴까요?" data-en="How can we help?" data-zh="我们能为您做什么？" data-ja="何をお手伝いできますか？" data-mn="Бид танд юугаар тусалж чадах вэ?" data-ru="Чем мы можем помочь?" data-vi="Chúng tôi có thể giúp gì cho bạn?">무엇을 도와드릴까요?</h3>
                <div class="grid grid-cols-2 gap-2">
                    <div onclick="toggleMenu('emptyHouse')" class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition cursor-pointer">
                        <i class="fas fa-home text-2xl text-blue-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="빈집 찾기" data-en="Empty Houses" data-zh="寻找空房" data-ja="空き家を探す" data-mn="Хоосон байшин хайх" data-ru="Найти пустой дом" data-vi="Tìm nhà trống">빈집 찾기</h4>
                        <p class="text-xs text-gray-600" data-ko="저렴한 주거 공간" data-en="Affordable Housing" data-zh="实惠的住房" data-ja="手頃な住宅" data-mn="Боломжийн орон сууц" data-ru="Доступное жилье" data-vi="Nhà ở giá phải chăng">저렴한 주거 공간</p>
                    </div>
                    <div onclick="toggleMenu('smartFarm')" class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition cursor-pointer">
                        <i class="fas fa-tractor text-2xl text-green-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="스마트팜" data-en="Smart Farm" data-zh="智慧农场" data-ja="スマートファーム" data-mn="Ухаалаг ферм" data-ru="Умная ферма" data-vi="Trang trại thông minh">스마트팜</h4>
                        <p class="text-xs text-gray-600" data-ko="첨단 농업 기술" data-en="Advanced Tech" data-zh="尖端农业技术" data-ja="先端農業技術" data-mn="Дэвшилтэт хөдөө аж ахуйн технологи" data-ru="Передовые агротехнологии" data-vi="Công nghệ nông nghiệp tiên tiến">첨단 농업 기술</p>
                    </div>
                    <div onclick="toggleMenu('education')" class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition cursor-pointer">
                        <i class="fas fa-graduation-cap text-2xl text-purple-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="교육/체험" data-en="Education" data-zh="教育/体验" data-ja="教育/体験" data-mn="Боловсрол/Туршлага" data-ru="Обучение/Опыт" data-vi="Giáo dục/Trải nghiệm">교육/체험</h4>
                        <p class="text-xs text-gray-600" data-ko="농업 기술 교육" data-en="Farming Education" data-zh="农业技术教育" data-ja="農業技術教育" data-mn="Хөдөө аж ахуйн техникийн боловсрол" data-ru="Обучение агротехнологиям" data-vi="Giáo dục kỹ thuật nông nghiệp">농업 기술 교육</p>
                    </div>
                    <div onclick="toggleMenu('support')" class="text-center p-3 rounded-lg border border-gray-200 hover:border-green-500 transition cursor-pointer">
                        <i class="fas fa-hand-holding-usd text-2xl text-yellow-500 mb-1"></i>
                        <h4 class="text-xs font-semibold mb-1" data-ko="지원금 안내" data-en="Support Fund" data-zh="补助金指南" data-ja="支援金案内" data-mn="Дэмжлэгийн сангийн мэдээлэл" data-ru="Информация о субсидиях" data-vi="Hướng dẫn trợ cấp">지원금 안내</h4>
                        <p class="text-xs text-gray-600" data-ko="정착 지원 패키지" data-en="Settlement Package" data-zh="定居支持套餐" data-ja="定住支援パッケージ" data-mn="Суурьшлын дэмжлэгийн багц" data-ru="Пакет поддержки поселения" data-vi="Gói hỗ trợ định cư">정착 지원 패키지</p>
                    </div>
                </div>
                
                <!-- 하위 메뉴 (초기에는 숨김) -->
                <div id="menu-emptyHouse" class="hidden mt-3 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <h5 class="text-sm font-bold mb-2 text-blue-800" data-ko="빈집 매칭 서비스" data-en="Empty House Matching" data-zh="空房匹配服务" data-ja="空き家マッチングサービス" data-mn="Хоосон байшны тааруулах үйлчилгээ" data-ru="Подбор пустых домов" data-vi="Dịch vụ kết nối nhà trống">빈집 매칭 서비스</h5>
                    <div class="space-y-2">
                        <div class="bg-white p-2 rounded text-xs">
                            <p class="text-gray-700 mb-2" data-ko="🏠 전국 빈집 데이터베이스 제공" data-en="🏠 National empty house database" data-zh="🏠 提供全国空房数据库" data-ja="🏠 全国空き家データベース提供" data-mn="🏠 Улсын хоосон байшингийн мэдээллийн сан" data-ru="🏠 Национальная база данных пустых домов" data-vi="🏠 Cơ sở dữ liệu nhà trống toàn quốc">🏠 전국 빈집 데이터베이스 제공</p>
                            <p class="text-gray-700 mb-2" data-ko="💰 저렴한 가격의 농촌 주택" data-en="💰 Affordable rural housing" data-zh="💰 价格实惠的农村住房" data-ja="💰 手頃な価格の農村住宅" data-mn="💰 Боломжийн үнэтэй хөдөө орон сууц" data-ru="💰 Доступное сельское жилье" data-vi="💰 Nhà ở nông thôn giá rẻ">💰 저렴한 가격의 농촌 주택</p>
                            <p class="text-gray-700" data-ko="📋 리모델링 지원 프로그램 연계" data-en="📋 Renovation support program" data-zh="📋 关联改造支持项目" data-ja="📋 リフォーム支援プログラム連携" data-mn="📋 Засварын дэмжлэгийн хөтөлбөр" data-ru="📋 Программа поддержки ремонта" data-vi="📋 Chương trình hỗ trợ cải tạo">📋 리모델링 지원 프로그램 연계</p>
                        </div>
                        <button onclick="scrollToMap(); filterVideos('policy')" class="w-full px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                            <i class="fas fa-search-location mr-1"></i><span data-ko="빈집 지도에서 찾기" data-en="Find on Map" data-zh="在地图上查找空房" data-ja="地図で探す" data-mn="Газрын зураг дээр хайх" data-ru="Найти на карте" data-vi="Tìm trên bản đồ">빈집 지도에서 찾기</span>
                        </button>
                        <button onclick="scrollToVideos(); filterVideos('policy')" class="w-full px-3 py-2 bg-blue-400 text-white rounded text-xs hover:bg-blue-500">
                            <i class="fas fa-play-circle mr-1"></i><span data-ko="지원 정책 영상 보기" data-en="Watch Policy Videos" data-zh="观看政策视频" data-ja="政策動画を見る" data-mn="Бодлогын видео үзэх" data-ru="Смотреть видео о политике" data-vi="Xem video chính sách">지원 정책 영상 보기</span>
                        </button>
                    </div>
                </div>
                
                <div id="menu-smartFarm" class="hidden mt-3 bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                    <h5 class="text-sm font-bold mb-2 text-green-800" data-ko="스마트팜 창업 지원" data-en="Smart Farm Startup" data-zh="智慧农场创业支持" data-ja="スマートファーム創業支援" data-mn="Ухаалаг ферм бизнес дэмжлэг" data-ru="Поддержка стартапов умных ферм" data-vi="Hỗ trợ khởi nghiệp trang trại thông minh">스마트팜 창업 지원</h5>
                    <div class="space-y-2">
                        <div class="bg-white p-2 rounded text-xs">
                            <p class="text-gray-700 mb-2" data-ko="🌱 첨단 농업 기술 교육" data-en="🌱 Advanced agri-tech training" data-zh="🌱 尖端农业技术教育" data-ja="🌱 先端農業技術教育" data-mn="🌱 Дэвшилтэт хөдөө аж ахуйн технологийн сургалт" data-ru="🌱 Обучение передовым агротехнологиям" data-vi="🌱 Đào tạo công nghệ nông nghiệp tiên tiến">🌱 첨단 농업 기술 교육</p>
                            <p class="text-gray-700 mb-2" data-ko="💻 IoT·빅데이터 기반 농장 관리" data-en="💻 IoT & Big Data farm management" data-zh="💻 基于物联网和大数据的农场管理" data-ja="💻 IoT・ビッグデータ基盤農場管理" data-mn="💻 IoT болон том өгөгдөл дээр суурилсан фермийн удирдлага" data-ru="💻 Управление фермой на основе IoT и больших данных" data-vi="💻 Quản lý trang trại dựa trên IoT và Big Data">💻 IoT·빅데이터 기반 농장 관리</p>
                            <p class="text-gray-700" data-ko="📊 수익 모델 컨설팅" data-en="📊 Revenue model consulting" data-zh="📊 收益模式咨询" data-ja="📊 収益モデルコンサルティング" data-mn="📊 Орлогын загварын зөвлөгөө" data-ru="📊 Консультирование по бизнес-моделям" data-vi="📊 Tư vấn mô hình doanh thu">📊 수익 모델 컨설팅</p>
                        </div>
                        <button onclick="scrollToMap(); updateDataList('farms')" class="w-full px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                            <i class="fas fa-map-marked-alt mr-1"></i><span data-ko="스마트팜 지도 보기" data-en="View Farm Map" data-zh="查看智慧农场地图" data-ja="スマートファーム地図を見る" data-mn="Ухаалаг фермийн газрын зураг үзэх" data-ru="Посмотреть карту ферм" data-vi="Xem bản đồ trang trại">스마트팜 지도 보기</span>
                        </button>
                        <button onclick="scrollToVideos(); filterVideos('education')" class="w-full px-3 py-2 bg-green-400 text-white rounded text-xs hover:bg-green-500">
                            <i class="fas fa-graduation-cap mr-1"></i><span data-ko="창업 교육 영상" data-en="Watch Startup Videos" data-zh="观看创业教育视频" data-ja="創業教育動画" data-mn="Бизнес эхлүүлэх сургалтын видео" data-ru="Смотреть обучающие видео" data-vi="Xem video khởi nghiệp">창업 교육 영상</span>
                        </button>
                    </div>
                </div>
                
                <div id="menu-education" class="hidden mt-3 bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                    <h5 class="text-sm font-bold mb-2 text-purple-800" data-ko="귀농귀촌 교육 프로그램" data-en="Farming Education Program" data-zh="返乡务农教育项目" data-ja="帰農帰村教育プログラム" data-mn="Хөдөө рүү буцах боловсролын хөтөлбөр" data-ru="Образовательная программа" data-vi="Chương trình giáo dục nông nghiệp">귀농귀촌 교육 프로그램</h5>
                    <div class="space-y-2">
                        <div class="bg-white p-2 rounded text-xs">
                            <p class="text-gray-700 mb-2" data-ko="📚 체계적인 귀농 교육 과정" data-en="📚 Systematic farming education" data-zh="📚 系统化的返乡务农教育课程" data-ja="📚 体系的な帰農教育課程" data-mn="📚 Системтэй хөдөө аж ахуйн боловсролын курс" data-ru="📚 Систематическое обучение фермерству" data-vi="📚 Khóa học nông nghiệp có hệ thống">📚 체계적인 귀농 교육 과정</p>
                            <p class="text-gray-700 mb-2" data-ko="🎓 전문가 멘토링 프로그램" data-en="🎓 Expert mentoring program" data-zh="🎓 专家指导项目" data-ja="🎓 専門家メンタリングプログラム" data-mn="🎓 Мэргэжилтний удирдлагын хөтөлбөр" data-ru="🎓 Программа менторства экспертов" data-vi="🎓 Chương trình cố vấn chuyên gia">🎓 전문가 멘토링 프로그램</p>
                            <p class="text-gray-700" data-ko="🌾 현장 실습 기회 제공" data-en="🌾 On-site training opportunities" data-zh="🌾 提供现场实习机会" data-ja="🌾 現場実習機会提供" data-mn="🌾 Хээрийн дадлагын боломж" data-ru="🌾 Возможности практической подготовки" data-vi="🌾 Cơ hội thực tập thực tế">🌾 현장 실습 기회 제공</p>
                        </div>
                        <button onclick="scrollToVideos(); filterVideos('education')" class="w-full px-3 py-2 bg-purple-500 text-white rounded text-xs hover:bg-purple-600">
                            <i class="fas fa-book-open mr-1"></i><span data-ko="교육 영상 전체 보기" data-en="View All Education Videos" data-zh="查看全部教育视频" data-ja="教育動画全体を見る" data-mn="Бүх боловсролын видео үзэх" data-ru="Посмотреть все обучающие видео" data-vi="Xem tất cả video giáo dục">교육 영상 전체 보기</span>
                        </button>
                        <button onclick="scrollToVideos(); filterVideos('success')" class="w-full px-3 py-2 bg-purple-400 text-white rounded text-xs hover:bg-purple-500">
                            <i class="fas fa-trophy mr-1"></i><span data-ko="성공 사례 보기" data-en="View Success Stories" data-zh="查看成功案例" data-ja="成功事例を見る" data-mn="Амжилтын түүх үзэх" data-ru="Посмотреть истории успеха" data-vi="Xem câu chuyện thành công">성공 사례 보기</span>
                        </button>
                    </div>
                </div>
                
                <div id="menu-support" class="hidden mt-3 bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                    <h5 class="text-sm font-bold mb-2 text-yellow-800" data-ko="정착 지원금 안내" data-en="Settlement Subsidy Guide" data-zh="定居支持补助指南" data-ja="定住支援金案内" data-mn="Суурьшлын дэмжлэгийн мэдээлэл" data-ru="Руководство по субсидиям" data-vi="Hướng dẫn trợ cấp định cư">정착 지원금 안내</h5>
                    <div class="space-y-2">
                        <div class="bg-white p-2 rounded text-xs">
                            <p class="text-gray-700 mb-2" data-ko="💰 정착 자금 최대 3억원 지원" data-en="💰 Up to 300M won settlement fund" data-zh="💰 最多支持3亿韩元定居资金" data-ja="💰 最大3億ウォン定住資金支援" data-mn="💰 300 сая вон хүртэлх суурьшлын сан" data-ru="💰 До 300 млн вон на поселение" data-vi="💰 Hỗ trợ tối đa 300 triệu won">💰 정착 자금 최대 3억원 지원</p>
                            <p class="text-gray-700 mb-2" data-ko="🏡 주택 구입·리모델링 지원" data-en="🏡 Housing purchase & renovation" data-zh="🏡 支持购房和改造" data-ja="🏡 住宅購入・リフォーム支援" data-mn="🏡 Орон сууц худалдан авах, засварын дэмжлэг" data-ru="🏡 Покупка и ремонт жилья" data-vi="🏡 Hỗ trợ mua nhà và cải tạo">🏡 주택 구입·리모델링 지원</p>
                            <p class="text-gray-700" data-ko="🚜 농기계·시설 구입 보조" data-en="🚜 Farm equipment subsidies" data-zh="🚜 补助购买农机和设施" data-ja="🚜 農機械・施設購入補助" data-mn="🚜 Хөдөө аж ахуйн машин, байгууламжийн тусламж" data-ru="🚜 Субсидии на сельхозтехнику" data-vi="🚜 Trợ cấp thiết bị nông nghiệp">🚜 농기계·시설 구입 보조</p>
                        </div>
                        <button onclick="scrollToVideos(); filterVideos('policy')" class="w-full px-3 py-2 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">
                            <i class="fas fa-hand-holding-usd mr-1"></i><span data-ko="지원금 정책 영상" data-en="Watch Subsidy Policy Videos" data-zh="观看补助政策视频" data-ja="支援金政策動画" data-mn="Дэмжлэгийн бодлогын видео" data-ru="Смотреть видео о субсидиях" data-vi="Xem video chính sách trợ cấp">지원금 정책 영상</span>
                        </button>
                        <button onclick="document.getElementById('riskRegions').scrollIntoView({behavior:'smooth'})" class="w-full px-3 py-2 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500">
                            <i class="fas fa-exclamation-triangle mr-1"></i><span data-ko="위기 지역 보기" data-en="View Crisis Regions" data-zh="查看危机地区" data-ja="危機地域を見る" data-mn="Хямрал үзүүлэлт бүс үзэх" data-ru="Посмотреть кризисные регионы" data-vi="Xem khu vực khủng hoảng">위기 지역 보기</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- 컴팩트 지도 섹션 -->
        <section id="map-section" class="compact-section py-3 bg-gray-50">
            <div class="compact-container">
                <h3 class="text-base font-bold text-center mb-2" data-ko="빈집 & 스마트팜 위치" data-en="Empty Houses & Smart Farms" data-zh="空房与智慧农场位置" data-ja="空き家とスマートファームの位置" data-mn="Хоосон байшин ба ухаалаг фермийн байршил" data-ru="Расположение пустых домов и умных ферм" data-vi="Vị trí nhà trống và trang trại thông minh">빈집 & 스마트팜 위치</h3>
                
                <!-- 컴팩트 필터 -->
                <div class="bg-white rounded-lg shadow-sm p-2 mb-2">
                    <div class="flex justify-between items-center gap-1 mb-2">
                        <div class="flex gap-1 flex-1">
                            <button id="showEmptyHouses" class="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs">
                                <i class="fas fa-home mr-1"></i><span data-ko="빈집" data-en="Houses" data-zh="空房" data-ja="空き家" data-mn="Хоосон байшин" data-ru="Пустые дома" data-vi="Nhà trống">빈집</span>
                            </button>
                            <button id="showSmartFarms" class="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs">
                                <i class="fas fa-tractor mr-1"></i><span data-ko="스마트팜" data-en="Farms" data-zh="智慧农场" data-ja="スマートファーム" data-mn="Ухаалаг ферм" data-ru="Умные фермы" data-vi="Trang trại thông minh">스마트팜</span>
                            </button>
                            <button id="showAll" class="flex-1 px-2 py-1 bg-gray-500 text-white rounded text-xs">
                                <i class="fas fa-eye mr-1"></i><span data-ko="전체" data-en="All" data-zh="全部" data-ja="全て" data-mn="Бүгд" data-ru="Все" data-vi="Tất cả">전체</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex gap-1">
                        <select id="regionFilter" class="flex-1 px-2 py-1 border border-gray-300 rounded text-xs">
                            <option value="" data-ko="전체 지역" data-en="All Regions" data-zh="所有地区" data-ja="全地域" data-mn="Бүх бүс нутаг" data-ru="Все регионы" data-vi="Tất cả khu vực">전체 지역</option>
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
                        <i class="fas fa-exclamation-triangle mr-1"></i><span data-ko="인구 소멸 위기 지역" data-en="Depopulation Crisis Regions" data-zh="人口消失危机地区" data-ja="人口減少危機地域" data-mn="Хүн ам үгүй болох үзүүлэлт бүс нутаг" data-ru="Регионы кризиса депопуляции" data-vi="Khu vực khủng hoảng giảm dân số">인구 소멸 위기 지역</span>
                    </h3>
                    <p class="text-xs text-gray-700" data-ko="위험이 높은 지역일수록 더 많은 지원" data-en="Higher risk = More support" data-zh="风险越高，支持越多" data-ja="リスクが高いほど多くの支援" data-mn="Эрсдэл их бүс нутаг илүү дэмжлэг" data-ru="Чем выше риск, тем больше поддержка" data-vi="Rủi ro cao hơn = Hỗ trợ nhiều hơn">위험이 높은 지역일수록 더 많은 지원</p>
                </div>
                <div id="riskRegions" class="grid grid-cols-1 gap-2"></div>
            </div>
        </section>

        <!-- 지원책 관련 영상 -->
        <section id="video-section" class="compact-section py-3 bg-gradient-to-br from-blue-50 to-purple-50">
            <div class="compact-container">
                <div class="text-center mb-3">
                    <h3 class="text-base font-bold mb-1 text-green-800">
                        <i class="fas fa-play-circle mr-1"></i><span data-ko="지원책 관련 영상" data-en="Support Policy Videos" data-zh="支持政策相关视频" data-ja="支援策関連動画" data-mn="Дэмжлэгийн бодлоготой холбоотой видео" data-ru="Видео о политике поддержки" data-vi="Video chính sách hỗ trợ">지원책 관련 영상</span>
                    </h3>
                    <p class="text-xs text-gray-700 mb-2" data-ko="귀농·귀촌 지원 정책과 성공 사례를 영상으로 확인하세요" data-en="Check support policies and success stories through videos" data-zh="通过视频了解支持政策和成功案例" data-ja="支援政策と成功事例を動画で確認" data-mn="Дэмжлэгийн бодлого болон амжилтын түүхийг видеогоор үзнэ үү" data-ru="Ознакомьтесь с политикой поддержки и историями успеха через видео" data-vi="Xem chính sách hỗ trợ và câu chuyện thành công qua video">귀농·귀촌 지원 정책과 성공 사례를 영상으로 확인하세요</p>
                    
                    <!-- 영상 필터 버튼 -->
                    <div class="flex justify-center gap-1 mb-3 flex-wrap">
                        <button onclick="filterVideos('all')" id="filter-all" class="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                            <i class="fas fa-th mr-1"></i><span data-ko="전체" data-en="All" data-zh="全部" data-ja="全て" data-mn="Бүгд" data-ru="Все" data-vi="Tất cả">전체</span>
                        </button>
                        <button onclick="filterVideos('policy')" id="filter-policy" class="px-3 py-1 bg-white text-gray-700 rounded-full text-xs">
                            <i class="fas fa-landmark mr-1"></i><span data-ko="정책" data-en="Policy" data-zh="政策" data-ja="政策" data-mn="Бодлого" data-ru="Политика" data-vi="Chính sách">정책</span>
                        </button>
                        <button onclick="filterVideos('education')" id="filter-education" class="px-3 py-1 bg-white text-gray-700 rounded-full text-xs">
                            <i class="fas fa-book mr-1"></i><span data-ko="교육" data-en="Education" data-zh="教育" data-ja="教育" data-mn="Боловсрол" data-ru="Обучение" data-vi="Giáo dục">교육</span>
                        </button>
                        <button onclick="filterVideos('success')" id="filter-success" class="px-3 py-1 bg-white text-gray-700 rounded-full text-xs">
                            <i class="fas fa-trophy mr-1"></i><span data-ko="성공사례" data-en="Success" data-zh="成功案例" data-ja="成功事例" data-mn="Амжилт" data-ru="Успех" data-vi="Thành công">성공사례</span>
                        </button>
                    </div>
                </div>
                <div id="videoList" class="grid grid-cols-2 gap-2"></div>
            </div>
        </section>

        <!-- 컴팩트 푸터 -->
        <footer class="bg-gray-800 text-white py-4">
            <div class="compact-container">
                <div class="text-center">
                    <h4 class="text-sm font-bold mb-2">RuralBase</h4>
                    <p class="text-xs text-gray-400 mb-2" data-ko="인구 소멸 위기를 기회로 바꾸는 귀농·귀촌 플랫폼" data-en="Platform turning crisis into opportunity" data-zh="将危机转变为机遇的平台" data-ja="危機をチャンスに変えるプラットフォーム" data-mn="Үзүүлэлтийг боломж болгон хувьсгах платформ" data-ru="Платформа, превращающая кризис в возможность" data-vi="Nền tảng biến khủng hoảng thành cơ hội">인구 소멸 위기를 기회로 바꾸는 플랫폼</p>
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
            
            // 유튜브 영상 데이터
            const youtubeVideos = [
                {
                    id: '4v33UFxxTxQ',
                    title: { ko: '청년 농업 정착 지원', en: 'Youth Farm Support', zh: '青年农业定居支持', ja: '青年農業定住支援', mn: 'Залуучуудын хөдөө аж ахуйн дэмжлэг', ru: 'Поддержка молодых фермеров', vi: 'Hỗ trợ nông nghiệp thanh niên' },
                    category: 'policy'
                },
                {
                    id: 'TGP4kiBG4xY',
                    title: { ko: '월세 8만원 청년 농촌 정착', en: 'Rural Settlement Program', zh: '月租8万韩元青年农村定居', ja: '月8万ウォン青年農村定住', mn: '8 мянган вон сарын төлбөртэй залуучуудын хөдөө нутагт суурьшсан', ru: 'Программа поселения молодежи', vi: 'Định cư nông thôn thanh niên 80k won' },
                    category: 'policy'
                },
                {
                    id: 'I0BFaP_iiRM',
                    title: { ko: '지역활력타운 지원정책', en: 'Regional Vitality Town', zh: '地区活力小镇支持', ja: '地域活力タウン支援', mn: 'Бүс нутгийн амьдрал сэдвийн дэмжлэг', ru: 'Поддержка региональных городов', vi: 'Chính sách hỗ trợ thị trấn sống động' },
                    category: 'policy'
                },
                {
                    id: 'DXOyA2_o11o',
                    title: { ko: '인구감소 대응 지역경제 활성화', en: 'Economic Revitalization', zh: '应对人口减少的地区经济振兴', ja: '人口減少対応地域経済活性化', mn: 'Хүн амын тоо буурахад хариу үйлдэл', ru: 'Экономическое возрождение регионов', vi: 'Phục hồi kinh tế khu vực' },
                    category: 'policy'
                },
                {
                    id: 'zOhm8T_L4rA',
                    title: { ko: '스마트농업 농촌 활성화', en: 'Smart Agriculture Activation', zh: '智慧农业农村振兴', ja: 'スマート農業農村活性化', mn: 'Ухаалаг хөдөө аж ахуйн сэргээлт', ru: 'Активизация умного сельского хозяйства', vi: 'Kích hoạt nông nghiệp thông minh' },
                    category: 'education'
                },
                {
                    id: 'PLaiEbMM65nCOn0GK3pgRDMQjELhdpbAur',
                    title: { ko: '청년농업인 지원사업 총정리', en: 'Youth Farmer Support Overview', zh: '青年农业人支持事业总结', ja: '青年農業者支援事業総まとめ', mn: 'Залуу фермерүүдийн дэмжлэгийн нийт', ru: 'Обзор поддержки молодых фермеров', vi: 'Tổng hợp hỗ trợ nông dân trẻ' },
                    category: 'education',
                    isPlaylist: true
                },
                {
                    id: 'eJZmF5qKLlI',
                    title: { ko: '귀농귀촌 지원 정책 가이드', en: 'Rural Return Support Guide', zh: '返乡务农支持政策指南', ja: '帰農帰村支援政策ガイド', mn: 'Хөдөө рүү буцах дэмжлэгийн гарын авлага', ru: 'Руководство по поддержке возвращения в село', vi: 'Hướng dẫn chính sách hỗ trợ quay về nông thôn' },
                    category: 'policy'
                },
                {
                    id: 'j8K7vX9pZGY',
                    title: { ko: '귀농 성공 사례 인터뷰', en: 'Success Story Interview', zh: '返乡成功案例采访', ja: '帰農成功事例インタビュー', mn: 'Амжилтын түүх ярилцлага', ru: 'Интервью об успехе', vi: 'Phỏng vấn câu chuyện thành công' },
                    category: 'success'
                },
                {
                    id: 'm3KlPW-Hnvs',
                    title: { ko: '스마트팜 창업 과정', en: 'Smart Farm Startup Process', zh: '智慧农场创业过程', ja: 'スマートファーム創業過程', mn: 'Ухаалаг ферм бизнес эхлүүлэх', ru: 'Процесс создания умной фермы', vi: 'Quy trình khởi nghiệp trang trại thông minh' },
                    category: 'education'
                },
                {
                    id: 'xW8vL7M4pNk',
                    title: { ko: '귀촌 실패 피하는 법', en: 'How to Avoid Failure', zh: '如何避免返乡失败', ja: '帰村失敗を避ける方法', mn: 'Алдаанаас хэрхэн зайлсхийх', ru: 'Как избежать неудачи', vi: 'Cách tránh thất bại' },
                    category: 'education'
                }
            ];
            
            // 언어 전환
            const translations = {
                ko: { risk: '위험', detail: '상세 보기', elderly: '고령화', empty: '빈집률', support: '지원', billion: '억원', emptyHouse: '빈집', smartFarm: '스마트팜', house: '주택', tbd: '미정', sale: '매매', complex: '복합', education: '교육형', watchVideo: '영상 보기' },
                en: { risk: 'Risk', detail: 'Details', elderly: 'Elderly', empty: 'Empty', support: 'Support', billion: 'B KRW', emptyHouse: 'Empty House', smartFarm: 'Smart Farm', house: 'House', tbd: 'TBD', sale: 'Sale', complex: 'Complex', education: 'Education', watchVideo: 'Watch' },
                zh: { risk: '风险', detail: '详情', elderly: '老龄化', empty: '空房率', support: '支持', billion: '亿韩元', emptyHouse: '空房', smartFarm: '智慧农场', house: '住宅', tbd: '待定', sale: '买卖', complex: '综合', education: '教育型', watchVideo: '观看视频' },
                ja: { risk: 'リスク', detail: '詳細', elderly: '高齢化', empty: '空き家率', support: '支援', billion: '億ウォン', emptyHouse: '空き家', smartFarm: 'スマートファーム', house: '住宅', tbd: '未定', sale: '売買', complex: '複合', education: '教育型', watchVideo: '動画を見る' },
                mn: { risk: 'Эрсдэл', detail: 'Дэлгэрэнгүй', elderly: 'Өндөр нас', empty: 'Хоосон байшин', support: 'Дэмжлэг', billion: 'тэрбум вон', emptyHouse: 'Хоосон байшин', smartFarm: 'Ухаалаг ферм', house: 'Орон сууц', tbd: 'Тодорхойгүй', sale: 'Худалдаа', complex: 'Цогц', education: 'Боловсролын', watchVideo: 'Видео үзэх' },
                ru: { risk: 'Риск', detail: 'Подробнее', elderly: 'Старение', empty: 'Пустые дома', support: 'Поддержка', billion: 'млрд вон', emptyHouse: 'Пустой дом', smartFarm: 'Умная ферма', house: 'Дом', tbd: 'Уточняется', sale: 'Продажа', complex: 'Комплекс', education: 'Образование', watchVideo: 'Смотреть' },
                vi: { risk: 'Rủi ro', detail: 'Chi tiết', elderly: 'Già hóa', empty: 'Tỷ lệ nhà trống', support: 'Hỗ trợ', billion: 'tỷ won', emptyHouse: 'Nhà trống', smartFarm: 'Trang trại thông minh', house: 'Nhà ở', tbd: 'Chưa xác định', sale: 'Bán', complex: 'Phức hợp', education: 'Giáo dục', watchVideo: 'Xem video' }
            };

            function switchLanguage(lang) {
                currentLang = lang;
                document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('btn-' + lang).classList.add('active');
                
                document.querySelectorAll('[data-' + lang + ']').forEach(el => {
                    el.textContent = el.getAttribute('data-' + lang);
                });
                
                // 동적 콘텐츠 재렌더링
                updateRiskRegions();
                updateDataList('all');
                updateVideoList();
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
                    updateVideoList();
                } catch (error) {
                    console.error('Failed to load data:', error);
                }
            }
            
            function updateVideoList() {
                const container = document.getElementById('videoList');
                const t = translations[currentLang];
                
                // 필터링된 영상 리스트
                const filteredVideos = currentVideoFilter === 'all' 
                    ? youtubeVideos 
                    : youtubeVideos.filter(v => v.category === currentVideoFilter);
                
                if (filteredVideos.length === 0) {
                    container.innerHTML = '<div class="col-span-2 text-center py-8 text-gray-500 text-sm"><i class="fas fa-video-slash text-3xl mb-2"></i><p data-ko="해당 카테고리의 영상이 없습니다" data-en="No videos in this category" data-zh="该类别中没有视频" data-ja="このカテゴリの動画はありません" data-mn="Энэ ангилалд видео байхгүй" data-ru="Нет видео в этой категории" data-vi="Không có video trong danh mục này">해당 카테고리의 영상이 없습니다</p></div>';
                    return;
                }
                
                container.innerHTML = filteredVideos.map(video => {
                    const thumbnailUrl = video.isPlaylist 
                        ? \`https://i.ytimg.com/vi/\${video.id.replace('PLaiEbMM65nCOn0GK3pgRDMQjELhdpbAur', '4v33UFxxTxQ')}/hqdefault.jpg\`
                        : \`https://i.ytimg.com/vi/\${video.id}/hqdefault.jpg\`;
                    const videoUrl = video.isPlaylist
                        ? \`https://www.youtube.com/playlist?list=\${video.id}\`
                        : \`https://www.youtube.com/watch?v=\${video.id}\`;
                    
                    return \`
                        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                            <a href="\${videoUrl}" target="_blank" class="block">
                                <div class="relative">
                                    <img src="\${thumbnailUrl}" alt="\${video.title[currentLang]}" class="w-full h-24 object-cover">
                                    <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                        <i class="fas fa-play-circle text-white text-3xl"></i>
                                    </div>
                                    <span class="absolute top-1 right-1 px-1.5 py-0.5 bg-red-600 text-white text-xs rounded">
                                        <i class="fab fa-youtube mr-0.5"></i>YouTube
                                    </span>
                                </div>
                                <div class="p-2">
                                    <h4 class="text-xs font-semibold line-clamp-2 mb-1">\${video.title[currentLang]}</h4>
                                    <button class="w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">
                                        <i class="fas fa-play mr-1"></i>\${t.watchVideo}
                                    </button>
                                </div>
                            </a>
                        </div>
                    \`;
                }).join('');
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
                const t = translations[currentLang];
                
                container.innerHTML = highRiskRegions.map(region => \`
                    <div class="bg-white rounded-lg shadow-sm p-3">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="text-sm font-semibold">\${region.province} \${region.name}</h4>
                            <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">\${t.risk} \${region.population_risk_level}</span>
                        </div>
                        <div class="space-y-1 text-xs text-gray-600">
                            <p><i class="fas fa-user-clock mr-1 text-red-500"></i>\${t.elderly}: \${region.elderly_rate}%</p>
                            <p><i class="fas fa-home mr-1 text-blue-500"></i>\${t.empty}: \${region.empty_house_rate}%</p>
                            <p><i class="fas fa-won-sign mr-1 text-green-500"></i>\${t.support}: \${(region.support_budget / 10000).toFixed(0)}\${t.billion}</p>
                        </div>
                        <button class="mt-2 w-full px-2 py-1 bg-green-500 text-white rounded text-xs">
                            \${t.detail}
                        </button>
                    </div>
                \`).join('');
            }
            
            function updateDataList(type) {
                const container = document.getElementById('dataList');
                const t = translations[currentLang];
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
                                    <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">\${t.emptyHouse}</span>
                                    <h4 class="text-xs font-semibold mt-1">\${item.house_type || t.house}</h4>
                                    <p class="text-xs text-gray-600 truncate">\${item.address}</p>
                                    <div class="flex justify-between items-center mt-1">
                                        <span class="text-sm font-bold text-green-600">\${item.price ? (item.price / 100).toFixed(0) + t.billion : t.tbd}</span>
                                        <span class="text-xs text-gray-500">\${item.rental_type || t.sale}</span>
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
                                    <span class="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">\${t.smartFarm}</span>
                                    <h4 class="text-xs font-semibold mt-1">\${item.name}</h4>
                                    <p class="text-xs text-gray-600 truncate">\${item.address}</p>
                                    <div class="flex justify-between items-center mt-1">
                                        <span class="text-xs text-gray-700">\${item.crop_type || t.complex}</span>
                                        <span class="text-xs font-semibold text-green-600">\${item.farm_type || t.education}</span>
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
            
            function scrollToVideos() {
                const videoSection = document.getElementById('video-section');
                if (videoSection) {
                    videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // 스크롤 후 살짝 위로 이동 (헤더 가림 방지)
                    setTimeout(() => {
                        window.scrollBy(0, -60);
                    }, 300);
                }
            }
            
            let currentVideoFilter = 'all';
            
            function filterVideos(category) {
                currentVideoFilter = category;
                
                // 필터 버튼 스타일 업데이트
                ['all', 'policy', 'education', 'success'].forEach(cat => {
                    const btn = document.getElementById('filter-' + cat);
                    if (btn) {
                        if (cat === category) {
                            btn.className = 'px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold';
                        } else {
                            btn.className = 'px-3 py-1 bg-white text-gray-700 rounded-full text-xs';
                        }
                    }
                });
                
                updateVideoList();
            }
            
            function toggleMenu(menuId) {
                // 모든 메뉴 닫기
                const allMenus = ['emptyHouse', 'smartFarm', 'education', 'support'];
                allMenus.forEach(id => {
                    const menu = document.getElementById('menu-' + id);
                    if (menu && id !== menuId) {
                        menu.classList.add('hidden');
                    }
                });
                
                // 선택한 메뉴 토글
                const targetMenu = document.getElementById('menu-' + menuId);
                if (targetMenu) {
                    targetMenu.classList.toggle('hidden');
                }
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
