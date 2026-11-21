'use strict';
/* RIDE DNA — self-contained, exploratory preference model. No tracking, APIs, or server writes. */
const K=['city','touring','agility','comfort','versatility','expression','practicality','sportiness'];
const AXES={city:'도심 활용',touring:'여행 지향',agility:'가벼운 조작감',comfort:'편안함',versatility:'다양한 길',expression:'디자인·감성',practicality:'실용성',sportiness:'스포티함'};
const option=(label,w={},solo=0)=>({label,w,solo});
const QUESTIONS=[
  {c:'당신의 주말',t:'하루가 통째로 비었다면, 어디로 향할까요?',h:'바이크를 아직 타지 않아도 상상해서 선택해 주세요.',a:[option('동네와 도심을 가볍게 돌아본다',{city:3,practicality:2}),option('먼 곳의 풍경을 보러 떠난다',{touring:3,comfort:1}),option('굽이진 포장도로에서 조작의 재미를 느낀다',{agility:3,sportiness:2}),option('처음 가보는 낯선 길을 찾아본다',{versatility:3,touring:2})]},
  {c:'선택의 기준',t:'바이크를 고를 때 가장 먼저 확인할 것은?',h:'정답보다는 나에게 중요한 조건을 생각해 보세요.',a:[option('매일 타기 편한지',{city:2,practicality:3}),option('보기만 해도 마음이 가는 디자인인지',{expression:3}),option('몸에 맞고 오래 타도 편안한지',{comfort:3,touring:1}),option('내가 원하는 조작감을 내는지',{agility:2,sportiness:3})]},
  {c:'이동의 이유',t:'평소 이동할 일이 생기면 어떤 쪽이 더 끌리나요?',h:'상상 속에서 가장 현실적인 내 모습으로 답해 주세요.',a:[option('빠르고 간편하게 목적지에 도착하는 것',{city:3,practicality:3}),option('가는 길 자체를 즐기며 돌아가는 것',{touring:3,expression:1}),option('조작이 재미있는 길을 일부러 고르는 것',{agility:3,sportiness:2}),option('평소와 다른 길을 경험하는 것',{versatility:3,touring:1})]},
  {c:'우선순위',t:'두 조건이 충돌한다면 무엇을 우선할까요?',h:'모두 만족시킬 수 없다면 가장 포기하기 어려운 것.',a:[option('연료비·관리 부담을 줄이는 것',{practicality:3,city:1}),option('가볍고 즉각적인 반응',{agility:3,sportiness:1}),option('편안한 자세와 피로 감소',{comfort:3,touring:1}),option('마음에 드는 외형과 분위기',{expression:3})]},
  {c:'나의 페이스',t:'달리는 동안 가장 만족스러운 순간은?',h:'안전한 도로 주행을 전제로 생각해 주세요.',a:[option('일상에 자연스럽게 녹아드는 순간',{city:2,practicality:2}),option('좋은 풍경을 길게 바라보는 순간',{touring:3,comfort:1}),option('정확한 조작으로 코너를 부드럽게 지난 순간',{agility:3,sportiness:2}),option('전혀 새로운 장소를 발견한 순간',{versatility:3})]},
  {c:'함께하는 방식',t:'라이딩 약속을 잡는다면?',h:'실제 라이딩 경험이 없다면 여행이나 드라이브를 떠올려도 좋아요.',a:[option('혼자 조용히 나만의 속도로 움직인다',{touring:1,expression:1},2),option('소수의 친구와 적당히 맞춰 달린다',{comfort:1,practicality:1},-1),option('여럿이 목적지를 정하고 움직인다',{touring:2,versatility:1},-2),option('그날의 기분에 따라 혼자 또는 함께 간다',{city:1,versatility:1},0)]},
  {c:'바이크의 자세',t:'어떤 승차 자세가 더 끌리나요?',h:'실제 편안함은 개인의 신체 조건과 차종에 따라 달라요.',a:[option('일상에서 다루기 쉬운 자연스러운 자세',{city:2,practicality:2,comfort:1}),option('상체를 숙이고 조작에 집중하는 자세',{sportiness:3,agility:2}),option('상체를 세우고 시야가 탁 트인 자세',{touring:1,versatility:2,comfort:2}),option('여유롭게 앉아 풍경을 즐기는 자세',{comfort:3,expression:1})]},
  {c:'포기할 수 없는 것',t:'네 가지 중 하나를 꼭 챙긴다면?',h:'모든 것을 갖춘 바이크는 드물어요.',a:[option('적은 관리 부담',{practicality:3,city:1}),option('긴 주행에도 덜 피곤한 환경',{comfort:3,touring:2}),option('시선을 끄는 디자인',{expression:3,sportiness:1}),option('차체와 가까워지는 선명한 조작감',{agility:3,sportiness:2})]},
  {c:'장소의 선택',t:'다음 중 더 가고 싶은 장소는?',h:'실제 도로 주행이 허용된 장소만 상정해 주세요.',a:[option('도심의 작은 카페와 골목',{city:3,expression:1}),option('바닷가를 따라 길게 이어지는 도로',{touring:3,comfort:1}),option('포장 상태가 좋은 굽잇길',{agility:3,sportiness:2}),option('산길과 지방도, 변화가 많은 풍경',{versatility:3,touring:1})]},
  {c:'나의 일상',t:'바이크를 소유한다면 가장 자주 쓰는 용도는?',h:'현재 사용 방식이 아닌 미래의 희망 용도로 답해도 좋아요.',a:[option('출퇴근과 가벼운 이동',{city:3,practicality:3}),option('주말 중·장거리 여행',{touring:3,comfort:2}),option('주말의 짧고 몰입감 있는 라이딩',{sportiness:3,agility:2}),option('정해두지 않고 여러 곳을 다니기',{versatility:2,expression:1,touring:1})]},
  {c:'내 취향',t:'바이크가 나를 표현한다면 어떤 느낌일까요?',h:'디자인을 잘 몰라도 느낌만으로 충분해요.',a:[option('수수하지만 일상에서 든든한 존재',{practicality:3,city:1}),option('정제되고 날렵한 존재',{sportiness:2,agility:1,expression:2}),option('시간이 지나도 멋있는 존재',{expression:3,comfort:1}),option('어디든 데려다줄 것 같은 존재',{versatility:2,touring:2})]},
  {c:'기대하는 경험',t:'모처럼 일정이 길게 비었습니다. 무엇을 하고 싶나요?',h:'당일치기부터 며칠의 여행까지 자유롭게 떠올려 보세요.',a:[option('도시 안에서 느긋하게 시간을 보낸다',{city:2,comfort:2}),option('목적지를 여러 개 정해 장거리 여행을 간다',{touring:3,comfort:2}),option('새로운 도로를 익히고 조작 실력을 다듬는다',{agility:3,sportiness:2}),option('지도에서 본 적 없는 작은 길을 찾아본다',{versatility:3,touring:1})]},
  {c:'함께하는 방식',t:'처음 가는 장소에 가는 방법은?',h:'혼자와 함께 중 어느 쪽이 편한지 생각해 보세요.',a:[option('혼자 계획하고 혼자 출발한다',{touring:1,practicality:1},2),option('친한 친구 한 명과 함께 간다',{comfort:1,touring:1},-1),option('친구들과 일정을 맞춰 함께 간다',{touring:2,versatility:1},-2),option('상황에 따라 유연하게 결정한다',{city:1,versatility:1},0)]},
  {c:'실제 조건',t:'무엇이 불편하면 가장 먼저 바꾸고 싶나요?',h:'가장 신경 쓰일 것 같은 한 가지를 고르세요.',a:[option('주차와 일상 관리가 번거로운 것',{city:2,practicality:3}),option('무거운 차체가 다루기 힘든 것',{agility:3,practicality:1}),option('바람과 피로 때문에 오래 타기 힘든 것',{comfort:3,touring:2}),option('다양한 도로 환경에 제약이 많은 것',{versatility:3})]},
  {c:'마음에 남는 순간',t:'친구에게 라이딩 이야기를 한다면?',h:'가장 먼저 꺼내고 싶은 이야기를 고르세요.',a:[option('예상보다 편리했던 일상 경험',{city:2,practicality:2},-1),option('오래 달려 만난 풍경',{touring:3,comfort:1},1),option('차체와 움직임이 잘 맞아떨어진 순간',{agility:2,sportiness:3},1),option('남들이 잘 모르는 길을 발견한 이야기',{versatility:3,expression:1},1)]},
  {c:'나에게 필요한 것',t:'소유 만족도를 가장 높일 요소는?',h:'구매 후에 더 오래 중요할 것 같은 항목.',a:[option('낮은 유지 부담과 편의 기능',{practicality:3,city:2}),option('오래 달릴 때의 안락함',{touring:2,comfort:3}),option('기민한 움직임과 조작 반응',{agility:3,sportiness:2}),option('취향에 꼭 맞는 디자인과 감성',{expression:3})]},
  {c:'도로 위의 하루',t:'같은 거리를 달리더라도 어떤 선택을 할까요?',h:'실제 도로 상황과 교통법규를 준수한다는 전제예요.',a:[option('편하고 효율적인 경로',{city:2,practicality:3}),option('휴식 지점이 충분한 경로',{comfort:3,touring:1}),option('포장 상태가 좋고 구성이 흥미로운 경로',{agility:2,sportiness:2}),option('새로운 풍경을 볼 수 있는 경로',{versatility:3,touring:1})]},
  {c:'함께하는 방식',t:'낯선 라이더와 마주친다면?',h:'실제로 어떻게 행동할 것 같은지 떠올려 보세요.',a:[option('내 일정대로 계속 움직인다',{practicality:1,city:1},2),option('짧게 인사만 나눈다',{city:1,expression:1},1),option('가볍게 이야기를 나눠본다',{expression:1,touring:1},-1),option('함께 갈 만한 코스를 공유한다',{versatility:1,touring:2},-2)]},
  {c:'가장 큰 매력',t:'모터사이클을 떠올리면 무엇이 먼저 생각나나요?',h:'이미지가 아니라 자신이 원하는 경험을 선택해 보세요.',a:[option('생활 속 이동의 자유',{city:3,practicality:2}),option('먼 거리를 여행하는 감각',{touring:3,comfort:1}),option('섬세한 조작과 집중',{agility:3,sportiness:3}),option('나만의 취향과 개성을 드러내는 물건',{expression:3,versatility:1})]},
  {c:'마지막 선택',t:'한 가지를 가장 중요하게 생각한다면?',h:'테스트를 마무리하는 마지막 질문이에요.',a:[option('소유하고 타기 쉬운 균형',{city:2,practicality:3}),option('길게 달려도 편안한 경험',{comfort:3,touring:2}),option('섬세하고 즐거운 조작감',{agility:3,sportiness:2}),option('새로움과 나만의 개성',{versatility:2,expression:2})]}
];
const GENRES=[
  {id:'naked',name:'네이키드',desc:'일상과 주말 라이딩을 넘나드는 균형형',p:[76,40,84,52,25,62,67,72],models:['Yamaha MT-07','Honda CB650R']},
  {id:'sport',name:'스포츠',desc:'조작감과 스포티한 주행 자세에 관심이 큰 스타일',p:[36,22,98,23,14,69,26,100],models:['Honda CBR650R','Kawasaki Ninja 500']},
  {id:'cruiser',name:'크루저',desc:'여유로운 자세와 뚜렷한 디자인 감성을 중시',p:[45,55,24,85,20,93,42,24],models:['Honda Rebel 500','Kawasaki Vulcan S']},
  {id:'touring',name:'투어러',desc:'긴 거리와 편안한 이동 환경을 우선하는 스타일',p:[20,100,34,100,42,40,50,40],models:['Yamaha Tracer 9','Kawasaki Ninja 1000SX']},
  {id:'adventure',name:'어드벤처',desc:'여행과 다양한 도로 환경을 폭넓게 즐기는 스타일',p:[31,92,48,78,100,51,43,43],models:['Honda NX500','Suzuki V-Strom 650']},
  {id:'dual',name:'듀얼퍼포즈·모타드',desc:'민첩한 차체와 여러 길에 대한 호기심이 큰 스타일',p:[58,38,95,24,93,59,43,78],models:['Honda CRF300L','Suzuki DR-Z4SM']},
  {id:'retro',name:'클래식·레트로',desc:'바이크의 오래가는 외관과 기계적 분위기를 중시',p:[55,42,38,62,22,100,48,32],models:['Triumph Bonneville T100','Royal Enfield Classic 350']},
  {id:'scooter',name:'스쿠터',desc:'편리한 일상 이동과 실용성을 중시하는 스타일',p:[100,22,31,82,12,30,100,18],models:['Honda PCX','Yamaha NMAX']}
].map(g=>({...g,profile:Object.fromEntries(K.map((k,i)=>[k,g.p[i]]))}));
const TYPES=[
  ['일상을 잇는 동행자','THE EVERYDAY COMPANION','서두르지 않는 일상의 리듬을 좋아하고, 함께하는 시간을 편안하게 여기는 유형이에요.'],
  ['도시의 실속파','THE CITY MINIMALIST','가벼운 이동과 자신의 페이스가 가장 중요해요. 꼭 필요한 요소에 집중하는 유형이에요.'],
  ['감각적인 동행자','THE SOCIAL AESTHETE','작은 이동에도 취향을 담고, 좋아하는 사람들과 시간을 나누는 유형이에요.'],
  ['자유로운 도시인','THE URBAN INDIVIDUAL','도시에서의 자유와 분명한 취향을 중요하게 여겨요. 남들의 기준보다 나다운 선택을 해요.'],
  ['활기찬 일상파','THE DAILY SPARK','익숙한 길에서도 조작의 재미를 찾으며, 주변 사람들과 활력을 나누는 유형이에요.'],
  ['혼자 즐기는 조작파','THE SOLO HANDLER','짧은 시간이라도 핸들에 집중하고 싶어요. 가볍고 민첩한 움직임을 아끼는 유형이에요.'],
  ['도시의 스피릿','THE STREET SPIRIT','스포티한 감각과 확실한 외형 취향을 함께 중시해요. 함께할 때도 개성을 잃지 않아요.'],
  ['나만의 스트리트','THE STREET NOMAD','복잡한 설명보다 내가 느끼는 조작과 스타일을 믿어요. 혼자만의 리듬이 선명한 유형이에요.'],
  ['계획적인 여행 파트너','THE ROUTE KEEPER','낯선 곳을 향하되 편안한 계획과 동행의 균형을 아는 유형이에요.'],
  ['조용한 먼 길의 사람','THE DISTANT ROUTE','혼자 이어지는 긴 길과 새로운 풍경에서 생각을 정리하는 유형이에요.'],
  ['풍경을 수집하는 사람','THE SCENE COLLECTOR','새로운 풍경을 만나고 자신만의 감성을 담아 사람들과 공유하는 유형이에요.'],
  ['낯선 길의 관찰자','THE QUIET EXPLORER','새로운 장소를 즐기되 누구보다 자신의 시선과 페이스를 소중히 여기는 유형이에요.'],
  ['함께 달리는 개척자','THE ROAD SEEKER','새로운 길을 향한 호기심과 조작의 즐거움을 친구들과 나누는 유형이에요.'],
  ['홀로 달리는 개척자','THE SOLO EXPLORER','새로운 길에서 차체의 반응을 즐기며, 스스로 선택한 방향을 따라가는 유형이에요.'],
  ['자유로운 질주자','THE NIGHT SPRINTER','새로운 길, 스포티한 감각, 자신만의 분위기를 모두 즐겨요. 함께 달리는 순간에도 취향이 선명해요.'],
  ['경계를 넘는 라이더','THE LIMITLESS RIDER','정해진 코스보다 자신의 호기심을 믿고, 움직임과 스타일 모두에 분명한 기준을 가진 유형이에요.']
];
const ADAPTIVE_AXES={
  city:['짧은 도시 이동을 편하게 즐기고 싶다','주로 도심 밖에서 여가로 달리고 싶다'],
  touring:['하루를 길게 써서 멀리 가고 싶다','자주 짧게 타는 쪽이 더 좋다'],
  agility:['차체의 가벼운 반응이 특히 중요하다','조작감보다 안정적인 편안함이 좋다'],
  comfort:['오래 타도 덜 피곤한 구성이 좋다','편안함은 다른 장점을 위해 양보할 수 있다'],
  versatility:['여러 도로 환경을 경험하고 싶다','주로 익숙한 포장도로에서 탈 것 같다'],
  expression:['디자인과 분위기를 크게 중시한다','디자인보다 기능이 먼저다'],
  practicality:['유지·관리의 편리함이 우선이다','관리 부담이 있어도 취향이 더 중요하다'],
  sportiness:['스포티한 포지션과 조작감이 끌린다','여유로운 자세와 움직임이 더 끌린다']
};
const MBTI_QUESTIONS=[
  {a:'EI',t:'사람들과 시간을 보낸 뒤 에너지가 생기는 편이다.',r:false},
  {a:'SN',t:'새로운 일을 시작할 때 구체적인 사실부터 살펴보는 편이다.',r:true},
  {a:'TF',t:'의견이 갈리면 먼저 논리적인 근거를 확인하는 편이다.',r:false},
  {a:'JP',t:'일정을 미리 정하고 진행하는 편이다.',r:false},
  {a:'EI',t:'혼자 조용히 보내는 시간이 있어야 재충전된다.',r:true},
  {a:'SN',t:'당장 보이는 사실보다 앞으로의 가능성을 먼저 상상한다.',r:false},
  {a:'TF',t:'중요한 결정에서 상대의 감정을 먼저 살피는 편이다.',r:true},
  {a:'JP',t:'계획이 바뀌어도 즉흥적으로 움직이는 편이 더 편하다.',r:true},
  {a:'EI',t:'새로운 모임에서 먼저 대화를 시작하는 편이다.',r:false},
  {a:'SN',t:'설명보다 전체적인 의미나 패턴을 먼저 파악하는 편이다.',r:false},
  {a:'TF',t:'쉽지 않은 선택이라도 일관된 기준을 지키려 한다.',r:false},
  {a:'JP',t:'일을 마무리할 때 정해진 순서가 있는 편이 좋다.',r:false}
];
/* v1.3.0 — Shared 16-item core; deep adds 24 items. MBTI-like questions are separate. */
const CORE=QUESTIONS.slice(0,16);
const DEEP=[
 {c:'주행 경험',t:'오랜 시간 바이크를 탄 날, 가장 만족스러운 것은?',h:'경험이 없다면 장시간 이동을 상상해 주세요.',a:[option('피로가 적어 다음 날에도 부담이 없는 것',{comfort:3,touring:2}),option('다양한 장소를 둘러볼 수 있었던 것',{versatility:3,touring:2}),option('차체를 다루는 재미가 오래 남은 것',{agility:3,sportiness:2}),option('비용과 시간을 효율적으로 쓴 것',{practicality:3,city:2})]},
 {c:'바이크의 성격',t:'기계적인 특성 중 가장 마음이 가는 것은?',h:'성능 수치가 아닌 느낌을 기준으로 고르세요.',a:[option('가벼운 핸들링과 즉각적인 조작',{agility:3,sportiness:1}),option('안정적이고 편안한 움직임',{comfort:3,touring:1}),option('어느 길에서도 대응하는 범용성',{versatility:3}),option('단순하고 편리한 관리',{practicality:3,city:1})]},
 {c:'선택의 타협',t:'바이크 한 대로 모든 것을 해야 한다면?',h:'단 하나만 보장받는다고 생각해 보세요.',a:[option('출퇴근에서 가장 편한 구성',{city:3,practicality:2}),option('멀리 갈 때 가장 편한 구성',{touring:3,comfort:2}),option('주말에 가장 몰입되는 조작감',{agility:2,sportiness:3}),option('도로 환경이 달라도 쓸 수 있는 구성',{versatility:3,practicality:1})]},
 {c:'소유 후 일상',t:'바이크를 세워두는 시간이 길어진다면 무엇이 아쉬울까요?',h:'실제로 가장 하고 싶었던 것을 떠올려 주세요.',a:[option('짧은 이동에도 자주 타지 못하는 것',{city:3,practicality:2}),option('장거리 계획을 떠나지 못하는 것',{touring:3}),option('차체의 움직임을 즐기지 못하는 것',{agility:3,sportiness:2}),option('취향이 드러나는 물건을 가까이 두지 못하는 것',{expression:3})]},
 {c:'탑승 환경',t:'예상보다 바람이 강한 날, 더 신경 쓰이는 것은?',h:'안전이 확보된 정상적인 주행 조건을 가정합니다.',a:[option('노출과 피로가 커지는 것',{comfort:3,touring:2}),option('작은 차체 움직임에 예민해지는 것',{agility:2,sportiness:2}),option('다른 이동수단으로 바꿔야 할 수도 있는 것',{practicality:3,city:2}),option('계획한 경로를 바꿔야 하는 것',{touring:2,versatility:2})]},
 {c:'주말 일정',t:'당일 라이딩 코스가 마음에 들지 않는다면?',h:'교통법규를 준수할 수 있는 선택지만 생각해 주세요.',a:[option('길고 편안한 경로를 다시 찾는다',{touring:3,comfort:2}),option('조작이 재미있는 포장길을 찾는다',{agility:3,sportiness:2}),option('색다른 경로와 풍경을 찾는다',{versatility:3}),option('시간을 아끼고 가까운 곳을 찾는다',{city:3,practicality:2})]},
 {c:'감성의 기준',t:'오래도록 갖고 싶은 바이크의 조건은?',h:'유행이 바뀌어도 남을 가치를 생각해 보세요.',a:[option('유지하기 쉽고 쓰임이 많은 것',{practicality:3,city:1}),option('보면 볼수록 좋은 외형',{expression:3}),option('오래 타도 편안한 구성',{comfort:3,touring:1}),option('움직일 때 살아나는 조작감',{agility:2,sportiness:3})]},
 {c:'휴식의 방식',t:'라이딩 중 쉬는 시간이 생기면 가장 하고 싶은 일은?',h:'정답은 없어요. 평소 마음에 드는 휴식에 가까운 것.',a:[option('조용히 풍경을 바라본다',{touring:2,comfort:2},1),option('다음에 가볼 길을 살펴본다',{versatility:3,touring:1}),option('차체와 장비를 살펴본다',{sportiness:2,agility:2}),option('근처에서 볼일을 마친다',{city:2,practicality:3})]},
 {c:'실제 쓰임',t:'주중에도 바이크를 자주 탈 예정이라면?',h:'어떤 조건이 가장 오래 도움이 될까요?',a:[option('주차와 이동이 편한 구성',{city:3,practicality:3}),option('피로를 줄이는 안정적인 자세',{comfort:3}),option('계속 타고 싶어지는 조작감',{agility:3,sportiness:1}),option('내가 좋아하는 외형을 매일 볼 수 있는 것',{expression:3})]},
 {c:'동승과 짐',t:'예상보다 짐이 많아질 때 무엇을 선택하나요?',h:'구매 전 고민이라고 가정하세요.',a:[option('적재가 쉬운 구조를 우선한다',{touring:2,practicality:3}),option('짐이 적어야 더 즐겁다',{agility:3,sportiness:2}),option('어떤 환경에서도 활용도를 확보한다',{versatility:3}),option('짐보다는 외관과 개성을 유지한다',{expression:3})]},
 {c:'실용적인 타협',t:'다음 중 가장 받아들이기 어려운 것은?',h:'마음에 드는 바이크라도 완벽하지는 않아요.',a:[option('매일 이동하기 번거롭다',{city:3,practicality:2}),option('장거리에서 피로가 심하다',{comfort:3,touring:2}),option('차체 반응이 둔하게 느껴진다',{agility:3,sportiness:1}),option('외형에 오래 애착이 가지 않는다',{expression:3})]},
 {c:'길의 조건',t:'탐험하고 싶은 길의 모습은?',h:'실제로 주행이 허용되는 길만 가정해 주세요.',a:[option('새로운 도시의 골목과 도로',{city:3,versatility:1}),option('여러 지역을 잇는 긴 포장도로',{touring:3,comfort:1}),option('굴곡과 코너가 이어지는 포장도로',{agility:3,sportiness:2}),option('포장 상태가 변화하는 합법적인 탐방로',{versatility:3})]},
 {c:'가치 비교',t:'같은 예산에서 한 가지를 더 얻을 수 있다면?',h:'모든 조건이 충분히 안전하다는 전제입니다.',a:[option('유지 부담을 줄이는 기능',{practicality:3,city:2}),option('편안함을 높이는 장비',{comfort:3,touring:2}),option('차체 조작감을 개선하는 요소',{agility:3,sportiness:2}),option('취향에 더 맞는 디자인',{expression:3})]},
 {c:'여행의 방식',t:'처음으로 2박 3일 라이딩을 떠난다면?',h:'현재 경험이 없어도 떠올려 보세요.',a:[option('최소한의 짐으로 가볍게 움직인다',{agility:2,practicality:2}),option('충분히 준비해 편하게 달린다',{touring:3,comfort:3}),option('목적지보다 다양한 길을 선택한다',{versatility:3,touring:1}),option('사진과 풍경이 잘 어울리는 코스를 찾는다',{expression:2,touring:2})]},
 {c:'조작감의 의미',t:'코너가 이어지는 구간에서 선호하는 느낌은?',h:'안전한 속도와 합법적인 도로 주행을 전제로 합니다.',a:[option('부드럽고 안정적인 반응',{comfort:3,agility:1}),option('가볍고 빠르게 반응하는 차체',{agility:3,sportiness:3}),option('노면이 달라도 무리 없는 대응',{versatility:3}),option('차분한 페이스로 풍경까지 즐기는 느낌',{touring:2,comfort:2})]},
 {c:'장기 보유',t:'몇 년 뒤에도 만족하려면 가장 중요한 것은?',h:'처음의 설렘이 잦아든 다음을 생각하세요.',a:[option('지속 가능한 유지·관리',{practicality:3}),option('오래 보아도 좋아할 디자인',{expression:3}),option('꾸준히 즐길 수 있는 조작감',{agility:2,sportiness:3}),option('여행에서의 편안함',{touring:2,comfort:3})]},
 {c:'상황 선택',t:'잠깐 시간이 생겼을 때 어디로 나갈까요?',h:'특별한 계획이 없다는 전제예요.',a:[option('집 근처의 익숙한 길',{city:3,practicality:2}),option('가까운 전망 좋은 장소',{touring:2,comfort:2}),option('주행감이 좋은 포장도로',{agility:2,sportiness:3}),option('가본 적 없는 다른 길',{versatility:3})]},
 {c:'환경 변화',t:'도로 환경이 예상과 달라졌다면?',h:'위험을 피하고 안전하게 우회하는 상황입니다.',a:[option('편하고 검증된 경로를 선택한다',{comfort:2,practicality:3}),option('여행 전체의 흐름을 유지한다',{touring:3}),option('합법적인 새로운 경로를 찾아본다',{versatility:3}),option('운동성이 좋은 포장길을 다시 고른다',{agility:2,sportiness:3})]},
 {c:'주행 목적',t:'가장 마음에 드는 일주일의 바이크 사용 패턴은?',h:'실제 일상과 상상 속 이상을 함께 고려하세요.',a:[option('평일에 자주 짧게 타기',{city:3,practicality:3}),option('주말마다 멀리 떠나기',{touring:3,comfort:2}),option('짧아도 집중해서 즐기기',{agility:3,sportiness:2}),option('그때그때 다른 경로 시도하기',{versatility:3,expression:1})]},
 {c:'포기할 조건',t:'둘 중 꼭 하나를 양보해야 한다면?',h:'더 중요하게 지키고 싶은 것을 골라 주세요.',a:[option('편안함보다 조작감을 지킨다',{agility:3,sportiness:2}),option('조작감보다 편안함을 지킨다',{comfort:3,touring:2}),option('어느 쪽보다 관리 편의성을 지킨다',{practicality:3,city:2}),option('어느 쪽보다 디자인을 지킨다',{expression:3})]},
 {c:'디자인과 성능',t:'외관과 주행 성격이 엇갈리면?',h:'내가 후회하지 않을 선택을 떠올려 보세요.',a:[option('주행 특성이 맞으면 외관은 타협한다',{sportiness:2,agility:2}),option('외관이 좋으면 일부 특성은 타협한다',{expression:3}),option('생활 속 편리함을 최우선으로 둔다',{practicality:3,city:2}),option('오래 타는 편안함을 우선한다',{comfort:3,touring:2})]},
 {c:'기술과 감성',t:'새로운 모델을 볼 때 가장 먼저 찾아볼 정보는?',h:'관심이 가는 항목 하나만 고르세요.',a:[option('연비·정비·실용 기능',{practicality:3,city:2}),option('시트와 방풍 등 편의 요소',{comfort:3,touring:2}),option('차체 무게·핸들링 특성',{agility:3,sportiness:2}),option('디자인·소재·시각적 특징',{expression:3})]},
 {c:'한 번의 선택',t:'좋아하는 모델이 모두 같은 가격이라면?',h:'오직 소유 경험을 기준으로 판단해 주세요.',a:[option('생활에 가장 자주 쓰일 바이크',{city:3,practicality:3}),option('먼 곳까지 편하게 갈 바이크',{touring:3,comfort:2}),option('짧게 타도 몰입되는 바이크',{sportiness:3,agility:3}),option('다양한 길에 도전할 수 있는 바이크',{versatility:3,expression:1})]},
 {c:'최종 우선순위',t:'바이크를 통해 가장 오래 얻고 싶은 가치는?',h:'이제 마지막 질문이에요.',a:[option('언제든 편하게 이동할 자유',{city:2,practicality:3}),option('먼 길과 여행의 경험',{touring:3,comfort:2}),option('차체를 다루는 즐거움',{agility:3,sportiness:3}),option('낯선 길과 나다운 경험',{versatility:3,expression:2})]}
];
const DEEP_MBTI_EXTRA=[
 {a:'EI',t:'새로운 사람을 만나면 대화 속에서 생각이 더 잘 정리된다.',r:false},
 {a:'SN',t:'일을 이해할 때 구체적인 사례가 있어야 마음이 놓인다.',r:true},
 {a:'TF',t:'판단할 때 사람들의 관계를 보호하는 것이 중요하다.',r:true},
 {a:'JP',t:'마감이 정해져 있으면 미리 준비하는 편이다.',r:false},
 {a:'EI',t:'혼자 생각을 정리한 뒤 의견을 말하는 편이다.',r:true},
 {a:'SN',t:'새로운 아이디어의 가능성을 떠올리는 편이 즐겁다.',r:false},
 {a:'TF',t:'결정의 일관성과 논리적 기준을 중요하게 여긴다.',r:false},
 {a:'JP',t:'결정할 수 있어도 여러 가능성을 열어두고 싶다.',r:true},
 {a:'EI',t:'긴 시간 사람들과 어울린 뒤에는 혼자 쉬고 싶다.',r:true},
 {a:'SN',t:'새로운 지식을 배울 때 실제 활용 사례부터 확인한다.',r:true},
 {a:'TF',t:'말이 맞더라도 상대의 감정을 고려해 표현을 바꾼다.',r:true},
 {a:'JP',t:'미리 정해둔 계획을 완료하면 마음이 편해진다.',r:false}
];
// Same first 8 items for both modes, so an upgrade only asks unanswered items.
const PERSONALITY_ITEMS=[...MBTI_QUESTIONS.slice(0,8),...MBTI_QUESTIONS.slice(8),...DEEP_MBTI_EXTRA.slice(0,8)];
const MODE_CONFIG={quick:{label:'빠른 유형 찾기',length:16,mbti:8},deep:{label:'진지한 유형 찾기',length:40,mbti:20}};
const STORE='ridedna-v1.3.0';
function blankState(){return {screen:'home',mode:null,answers:Array(40).fill(null),index:0,adaptive:[],adaptAnswers:[],adaptIndex:0,completed:false,personality:Array(20).fill(null),personalityIndex:0,estimated:null,estimateLength:0,mbtiManual:null,manualDraft:[null,null,null,null],shared:false,sharedData:null,experience:'unspecified'};}
let state=blankState();
const $=id=>document.getElementById(id);
const screens=Object.fromEntries(['home','choose','quiz','result','mbti','manual'].map(x=>[x,$(x+'-screen')]));
let locked=false, timer=null, toastTimer=null;
function qs(){return state.mode==='deep'?[...CORE,...DEEP]:CORE;}
function answerTotal(){return MODE_CONFIG[state.mode]?.length||16;}
function mbtiTotal(){return MODE_CONFIG[state.mode]?.mbti||8;}
function isUnfinished(){return Boolean(state.mode&&!state.completed&&state.answers.slice(0,answerTotal()).some(v=>v!==null));}
function persist(){if(state.shared)return;try{localStorage.setItem(STORE,JSON.stringify({...state,screen:['manual','mbti'].includes(state.screen)?'result':state.screen,shared:false,sharedData:null}));}catch{}}
function restore(){try{const d=JSON.parse(localStorage.getItem(STORE)||'null');if(!d||!['quick','deep',null].includes(d.mode)||!Array.isArray(d.answers)||d.answers.length!==40||!d.answers.every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<4)))return;
 const x=blankState();Object.assign(x,d);x.answers=d.answers; x.shared=false;x.sharedData=null;
 if(!Array.isArray(x.personality)||x.personality.length!==20||!x.personality.every(v=>v===null||(Number.isInteger(v)&&v>=-2&&v<=2)))x.personality=Array(20).fill(null);
 if(!Array.isArray(x.adaptive))x.adaptive=[];if(!Array.isArray(x.adaptAnswers))x.adaptAnswers=[];
 x.index=Math.min(Math.max(Number.isInteger(x.index)?x.index:0,0),x.mode==='deep'?40:15);
 x.personalityIndex=Math.max(0,Math.min(19,Number.isInteger(x.personalityIndex)?x.personalityIndex:0));
 if(!screens[x.screen]||x.screen==='manual'||x.screen==='mbti')x.screen='home';
 if(x.screen==='result'&&!x.completed)x.screen='home';if(x.screen==='quiz'&&x.completed)x.screen='result';state=x;
 }catch{}}
function answerTotalFor(mode){return MODE_CONFIG[mode]?.length||16;}
function toast(message){const el=$('toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3200);}
function urlState(){return {rideDna:true,screen:state.screen,mode:state.mode,index:state.index,adaptIndex:state.adaptIndex,personalityIndex:state.personalityIndex};}
function show(name,{nav='push',focus=true}={}){
 if(!screens[name])name='home';clearTimeout(timer);locked=false;state.screen=name;
 document.body.dataset.view=name;for(const [key,s] of Object.entries(screens))s.hidden=key!==name;
 $('hero-reset').hidden=!isUnfinished();$('hero-cta-label').textContent='내 라이더 유형 찾기';
 if(name==='choose')renderChoose();if(name==='quiz')renderQuiz();if(name==='result')renderResult();if(name==='mbti')renderMbti();if(name==='manual')renderManual();
 window.scrollTo({top:0,behavior:'instant'});persist();
 if(nav!=='silent'){const route=urlState();if(nav==='replace')history.replaceState(route,'');else if(!history.state?.rideDna||Object.entries(route).some(([k,v])=>history.state?.[k]!==v))history.pushState(route,'');}
 if(focus){let target=screens[name].querySelector('[data-autofocus]');if(target)requestAnimationFrame(()=>target.focus({preventScroll:true}));}
}
function renderChoose(){
 const resume=$('continue-box');resume.hidden=!isUnfinished();if(!resume.hidden)$('resume-description').textContent=`${MODE_CONFIG[state.mode].label} · ${state.index+1}번 질문부터 이어하기`;
}
function newTest(mode){state=blankState();state.mode=mode;history.replaceState({rideDna:true,screen:'choose',mode:null,index:0},'',location.pathname);show('quiz');}
function chooseMode(mode){if(isUnfinished()&&state.mode===mode){show('quiz');return;}if(state.completed&&state.mode===mode){newTest(mode);return;}newTest(mode);}
function upgrade(){if(state.shared)return;const old=state.answers.slice(0,16);const manual=state.mbtiManual;const personality=state.personality.slice();const estimate=state.estimated;const estimateLength=state.estimateLength;
 state=blankState();state.mode='deep';state.index=16;state.answers.splice(0,16,...old);state.personality=personality;state.estimated=estimate;state.estimateLength=estimateLength;state.mbtiManual=manual;show('quiz');}
function quit(){if($('exit-dialog').showModal)$('exit-dialog').showModal();else if(confirm('나가도 답변은 이 기기에 보관됩니다. 나갈까요?'))show('home');}
function renderQuiz(){
 const deep=state.mode==='deep',extra=deep&&state.index>=40,q=extra?state.adaptive[state.adaptIndex]:qs()[state.index];
 if(!q){finish();return;}
 const total=answerTotal(),step=extra?40+state.adaptIndex+1:state.index+1,max=extra?40+state.adaptive.length:total;
 const chapter=deep&&!extra?` · ${Math.floor(state.index/10)+1}/4 구간`:'';
 $('quiz-stage').textContent=(extra?'추가 취향 확인':MODE_CONFIG[state.mode].label)+chapter;
 $('quiz-progress-label').textContent=String(step).padStart(2,'0')+' / '+max;
 const pct=Math.round((step-1)/Math.max(1,max)*100);$('quiz-progress-fill').style.width=pct+'%';$('quiz-progress').setAttribute('aria-valuenow',String(pct));
 $('question-category').textContent=extra?'두 취향이 비슷하게 나타나요':q.c;
 $('question-title').textContent=extra?'둘 중 어느 쪽이 조금 더 중요한가요?':q.t;
 $('question-hint').textContent=extra?'어느 쪽도 아니라면 비슷하다고 선택해 주세요.':q.h;
 const labels=extra?[q.options[0],q.options[1],'둘 다 비슷하다']:q.a.map(x=>x.label),selected=extra?state.adaptAnswers[state.adaptIndex]:state.answers[state.index];
 const wrap=$('answers');wrap.replaceChildren();labels.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.className='answer';b.textContent=label;b.classList.toggle('chosen',i===selected);b.setAttribute('aria-pressed',String(i===selected));b.addEventListener('click',()=>choose(i));wrap.append(b);});
 $('quiz-prev').disabled=!extra&&state.index===0;
 $('quiz-helper').textContent=extra?'결과가 가까운 스타일을 조금 더 구분합니다.':'선택하면 다음 질문으로 이동합니다.';
}
function choose(i){if(locked||state.screen!=='quiz')return;const count=state.index>=40?3:qs()[state.index]?.a.length;if(!(i>=0&&i<count))return;locked=true;
 [...$('answers').children].forEach((b,n)=>{b.classList.toggle('chosen',n===i);b.setAttribute('aria-pressed',String(n===i));});timer=setTimeout(()=>commit(i),260);
}
function commit(i){const total=answerTotal();if(state.index<total){state.answers[state.index]=i;if(state.index<total-1){state.index++;show('quiz',{focus:false});return;}if(state.mode==='deep'){initAdaptive();return;}finish();return;}
 state.adaptAnswers[state.adaptIndex]=i;if(state.adaptIndex<state.adaptive.length-1){state.adaptIndex++;show('quiz',{focus:false});return;}
 if(state.adaptive.length===4){const calc=calculate();if(calc.genres[0].score-calc.genres[1].score<=4){const a=buildAdaptive(calc,4);if(a.length){state.adaptive.push(...a);state.adaptIndex++;show('quiz',{focus:false});return;}}}finish();}
function prev(){clearTimeout(timer);locked=false;if(state.index>=40){if(state.adaptIndex>0)state.adaptIndex--;else state.index=39;}else if(state.index>0)state.index--;show('quiz');}
function initAdaptive(){const data=calculate();state.adaptive=[];state.adaptAnswers=[];state.adaptIndex=0;if(data.genres[0].score-data.genres[1].score<=7){state.adaptive=buildAdaptive(data,4);if(state.adaptive.length){state.index=40;show('quiz',{focus:false});return;}}finish();}
function buildAdaptive(calc,count){const a=calc.genres[0].genre,b=calc.genres[1].genre;const used=new Set(state.adaptive.map(x=>x.axis));return K.map(axis=>({axis,gap:Math.abs(a.profile[axis]-b.profile[axis])})).filter(x=>x.gap>=15&&!used.has(x.axis)).sort((x,y)=>y.gap-x.gap).slice(0,count).map(x=>({axis:x.axis,options:ADAPTIVE_AXES[x.axis]}));}
function axesFrom(){const selected=Object.fromEntries(K.map(k=>[k,0]));const capacity=Object.fromEntries(K.map(k=>[k,0]));let solo=0;
 qs().forEach((q,i)=>{const answer=state.answers[i];if(answer===null||answer===undefined||!q.a[answer])return;
 K.forEach(k=>{capacity[k]+=Math.max(0,...q.a.map(o=>o.w[k]||0));selected[k]+=q.a[answer].w[k]||0;});solo+=q.a[answer].solo||0;});
 const axes=Object.fromEntries(K.map(k=>[k,Math.max(5,Math.min(100,Math.round(23+140*(selected[k]/Math.max(1,capacity[k])))))]));
 state.adaptive.forEach((q,i)=>{if(state.adaptAnswers[i]===0)axes[q.axis]=Math.min(100,axes[q.axis]+9);if(state.adaptAnswers[i]===1)axes[q.axis]=Math.max(0,axes[q.axis]-9);});
 return {axes,solo};
}
function calculate(){const {axes,solo}=axesFrom();const weights={city:1.1,touring:1.1,agility:1.15,comfort:1.1,versatility:1.2,expression:.94,practicality:1.04,sportiness:1.05};
 const genres=GENRES.map(genre=>{let d=0,n=0;K.forEach(k=>{d+=weights[k]*(axes[k]-genre.profile[k])**2;n+=weights[k];});return {genre,score:Math.max(0,Math.round(100-Math.sqrt(d/n)))};}).sort((a,b)=>b.score-a.score||a.genre.id.localeCompare(b.genre.id));
 const mood={explore:(axes.touring+axes.versatility-axes.city-axes.practicality)/2,active:(axes.agility+axes.sportiness)/2-axes.comfort,express:axes.expression-axes.practicality,solo};
 const flags=[mood.explore>7,mood.active>7,mood.express>7,solo>=2];const type=flags.reduce((n,flag,i)=>n+(flag?8>>i:0),0);
 return {axes,genres,type,neutral:Object.entries(mood).filter(([k,v])=>Math.abs(v)<(k==='solo'?2:8)).map(([k])=>k)};
}
function finish(){state.index=answerTotal();state.completed=true;show('result');}
function htmlText(el,txt){el.textContent=txt;}
function renderResult(){const share=state.shared&&state.sharedData;const result=share?share:calculate();const t=TYPES[result.type]||TYPES[0],picks=share?result.genres.map(x=>({genre:GENRES.find(g=>g.id===x.id),score:null})):result.genres;
 $('result-title').textContent=t[0];$('result-english').textContent=t[1];$('result-serial').textContent='TYPE '+String(result.type+1).padStart(2,'0')+' / 16';
 $('result-description').textContent=t[2];$('result-best-genre').textContent=picks[0]?.genre?.name||'—';$('result-next-genre').textContent=picks[1]?.genre?.name||'—';
 $('result-mode').textContent=share?(share.mode==='deep'?'심화 결과 공유':'빠른 결과 공유'):state.mode==='deep'?'진지한 유형 찾기 결과':'빠른 유형 찾기 결과';
 $('result-deep-cta').hidden=Boolean(share)||state.mode==='deep';$('shared-note').hidden=!share;
 $('result-details').open=false;
 const genres=$('genre-results');genres.replaceChildren();picks.slice(0,share?2:state.mode==='deep'?8:2).forEach((item,i)=>{if(!item.genre)return;
 const row=document.createElement('div');row.className='genre-row';const head=document.createElement('div');const label=document.createElement('span');label.className='genre-label';label.textContent=`${i+1}위 · ${item.genre.name}`;const desc=document.createElement('small');desc.textContent=item.genre.desc;head.append(label,desc);const num=document.createElement('span');num.className='genre-score';num.textContent=item.score===null?'':String(item.score);const bar=document.createElement('div');bar.className='bar-track';const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=`${item.score||0}%`;bar.append(fill);if(item.score===null)bar.hidden=true;row.append(head,num,bar);genres.append(row);
 });
 const axes=$('axis-results');axes.replaceChildren();if(!share){Object.entries(result.axes).sort((a,b)=>b[1]-a[1]).slice(0,state.mode==='deep'?8:3).forEach(([k,v])=>{const item=document.createElement('div');item.className='axis-line';const span=document.createElement('span');span.textContent=AXES[k];const track=document.createElement('div');track.className='axis-track';const fill=document.createElement('i');fill.style.width=v+'%';track.append(fill);const b=document.createElement('b');b.textContent=v;item.append(span,track,b);axes.append(item);});}else{const p=document.createElement('p');p.className='fine-print';p.textContent='공유 링크에는 답변과 취향 세부 정보가 들어 있지 않습니다.';axes.append(p);}
 const margin=!share?picks[0].score-picks[1].score:null;$('result-insight').textContent=share?'공유된 결과는 요약 정보만 표시합니다.':margin<=4?`상위 두 장르의 점수 차이가 ${margin}점으로 작아요. 두 스타일 모두 살펴보세요.`:`${AXES[Object.keys(result.axes).sort((a,b)=>result.axes[b]-result.axes[a])[0]]}에 대한 선호가 상대적으로 강하게 나타났어요.`;
 $('result-extra-analysis').hidden=Boolean(share)||state.mode!=='deep';
 if(!share&&state.mode==='deep'){$('deep-plus').textContent='추천을 이해할 때는 점수뿐 아니라 불편을 느낄 조건도 확인하세요. ‘'+AXES[Object.keys(result.axes).sort((a,b)=>result.axes[a]-result.axes[b])[0]]+'’의 우선순위는 비교적 낮았어요. 장르 내부에서도 차종별 차이가 크니 실제로 확인해 보세요.';}
 const mod=$('model-examples');mod.replaceChildren();picks.slice(0,2).forEach(x=>{if(!x.genre)return;const p=document.createElement('div');p.className='model-item';const b=document.createElement('b');b.textContent=x.genre.name;const small=document.createElement('span');small.textContent=x.genre.models.join(' · ');p.append(b,small);mod.append(p);});
 renderPersonalitySummary(share);$('share-feedback').textContent='';
}
function mbtiParts(){return [['EI','E','I'],['SN','N','S'],['TF','T','F'],['JP','J','P']];}
function estimateMbti(length){const sum={EI:0,SN:0,TF:0,JP:0};for(let i=0;i<length;i++){const q=PERSONALITY_ITEMS[i];if(state.personality[i]!==null)sum[q.a]+=state.personality[i]*(q.r?-1:1);}const threshold=length===8?2:3;const type=mbtiParts().map(([k,a,b])=>sum[k]>=threshold?a:sum[k]<=-threshold?b:'?').join('');return {type,sum,threshold};}
function renderPersonalitySummary(shared){const estimated=shared?shared.estimated:state.estimated,manual=shared?shared.self:state.mbtiManual,container=$('mbti-summary');container.replaceChildren();
 const block=(tag,value,sub)=>{const row=document.createElement('div');row.className='mbti-summary-row';const k=document.createElement('span');k.textContent=tag;const val=document.createElement('strong');val.textContent=value||'—';const caption=document.createElement('small');caption.textContent=sub;row.append(k,val,caption);container.append(row);};
 block('예상 MBTI',estimated||'미측정',estimated?(shared?'비공식 추정 결과':`${state.estimateLength||8}문항 독자 문항으로 추정한 참고용 결과`):'별도 성격 질문을 완료하면 표시됩니다.');
 if(manual)block('내가 입력한 MBTI',manual,'본인 입력값 · 공식 검증 아님');
 const compare=$('mbti-comparison');compare.hidden=!(estimated&&manual);if(estimated&&manual){const matching=Array.from(estimated).filter((s,i)=>s!=='?'&&s===manual[i]).length;const known=Array.from(estimated).filter(x=>x!=='?').length;compare.textContent=`확인 가능한 ${known}개 성격 축 중 ${matching}개가 입력한 유형과 일치했어요. 이는 성격 검사의 정확도 수치가 아니에요.`;}
 $('mbti-actions').hidden=Boolean(shared);$('mbti-start-label').textContent=state.mode==='deep'?'예상 MBTI 검사 · 20문항':'예상 MBTI 검사 · 8문항';
 if(!shared&&state.estimateLength===8&&state.mode==='deep')$('mbti-start-label').textContent='예상 MBTI 심화 · 추가 12문항';
}
function renderMbti(){const total=mbtiTotal(),at=state.personalityIndex,question=PERSONALITY_ITEMS[at];if(!question){show('result');return;}
 $('mbti-progress-label').textContent=String(at+1).padStart(2,'0')+' / '+total;$('mbti-question').textContent=question.t;
 const percent=Math.round(at/total*100);$('mbti-progress-fill').style.width=percent+'%';$('mbti-progress-track').setAttribute('aria-valuenow',String(percent));
 const list=$('mbti-choices');list.replaceChildren();['전혀 아니다','아니다','보통이다','그렇다','매우 그렇다'].forEach((txt,i)=>{const b=document.createElement('button');b.type='button';b.className='likert-option';b.textContent=txt;b.classList.toggle('chosen',state.personality[at]===i-2);b.setAttribute('aria-pressed',String(state.personality[at]===i-2));b.addEventListener('click',()=>{state.personality[at]=i-2;if(at===total-1){const r=estimateMbti(total);state.estimated=r.type;state.estimateLength=total;show('result');toast('예상 성격 유형을 추가했어요.');}else{state.personalityIndex++;show('mbti',{focus:false});}});list.append(b);});$('mbti-prev').disabled=at===0;
}
function renderManual(){const wrap=$('manual-pairs');wrap.replaceChildren();const labels=[['에너지 방향','E','I'],['정보 선호','S','N'],['판단 선호','T','F'],['생활 방식','J','P']];labels.forEach(([tag,a,b],index)=>{const row=document.createElement('div');row.className='manual-pair';const label=document.createElement('span');label.textContent=tag;row.append(label);[a,b].forEach(letter=>{const btn=document.createElement('button');btn.type='button';btn.textContent=letter;btn.classList.toggle('selected',state.manualDraft[index]===letter);btn.setAttribute('aria-pressed',String(state.manualDraft[index]===letter));btn.addEventListener('click',()=>{state.manualDraft[index]=letter;renderManual();persist();});row.append(btn);});wrap.append(row);});}
function manualSave(){if(state.manualDraft.some(x=>!x)){toast('4개 항목을 모두 골라 주세요.');return;}state.mbtiManual=state.manualDraft.join('');show('result');toast('입력한 MBTI를 별도로 표시했어요.');}
function shareData(){if(state.shared)return state.sharedData;const r=calculate();return {type:r.type,mode:state.mode,genres:r.genres.slice(0,2).map(x=>({id:x.genre.id})),estimated:state.estimated,self:state.mbtiManual};}
function allowedMBTI(s){return typeof s==='string'&&s.length===4&&['EI','SN','TF','JP'].every((p,i)=>p.includes(s[i])||s[i]==='?');}
function parseShared(){const p=new URLSearchParams(location.search);if(!p.has('r')||!p.has('g'))return false;const type=Number(p.get('r')),genres=p.get('g').split(','),mode=p.get('d')==='1'?'deep':'quick';if(!Number.isInteger(type)||type<0||type>15||genres.length!==2||!genres.every(id=>GENRES.some(x=>x.id===id)))return false;
 state.shared=true;state.sharedData={type,genres:genres.map(id=>({id})),mode,estimated:allowedMBTI(p.get('e'))?p.get('e'):null,self:allowedMBTI(p.get('s'))&&!p.get('s').includes('?')?p.get('s'):null};return true;}
function shareLink(){const d=shareData(),url=new URL(location.href);url.hash='';url.search='';url.searchParams.set('r',String(d.type));url.searchParams.set('g',d.genres.map(x=>x.id).join(','));if(d.mode==='deep')url.searchParams.set('d','1');if(d.estimated)url.searchParams.set('e',d.estimated);if(d.self)url.searchParams.set('s',d.self);return url.href;}
async function share(){const link=shareLink();if(navigator.share){try{await navigator.share({title:'RIDE DNA — 내 라이더 유형',text:'나의 라이더 성향을 확인해 보세요.',url:link});$('share-feedback').textContent='공유했어요.';return;}catch(e){if(e.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(link);$('share-feedback').textContent='링크를 복사했어요.';}catch{const t=document.createElement('textarea');t.value=link;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();$('share-feedback').textContent=ok?'링크를 복사했어요.':link;}}
function drawCanvas(){const d=shareData(),c=document.createElement('canvas');c.width=1080;c.height=1350;const ctx=c.getContext('2d');if(!ctx){toast('이미지 저장이 지원되지 않아요.');return;}
 ctx.fillStyle='#111114';ctx.fillRect(0,0,1080,1350);ctx.fillStyle='#d23b4b';ctx.fillRect(0,0,220,12);
 const tx=(text,x,y,font,color)=>{ctx.font=font;ctx.fillStyle=color;ctx.fillText(text,x,y);};
 const wrap=(text,y,width,font,line=97,max=2)=>{ctx.font=font;let row='',lines=[];for(const ch of Array.from(text)){if(row&&ctx.measureText(row+ch).width>width){lines.push(row);row=ch;}else row+=ch;}if(row)lines.push(row);lines.slice(0,max).forEach((v,i)=>tx(v,74,y+i*line,font,'#f4eeee'));return y+(Math.min(max,lines.length)-1)*line;};
 tx('RIDE DNA',74,145,'800 66px system-ui,sans-serif','#f2eeec');tx(d.mode==='deep'?'DEEP RESULT':'QUICK RESULT',74,210,'500 25px system-ui,sans-serif','#bcb2b8');ctx.strokeStyle='#454047';ctx.beginPath();ctx.moveTo(74,253);ctx.lineTo(1000,253);ctx.stroke();
 tx('나의 라이더 유형',74,319,'600 29px system-ui,sans-serif','#e7a2af');const title=TYPES[d.type]?.[0]||'나의 라이더 유형';const y=wrap(title,442,928,'750 85px system-ui,sans-serif',109,2);tx(TYPES[d.type]?.[1]||'',74,Math.max(580,y+100),'560 27px system-ui,sans-serif','#d1c6cc');
 ctx.beginPath();ctx.moveTo(74,680);ctx.lineTo(1000,680);ctx.stroke();tx('추천 바이크 스타일',74,752,'540 26px system-ui,sans-serif','#bdb3bb');wrap(GENRES.find(x=>x.id===d.genres[0]?.id)?.name||'—',835,920,'700 58px system-ui,sans-serif',70,2);
 tx('두 번째 스타일',74,974,'500 25px system-ui,sans-serif','#a99da5');tx(GENRES.find(x=>x.id===d.genres[1]?.id)?.name||'—',74,1030,'650 38px system-ui,sans-serif','#f2eeee');
 if(d.estimated)tx('예상 MBTI   '+d.estimated,74,1135,'650 31px system-ui,sans-serif','#e5a7af');
 if(d.self)tx('내 MBTI   '+d.self,74,d.estimated?1183:1135,'520 27px system-ui,sans-serif','#c0b3bb');
 ctx.fillStyle='#61575d';ctx.fillRect(74,1220,925,1);tx('RIDE DNA  ·  무료 · 비공식 취향 테스트',74,1291,'450 23px system-ui,sans-serif','#b7afb5');
 try{const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download='RIDE_DNA_RESULT.png';document.body.append(a);a.click();a.remove();toast('결과 이미지가 저장됐어요.');}catch{toast('이미지 저장에 실패했어요.');}}
function action(name){if(name==='home'){state.shared=false;state.sharedData=null;history.replaceState({rideDna:true,screen:'home'},'',location.pathname);show('home');return;}
 if(name==='choose'){show('choose');return;}if(name==='quick'||name==='deep'){chooseMode(name);return;}
 if(name==='resume'){show('quiz');return;}if(name==='restart'){state.shared=false;state.sharedData=null;state=blankState();history.replaceState({rideDna:true,screen:'choose'},'',location.pathname);show('choose');return;}
 if(name==='upgrade'){upgrade();return;}if(name==='result'){show('result');return;}
 if(name==='mbti-test'){if(state.estimateLength===8&&state.mode==='deep'&&state.personality.slice(0,8).every(v=>v!==null)){state.personalityIndex=8;}else{state.personalityIndex=0;state.personality=Array(20).fill(null);}show('mbti');return;}
 if(name==='mbti-manual'){state.manualDraft=state.mbtiManual?state.mbtiManual.split(''):[null,null,null,null];show('manual');return;}}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.action)));
$('quiz-exit').addEventListener('click',quit);$('quiz-prev').addEventListener('click',prev);
$('exit-cancel').addEventListener('click',()=>$('exit-dialog').close());$('exit-confirm').addEventListener('click',()=>{$('exit-dialog').close();show('home');});
$('mbti-prev').addEventListener('click',()=>{state.personalityIndex=Math.max(0,state.personalityIndex-1);show('mbti');});
$('manual-save').addEventListener('click',manualSave);$('share-button').addEventListener('click',share);$('image-button').addEventListener('click',drawCanvas);
window.addEventListener('popstate',e=>{if(!e.state?.rideDna||!screens[e.state.screen])return;const h=e.state;if(h.mode&&MODE_CONFIG[h.mode])state.mode=h.mode;
 if(Number.isInteger(h.index))state.index=Math.max(0,Math.min(h.index,40));if(Number.isInteger(h.adaptIndex))state.adaptIndex=Math.max(0,Math.min(h.adaptIndex,state.adaptive.length-1));if(Number.isInteger(h.personalityIndex))state.personalityIndex=Math.max(0,Math.min(h.personalityIndex,19));
 if(h.screen==='quiz'&&state.completed&&!state.shared){
  state.completed=false;state.index=Math.min(state.index,answerTotal()-1);state.adaptive=[];state.adaptAnswers=[];state.adaptIndex=0;
 }
 if(h.screen==='result'&&!state.completed&&!state.shared){
  if(state.answers.slice(0,answerTotal()).every(a=>a!==null))state.completed=true;
  else {show('home',{nav:'silent'});return;}
 }
 show(h.screen,{nav:'silent'});
});
restore();if(parseShared())show('result',{nav:'replace',focus:false});else show(state.screen,{nav:'replace',focus:false});
