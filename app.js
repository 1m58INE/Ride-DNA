'use strict';
/* RIDE DNA — self-contained, exploratory preference model. No tracking, APIs, or server writes. */
const K=['city','touring','agility','comfort','versatility','expression','practicality','sportiness'];
const AXES={city:'도심 활용',touring:'여행 지향',agility:'가벼운 조작감',comfort:'편안함',versatility:'다양한 길',expression:'디자인·감성',practicality:'실용성',sportiness:'스포티함'};
const option=(label,w={},solo=0)=>({label,w,solo});
const QUESTIONS=[
  {c:'당신의 주말',t:'쉬는 날 바이크를 타고 어디로 가고 싶나요?',h:'바이크를 아직 타지 않아도 상상해서 선택해 주세요.',a:[option('동네와 도심을 가볍게 돌아본다',{city:3,practicality:2}),option('먼 곳의 풍경을 보러 떠난다',{touring:3,comfort:1}),option('굽이진 포장도로에서 조작의 재미를 느낀다',{agility:3,sportiness:2}),option('처음 가보는 낯선 길을 찾아본다',{versatility:3,touring:2})]},
  {c:'선택의 기준',t:'바이크를 고른다면 무엇을 가장 먼저 볼까요?',h:'정답보다는 나에게 중요한 조건을 생각해 보세요.',a:[option('매일 타기 편한지',{city:2,practicality:3}),option('보기만 해도 마음이 가는 디자인인지',{expression:3}),option('몸에 맞고 오래 타도 편안한지',{comfort:3,touring:1}),option('내가 원하는 조작감을 내는지',{agility:2,sportiness:3})]},
  {c:'이동의 이유',t:'바이크를 타고 이동할 때 어떤 점이 더 좋나요?',h:'상상 속에서 가장 현실적인 내 모습으로 답해 주세요.',a:[option('빠르고 간편하게 목적지에 도착하는 것',{city:3,practicality:3}),option('가는 길 자체를 즐기며 돌아가는 것',{touring:3,expression:1}),option('조작이 재미있는 길을 일부러 고르는 것',{agility:3,sportiness:2}),option('가본 적 없는 길을 가 보는 것',{versatility:3,touring:1})]},
  {c:'우선순위',t:'모두 가질 수 없다면 무엇을 가장 중요하게 볼까요?',h:'모두 만족시킬 수 없다면 가장 포기하기 어려운 것.',a:[option('연료비·관리 부담을 줄이는 것',{practicality:3,city:1}),option('가볍고 즉각적인 반응',{agility:3,sportiness:1}),option('편안한 자세와 피로 감소',{comfort:3,touring:1}),option('마음에 드는 외형과 분위기',{expression:3})]},
  {c:'나의 페이스',t:'달리는 동안 가장 만족스러운 순간은?',h:'안전한 도로 주행을 전제로 생각해 주세요.',a:[option('평소 이동이 더 편해졌을 때',{city:2,practicality:2}),option('좋은 풍경을 길게 바라보는 순간',{touring:3,comfort:1}),option('정확한 조작으로 코너를 부드럽게 지난 순간',{agility:3,sportiness:2}),option('전혀 새로운 장소를 발견한 순간',{versatility:3})]},
  {c:'함께하는 방식',t:'라이딩 약속을 잡는다면?',h:'실제 라이딩 경험이 없다면 여행이나 드라이브를 떠올려도 좋아요.',a:[option('혼자 조용히 나만의 속도로 움직인다',{touring:1,expression:1},2),option('소수의 친구와 적당히 맞춰 달린다',{comfort:1,practicality:1},-1),option('여럿이 목적지를 정하고 움직인다',{touring:2,versatility:1},-2),option('상황에 따라 혼자 타거나 함께 탄다',{city:1,versatility:1},0)]},
  {c:'바이크의 자세',t:'어떤 승차 자세가 더 끌리나요?',h:'실제 편안함은 개인의 신체 조건과 차종에 따라 달라요.',a:[option('일상에서 다루기 쉬운 편한 자세',{city:2,practicality:2,comfort:1}),option('상체를 숙이고 조작에 집중하는 자세',{sportiness:3,agility:2}),option('상체를 세우고 시야가 탁 트인 자세',{touring:1,versatility:2,comfort:2}),option('여유롭게 앉아 풍경을 즐기는 자세',{comfort:3,expression:1})]},
  {c:'포기할 수 없는 것',t:'다음 중 하나만 지킬 수 있다면?',h:'모든 것을 갖춘 바이크는 드물어요.',a:[option('적은 관리 부담',{practicality:3,city:1}),option('오래 타도 덜 피곤한 것',{comfort:3,touring:2}),option('시선을 끄는 디자인',{expression:3,sportiness:1}),option('내 뜻대로 움직이는 조작감',{agility:3,sportiness:2})]},
  {c:'장소의 선택',t:'다음 중 더 가고 싶은 장소는?',h:'실제 도로 주행이 허용된 장소만 상정해 주세요.',a:[option('도심의 작은 카페와 골목',{city:3,expression:1}),option('바닷가를 따라 길게 이어지는 도로',{touring:3,comfort:1}),option('포장 상태가 좋은 굽잇길',{agility:3,sportiness:2}),option('산길과 지방도, 변화가 많은 풍경',{versatility:3,touring:1})]},
  {c:'나의 일상',t:'바이크를 갖게 된다면 주로 언제 타고 싶나요?',h:'현재 사용 방식이 아닌 미래의 희망 용도로 답해도 좋아요.',a:[option('출퇴근과 가벼운 이동',{city:3,practicality:3}),option('주말 중·장거리 여행',{touring:3,comfort:2}),option('주말의 짧고 몰입감 있는 라이딩',{sportiness:3,agility:2}),option('정해두지 않고 여러 곳을 다니기',{versatility:2,expression:1,touring:1})]},
  {c:'내 취향',t:'어떤 모습의 바이크가 가장 마음에 드나요?',h:'디자인을 잘 몰라도 느낌만으로 충분해요.',a:[option('실용적이고 부담 없이 탈 수 있는 모습',{practicality:3,city:1}),option('깔끔하고 날렵한 모습',{sportiness:2,agility:1,expression:2}),option('오래 봐도 질리지 않는 모습',{expression:3,comfort:1}),option('어디든 갈 수 있을 것 같은 모습',{versatility:2,touring:2})]},
  {c:'기대하는 경험',t:'모처럼 일정이 길게 비었습니다. 무엇을 하고 싶나요?',h:'당일치기부터 며칠의 여행까지 자유롭게 떠올려 보세요.',a:[option('도시 안에서 느긋하게 시간을 보낸다',{city:2,comfort:2}),option('목적지를 여러 개 정해 장거리 여행을 간다',{touring:3,comfort:2}),option('새로운 도로를 익히고 조작 실력을 다듬는다',{agility:3,sportiness:2}),option('지도에서 본 적 없는 작은 길을 찾아본다',{versatility:3,touring:1})]},
  {c:'함께하는 방식',t:'처음 가는 장소에는 누구와 함께 가고 싶나요?',h:'혼자와 함께 중 어느 쪽이 편한지 생각해 보세요.',a:[option('혼자 계획하고 혼자 출발한다',{touring:1,practicality:1},2),option('친한 친구 한 명과 함께 간다',{comfort:1,touring:1},-1),option('친구들과 일정을 맞춰 함께 간다',{touring:2,versatility:1},-2),option('상황에 따라 유연하게 결정한다',{city:1,versatility:1},0)]},
  {c:'실제 조건',t:'다음 중 가장 불편하게 느껴질 것은?',h:'가장 신경 쓰일 것 같은 한 가지를 고르세요.',a:[option('주차와 일상 관리가 번거로운 것',{city:2,practicality:3}),option('무거운 차체가 다루기 힘든 것',{agility:3,practicality:1}),option('바람과 피로 때문에 오래 타기 힘든 것',{comfort:3,touring:2}),option('갈 수 있는 길의 종류가 적은 것',{versatility:3})]},
  {c:'마음에 남는 순간',t:'라이딩을 마치고 친구에게 가장 말하고 싶은 것은?',h:'가장 먼저 꺼내고 싶은 이야기를 고르세요.',a:[option('예상보다 편리했던 일상 경험',{city:2,practicality:2},-1),option('오래 달려 만난 풍경',{touring:3,comfort:1},1),option('원하는 대로 바이크를 부드럽게 조작한 순간',{agility:2,sportiness:3},1),option('남들이 잘 모르는 길을 발견한 이야기',{versatility:3,expression:1},1)]},
  {c:'나에게 필요한 것',t:'바이크를 오래 만족하며 타려면 무엇이 중요할까요?',h:'구매 후에 더 오래 중요할 것 같은 항목.',a:[option('낮은 유지 부담과 편의 기능',{practicality:3,city:2}),option('오래 달릴 때의 안락함',{touring:2,comfort:3}),option('가볍게 움직이고 바로 반응하는 느낌',{agility:3,sportiness:2}),option('취향에 꼭 맞는 디자인과 감성',{expression:3})]},
  {c:'도로 위의 하루',t:'같은 거리를 달리더라도 어떤 선택을 할까요?',h:'실제 도로 상황과 교통법규를 준수한다는 전제예요.',a:[option('편하고 효율적인 경로',{city:2,practicality:3}),option('휴식 지점이 충분한 경로',{comfort:3,touring:1}),option('포장 상태가 좋고 구성이 흥미로운 경로',{agility:2,sportiness:2}),option('새로운 풍경을 볼 수 있는 경로',{versatility:3,touring:1})]},
  {c:'함께하는 방식',t:'낯선 라이더와 마주친다면?',h:'실제로 어떻게 행동할 것 같은지 떠올려 보세요.',a:[option('내 일정대로 계속 움직인다',{practicality:1,city:1},2),option('짧게 인사만 나눈다',{city:1,expression:1},1),option('가볍게 이야기를 나눠본다',{expression:1,touring:1},-1),option('함께 갈 만한 코스를 공유한다',{versatility:1,touring:2},-2)]},
  {c:'가장 큰 매력',t:'모터사이클을 떠올리면 무엇이 먼저 생각나나요?',h:'이미지가 아니라 가장 끌리는 경험을 선택해 보세요.',a:[option('생활 속 이동의 자유',{city:3,practicality:2}),option('먼 거리를 여행하는 감각',{touring:3,comfort:1}),option('섬세한 조작과 집중',{agility:3,sportiness:3}),option('나만의 취향과 개성을 드러내는 물건',{expression:3,versatility:1})]},
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
/* v1.5: 24 five-level agreement items (3 per preference dimension). Core 16 is unchanged. */
const SCALE_LABELS=['매우 그렇다','그렇다','보통이다','그렇지 않다','전혀 그렇지 않다'];
const UNKNOWN_ANSWER=-1; // Not a neutral answer: this item is excluded from the scale average.
const DEEP=[
  {kind:'scale',axis:'city',c:'취향',t:'바이크를 일상에서도 자주 타고 싶다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'touring',c:'취향',t:'짧은 외출보다 멀리 떠나는 바이크 여행에 더 끌린다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'agility',c:'취향',t:'바이크가 가볍게 움직이는 느낌이 좋다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'comfort',c:'취향',t:'오래 타도 편안한 자세가 중요하다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'versatility',c:'취향',t:'가본 적 없는 길을 찾아가는 일이 즐겁다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'expression',c:'취향',t:'바이크를 고를 때 디자인을 중요하게 본다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'practicality',c:'취향',t:'유지비가 적게 드는 바이크에 더 끌린다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'sportiness',c:'취향',t:'바이크를 조작하는 재미가 가장 큰 매력 중 하나다.',h:'평소 내 모습과 가장 가까운 정도를 선택해 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'city',c:'사용 방식',t:'가까운 거리를 이동할 때도 바이크를 선택하고 싶다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'touring',c:'사용 방식',t:'시간이 허락한다면 하루 이상 이어지는 라이딩 여행을 가고 싶다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'agility',c:'사용 방식',t:'내가 움직인 만큼 바이크가 바로 반응하는 것이 중요하다.',h:'실제 바이크 경험이 없다면 판단하기 어렵다고 선택해도 좋아요.',reverse:false,needsExperience:true},
  {kind:'scale',axis:'comfort',c:'사용 방식',t:'바람이나 피로를 덜어 주는 편의 기능이 중요하다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'versatility',c:'사용 방식',t:'다양한 도로 환경에 맞는 바이크를 갖고 싶다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'expression',c:'사용 방식',t:'바이크의 외형이 마음에 들면 더 오래 애착이 간다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'practicality',c:'사용 방식',t:'주차하거나 관리하기 쉬운 바이크가 좋다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:false,needsExperience:false},
  {kind:'scale',axis:'sportiness',c:'사용 방식',t:'굽은 포장도로에서 바이크를 부드럽게 다루는 것이 즐겁다.',h:'실제 바이크 경험이 없다면 판단하기 어렵다고 선택해도 좋아요.',reverse:false,needsExperience:true},
  {kind:'scale',axis:'city',c:'우선순위',t:'바이크는 주말에만 타더라도 충분히 만족할 것 같다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'touring',c:'우선순위',t:'나는 먼 거리보다 짧은 거리만 다녀오는 편이 좋다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'agility',c:'우선순위',t:'민첩한 움직임보다 묵직하고 차분한 느낌이 더 좋다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'comfort',c:'우선순위',t:'마음에 드는 바이크라면 편안함은 많이 양보해도 괜찮다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'versatility',c:'우선순위',t:'나는 늘 다니는 익숙한 도로만 있어도 충분하다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'expression',c:'우선순위',t:'사용하기 편하다면 바이크의 외형은 별로 중요하지 않다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'practicality',c:'우선순위',t:'내 취향에 맞는다면 유지·관리의 번거로움은 크게 신경 쓰지 않는다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false},
  {kind:'scale',axis:'sportiness',c:'우선순위',t:'스포티한 느낌보다 여유로운 이동이 더 끌린다.',h:'옳고 그른 답은 없어요. 나에게 가까운 답을 골라 주세요.',reverse:true,needsExperience:false}
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
const STORE='ridedna-v1.5.0'; // New model: never interpret previous deep multiple-choice answers as scale answers.
const LEGACY_STORE='ridedna-v1.3.0'; // Read-only migration of 16-item quick tests only.
const DUO_SESSION='ridedna-duo-invite-v1';
let duoInvite=null, savedOwn=null, cardFile=null, imageVersion=0;
function blankState(){return {modelVersion:5,screen:'home',mode:null,answers:Array(40).fill(null),index:0,adaptive:[],adaptAnswers:[],adaptIndex:0,completed:false,personality:Array(20).fill(null),personalityIndex:0,estimated:null,estimateLength:0,mbtiManual:null,manualDraft:[null,null,null,null],shared:false,sharedData:null,experience:'unspecified'};}
let state=blankState();
const $=id=>document.getElementById(id);
const screens=Object.fromEntries(['home','choose','quiz','result','mbti','manual','duo'].map(x=>[x,$(x+'-screen')]));
let locked=false, timer=null, toastTimer=null;
/* v1.6.0 — Motion is presentation only. No model/scoring values are modified. */
const MOTION_KEY='ride-dna-motion-v1';
let motionMode='standard', revealTimer=null, questionFrame=0, revealActive=false;
function readMotionMode(){
 try{const stored=localStorage.getItem(MOTION_KEY);if(['standard','full','off'].includes(stored))return stored;}catch{}
 return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'off':'standard';
}
function setMotionMode(mode,{save=true}={}){
 if(!['standard','full','off'].includes(mode))return;
 motionMode=mode;document.documentElement.dataset.motion=mode;
 if(save)try{localStorage.setItem(MOTION_KEY,mode);}catch{}
 document.querySelectorAll('input[name="motion-mode"]').forEach(input=>{input.checked=input.value===mode;});
 const note=$('motion-note');if(note)note.textContent=mode==='off'?'불필요한 전환과 결과 공개 연출을 건너뜁니다.':mode==='full'?'조금 더 강한 화면 효과를 적용합니다.':'빠른 질문 전환과 짧은 결과 공개 연출을 사용합니다.';
 if(mode==='off')dismissReveal({focus:false});
}
function openMotionSettings(){setMotionMode(motionMode,{save:false});$('motion-dialog').showModal();}
function motionEnabled(){return motionMode!=='off';}
function questionEnter(){
 const body=document.querySelector('#quiz-screen .quiz-body');if(!body)return;
 body.classList.remove('question-leaving','question-entering');
 if(!motionEnabled())return;
 const frame=++questionFrame;
 requestAnimationFrame(()=>{if(state.screen==='quiz'&&frame===questionFrame)body.classList.add('question-entering');});
}
function updateProgressMotion(el){
 el.classList.remove('is-advancing');if(!motionEnabled())return;
 void el.offsetWidth;el.classList.add('is-advancing');
}
const SVG_NS='http://www.w3.org/2000/svg';
function svgElement(tag,attrs={}){const node=document.createElementNS(SVG_NS,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));return node;}
function signatureValues(axes){return K.map(k=>Math.max(0,Math.min(100,Number(axes?.[k])||0)));}
function signaturePoints(axes){
 return signatureValues(axes).map((value,i)=>{
  const a=-Math.PI/2+i*Math.PI/4,r=31+value*.67;
  return [110+Math.cos(a)*r,110+Math.sin(a)*r];
 });
}
function drawSignature(svg,axes){
 if(!svg)return;svg.replaceChildren();
 [44,76,103].forEach(r=>svg.append(svgElement('circle',{cx:110,cy:110,r,fill:'none',stroke:'rgba(209,181,190,.17)','stroke-width':1})));
 for(let i=0;i<8;i++){
  const a=-Math.PI/2+i*Math.PI/4;
  svg.append(svgElement('line',{x1:110,y1:110,x2:(110+103*Math.cos(a)).toFixed(2),y2:(110+103*Math.sin(a)).toFixed(2),stroke:'rgba(209,181,190,.15)','stroke-width':1}));
 }
 const points=signaturePoints(axes);
 const poly=svgElement('polygon',{points:points.map(p=>p.map(x=>x.toFixed(2)).join(',')).join(' '),fill:'rgba(210,59,75,.21)',stroke:'#ed7482','stroke-width':2.6,'stroke-linejoin':'round',class:'signature-shape'});
 svg.append(poly);
 points.forEach(([x,y])=>svg.append(svgElement('circle',{cx:x.toFixed(2),cy:y.toFixed(2),r:3.3,fill:'#f09da6',class:'signature-dot'})));
 svg.append(svgElement('circle',{cx:110,cy:110,r:3,fill:'#f1c2c7'}));
}
function displayAxesForResult(result){
 if(result.axes)return result.axes;
 // Shared links contain only summary data; do not fabricate or expose precise eight-axis answers.
 const profiles=(result.genres||[]).map(g=>GENRES.find(x=>x.id===g.id)?.profile).filter(Boolean);
 return Object.fromEntries(K.map(k=>[k,profiles.length?profiles.reduce((n,p)=>n+p[k],0)/profiles.length:50]));
}
function dismissReveal({focus=true}={}){
 if(revealTimer){clearTimeout(revealTimer);revealTimer=null;}
 const overlay=$('reveal-overlay');if(!overlay||overlay.hidden)return;
 overlay.hidden=true;revealActive=false;
 $('main').inert=false;$('header').inert=false;document.querySelector('footer').inert=false;
 if(focus&&state.screen==='result')$('result-title').focus({preventScroll:true});
}
function launchReveal(){
 if(!motionEnabled())return;
 const result=calculate(),label=TYPES[result.type]?.[0]||'나의 라이더 유형';
 $('reveal-type').textContent=label;$('reveal-genre').textContent=result.genres[0]?.genre.name||'';
 drawSignature($('reveal-signature-svg'),result.axes);
 const overlay=$('reveal-overlay');overlay.hidden=false;revealActive=true;
 $('main').inert=true;$('header').inert=true;document.querySelector('footer').inert=true;
 $('reveal-skip').focus({preventScroll:true});
 revealTimer=setTimeout(()=>dismissReveal(),motionMode==='full'?1750:1280);
}

function qs(){return state.mode==='deep'?[...CORE,...DEEP]:CORE;}
function answerTotal(){return MODE_CONFIG[state.mode]?.length||16;}
function mbtiTotal(){return MODE_CONFIG[state.mode]?.mbti||8;}
function isUnfinished(){return Boolean(state.mode&&!state.completed&&state.answers.slice(0,answerTotal()).some(v=>v!==null));}
function persist(){if(state.shared)return;try{localStorage.setItem(STORE,JSON.stringify({...state,screen:['manual','mbti'].includes(state.screen)?'result':state.screen,shared:false,sharedData:null}));}catch{}}
function quickLegacyCopy(){
 try{
  if(localStorage.getItem(STORE))return;
  const raw=localStorage.getItem(LEGACY_STORE)||'';
  if(!raw||raw.length>26000)return;
  const d=JSON.parse(raw);
  if(d?.mode!=='quick'||!Array.isArray(d.answers)||d.answers.length!==40||
     !d.answers.slice(0,16).every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<4)))return;
  const x=blankState();x.mode='quick';x.answers=d.answers.slice(0,16).concat(Array(24).fill(null));
  x.completed=d.completed===true&&x.answers.slice(0,16).every(Number.isInteger);
  x.index=x.completed?16:Math.max(0,Math.min(15,Number.isInteger(d.index)?d.index:0));
  x.screen=x.completed?'result':'home';
  if(Array.isArray(d.personality)&&d.personality.length===20&&d.personality.every(v=>v===null||(Number.isInteger(v)&&v>=-2&&v<=2)))x.personality=d.personality;
  if(allowedMBTI(d.estimated))x.estimated=d.estimated;
  if(allowedMBTI(d.mbtiManual)&&!d.mbtiManual.includes('?'))x.mbtiManual=d.mbtiManual;
  x.estimateLength=[8,20].includes(d.estimateLength)?d.estimateLength:0;
  localStorage.setItem(STORE,JSON.stringify(x));
 }catch{}
}
function restore(){
 try{
  quickLegacyCopy();
  const stored=localStorage.getItem(STORE)||'';
  if(!stored||stored.length>26000)return;
  const d=JSON.parse(stored);
  if(!d||d.modelVersion!==5||!['quick','deep',null].includes(d.mode)||!Array.isArray(d.answers)||d.answers.length!==40||
    !d.answers.every((v,i)=>v===null||(Number.isInteger(v)&& (i<16?v>=0&&v<4:v>=UNKNOWN_ANSWER&&v<=4))))return;
  const x=blankState();
  for(const key of ['screen','mode','index','adaptive','adaptAnswers','adaptIndex','completed','personality','personalityIndex','estimated','estimateLength','mbtiManual','manualDraft','experience']){
   if(Object.prototype.hasOwnProperty.call(d,key))x[key]=d[key];
  }
  x.answers=d.answers; x.shared=false;x.sharedData=null;
  if(!Array.isArray(x.personality)||x.personality.length!==20||!x.personality.every(v=>v===null||(Number.isInteger(v)&&v>=-2&&v<=2)))x.personality=Array(20).fill(null);
  if(!Array.isArray(x.adaptive))x.adaptive=[];
  x.adaptive=x.adaptive.slice(0,8).filter(q=>q&&K.includes(q.axis)).map(q=>({axis:q.axis,options:ADAPTIVE_AXES[q.axis]}));
  if(!Array.isArray(x.adaptAnswers))x.adaptAnswers=[];
  x.adaptAnswers=x.adaptAnswers.slice(0,x.adaptive.length).map(v=>[0,1,2].includes(v)?v:null);
  x.adaptIndex=Math.max(0,Math.min(x.adaptive.length?x.adaptive.length-1:0,Number.isInteger(x.adaptIndex)?x.adaptIndex:0));
  x.completed=x.completed===true;
  x.estimated=allowedMBTI(x.estimated)?x.estimated:null;
  x.mbtiManual=allowedMBTI(x.mbtiManual)&&!x.mbtiManual.includes('?')?x.mbtiManual:null;
  x.estimateLength=[8,20].includes(x.estimateLength)?x.estimateLength:0;
  if(!Array.isArray(x.manualDraft)||x.manualDraft.length!==4||!x.manualDraft.every((v,i)=>v===null||(['EI','SN','TF','JP'][i]||'').includes(v)))x.manualDraft=[null,null,null,null];
  x.index=Math.min(Math.max(Number.isInteger(x.index)?x.index:0,0),x.mode==='deep'?40:16);
  x.personalityIndex=Math.max(0,Math.min(19,Number.isInteger(x.personalityIndex)?x.personalityIndex:0));
  if(!screens[x.screen]||['manual','mbti','duo'].includes(x.screen))x.screen='home';
  if(x.screen==='result'&&!x.completed)x.screen='home';
  if(x.screen==='quiz'&&x.completed)x.screen='result';
  state=x;
 }catch{}
}
function answerTotalFor(mode){return MODE_CONFIG[mode]?.length||16;}
function toast(message){const el=$('toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,3200);}
function urlState(){return {rideDna:true,screen:state.screen,mode:state.mode,index:state.index,adaptIndex:state.adaptIndex,personalityIndex:state.personalityIndex};}
function show(name,{nav='push',focus=true}={}){
 if(!screens[name])name='home';dismissReveal({focus:false});clearTimeout(timer);locked=false;state.screen=name;
 document.body.dataset.view=name;for(const [key,s] of Object.entries(screens))s.hidden=key!==name;
 $('hero-reset').hidden=!isUnfinished();$('hero-cta-label').textContent='내 라이더 유형 찾기';
 if(name==='choose')renderChoose();if(name==='quiz'){renderQuiz();questionEnter();}if(name==='result')renderResult();if(name==='mbti')renderMbti();if(name==='manual')renderManual();if(name==='duo')renderDuo();
 if(motionEnabled()&&name!=='quiz'){const screen=screens[name];screen.classList.remove('motion-scene-enter');requestAnimationFrame(()=>{if(state.screen===name)screen.classList.add('motion-scene-enter');});}
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
function currentQuizQuestion(){return state.mode==='deep'&&state.index>=40?state.adaptive[state.adaptIndex]:qs()[state.index];}
function renderQuiz(){
 const deep=state.mode==='deep',extra=deep&&state.index>=40,q=currentQuizQuestion();
 if(!q){finish();return;}
 const scale=!extra&&q.kind==='scale';
 const total=answerTotal(),step=extra?40+state.adaptIndex+1:state.index+1,max=extra?40+state.adaptive.length:total;
 const chapter=deep&&!extra&&state.index>=16?` · 심화 ${Math.floor((state.index-16)/8)+1}/3`:(deep?' · 공통 질문':'');
 $('quiz-stage').textContent=(extra?'추가 취향 확인':MODE_CONFIG[state.mode].label)+chapter;
 $('quiz-progress-label').textContent=String(step).padStart(2,'0')+' / '+max;
 updateProgressMotion($('quiz-progress'));
 const pct=Math.round((step-1)/Math.max(1,max)*100);$('quiz-progress-fill').style.width=pct+'%';$('quiz-progress').setAttribute('aria-valuenow',String(pct));
 $('question-category').textContent=extra?'두 취향이 비슷하게 나타나요':scale?'취향의 강도 · '+q.c:q.c;
 $('question-title').textContent=extra?'둘 중 어느 쪽이 조금 더 중요한가요?':q.t;
 $('question-hint').textContent=extra?'어느 쪽도 아니라면 비슷하다고 선택해 주세요.':q.h;
 const labels=extra?[q.options[0],q.options[1],'둘 다 비슷하다']:scale?[...SCALE_LABELS,...(q.needsExperience?['아직 경험이 없어 판단하기 어려워요']:[])]:q.a.map(x=>x.label);
 const selected=extra?state.adaptAnswers[state.adaptIndex]:state.answers[state.index];
 const wrap=$('answers');wrap.replaceChildren();wrap.classList.toggle('scale-mode',scale);
 labels.forEach((label,i)=>{
  const val=scale&&i===5?UNKNOWN_ANSWER:i;
  const b=document.createElement('button');b.type='button';b.className=scale?(val===UNKNOWN_ANSWER?'answer skip-experience':'answer scale-answer'):'answer';
  b.textContent=label;b.classList.toggle('chosen',val===selected);b.setAttribute('aria-pressed',String(val===selected));
  b.addEventListener('click',()=>choose(val));wrap.append(b);
 });
 $('quiz-prev').disabled=!extra&&state.index===0;
 $('quiz-helper').textContent=scale?'보통이다와 경험 없음은 다르게 처리합니다.':extra?'결과가 가까운 스타일을 조금 더 구분합니다.':'선택하면 다음 질문으로 이동합니다.';
}
function choose(i){
 if(locked||state.screen!=='quiz')return;
 const q=currentQuizQuestion(),extra=state.mode==='deep'&&state.index>=40;
 const allowed=extra?[0,1,2]:q?.kind==='scale'?(q.needsExperience?[0,1,2,3,4,UNKNOWN_ANSWER]:[0,1,2,3,4]):q?.a?.map((_,n)=>n)||[];
 if(!allowed.includes(i))return;
 locked=true;const selectedIndex=(q?.kind==='scale'&&i===UNKNOWN_ANSWER)?5:i;
 [...$('answers').children].forEach((b,n)=>{b.classList.toggle('chosen',n===selectedIndex);b.setAttribute('aria-pressed',String(n===selectedIndex));});
 const duration=motionMode==='off'?0:motionMode==='full'?270:210;
 if(motionEnabled())document.querySelector('#quiz-screen .quiz-body')?.classList.add('question-leaving');
 timer=setTimeout(()=>commit(i),duration);
}
function commit(i){const total=answerTotal();if(state.index<total){state.answers[state.index]=i;if(state.index<total-1){state.index++;show('quiz',{focus:false});return;}if(state.mode==='deep'){initAdaptive();return;}finish();return;}
 state.adaptAnswers[state.adaptIndex]=i;if(state.adaptIndex<state.adaptive.length-1){state.adaptIndex++;show('quiz',{focus:false});return;}
 if(state.adaptive.length===4){const calc=calculate();if(calc.genres[0].score-calc.genres[1].score<=4){const a=buildAdaptive(calc,4);if(a.length){state.adaptive.push(...a);state.adaptIndex++;show('quiz',{focus:false});return;}}}finish();}
function prev(){clearTimeout(timer);locked=false;if(state.index>=40){if(state.adaptIndex>0)state.adaptIndex--;else state.index=39;}else if(state.index>0)state.index--;show('quiz');}
function initAdaptive(){const data=calculate();state.adaptive=[];state.adaptAnswers=[];state.adaptIndex=0;if(data.genres[0].score-data.genres[1].score<=7){state.adaptive=buildAdaptive(data,4);if(state.adaptive.length){state.index=40;show('quiz',{focus:false});return;}}finish();}
function buildAdaptive(calc,count){const a=calc.genres[0].genre,b=calc.genres[1].genre;const used=new Set(state.adaptive.map(x=>x.axis));return K.map(axis=>({axis,gap:Math.abs(a.profile[axis]-b.profile[axis])})).filter(x=>x.gap>=15&&!used.has(x.axis)).sort((x,y)=>y.gap-x.gap).slice(0,count).map(x=>({axis:x.axis,options:ADAPTIVE_AXES[x.axis]}));}
function axesFrom(){
 // Quick mode's 16 choices and weighting have not changed. Deep starts from the same anchor.
 const selected=Object.fromEntries(K.map(k=>[k,0]));const capacity=Object.fromEntries(K.map(k=>[k,0]));let solo=0;
 CORE.forEach((q,i)=>{const answer=state.answers[i];if(!Number.isInteger(answer)||!q.a[answer])return;
  K.forEach(k=>{capacity[k]+=Math.max(0,...q.a.map(o=>o.w[k]||0));selected[k]+=q.a[answer].w[k]||0;});solo+=q.a[answer].solo||0;
 });
 const axes=Object.fromEntries(K.map(k=>[k,Math.max(5,Math.min(100,Math.round(23+140*(selected[k]/Math.max(1,capacity[k])))))]));
 let unrated=0;
 if(state.mode==='deep'){
  for(const k of K){
   const vals=DEEP.flatMap((q,i)=>{if(q.axis!==k)return [];
    const value=state.answers[16+i];if(!Number.isInteger(value)||value<0||value>4)return [];
    return [q.reverse?value:4-value];
   });
   const missing=DEEP.filter((q,i)=>q.axis===k&&state.answers[16+i]===UNKNOWN_ANSWER).length;unrated+=missing;
   if(vals.length){
    const rated=vals.reduce((a,b)=>a+b,0)/vals.length*25; // 0..100, neutral=50.
    const strength=vals.length===1?.45:.65; // At least two observations before full blend.
    axes[k]=Math.max(0,Math.min(100,Math.round((1-strength)*axes[k]+strength*rated)));
   }
  }
 }
 state.adaptive.forEach((q,i)=>{if(state.adaptAnswers[i]===0)axes[q.axis]=Math.min(100,axes[q.axis]+9);if(state.adaptAnswers[i]===1)axes[q.axis]=Math.max(0,axes[q.axis]-9);});
 return {axes,solo,unrated};
}
function calculate(){const {axes,solo,unrated}=axesFrom();const weights={city:1.1,touring:1.1,agility:1.15,comfort:1.1,versatility:1.2,expression:.94,practicality:1.04,sportiness:1.05};
 const genres=GENRES.map(genre=>{let d=0,n=0;K.forEach(k=>{d+=weights[k]*(axes[k]-genre.profile[k])**2;n+=weights[k];});return {genre,score:Math.max(0,Math.round(100-Math.sqrt(d/n)))};}).sort((a,b)=>b.score-a.score||a.genre.id.localeCompare(b.genre.id));
 const mood={explore:(axes.touring+axes.versatility-axes.city-axes.practicality)/2,active:(axes.agility+axes.sportiness)/2-axes.comfort,express:axes.expression-axes.practicality,solo};
 const flags=[mood.explore>7,mood.active>7,mood.express>7,solo>=2];const type=flags.reduce((n,flag,i)=>n+(flag?8>>i:0),0);
 return {axes,genres,type,unrated,neutral:Object.entries(mood).filter(([k,v])=>Math.abs(v)<(k==='solo'?2:8)).map(([k])=>k)};
}
function finish(){state.index=answerTotal();state.completed=true;show('result');launchReveal();}
function htmlText(el,txt){el.textContent=txt;}
function renderResult(){const share=state.shared&&state.sharedData;const result=share?share:calculate();const t=TYPES[result.type]||TYPES[0],picks=share?result.genres.map(x=>({genre:GENRES.find(g=>g.id===x.id),score:null})):result.genres;
 $('result-title').textContent=t[0];$('result-english').textContent=t[1];$('result-serial').textContent='TYPE '+String(result.type+1).padStart(2,'0')+' / 16';
 $('result-description').textContent=t[2];$('result-best-genre').textContent=picks[0]?.genre?.name||'—';$('result-next-genre').textContent=picks[1]?.genre?.name||'—';
 $('result-mode').textContent=share?(share.mode==='deep'?'심화 결과 공유':'빠른 결과 공유'):state.mode==='deep'?'진지한 유형 찾기 결과':'빠른 유형 찾기 결과';
 $('result-deep-cta').hidden=Boolean(share)||state.mode==='deep';$('shared-note').hidden=!share;
 $('result-details').open=false;
 $('duo-button').querySelector('strong').textContent=duoInvite?'친구와 내 라이딩 취향 비교하기':'친구와 라이딩 취향 비교';
 const genres=$('genre-results');genres.replaceChildren();picks.slice(0,share?2:state.mode==='deep'?8:2).forEach((item,i)=>{if(!item.genre)return;
 const row=document.createElement('div');row.className='genre-row';const head=document.createElement('div');const label=document.createElement('span');label.className='genre-label';label.textContent=`${i+1}위 · ${item.genre.name}`;const desc=document.createElement('small');desc.textContent=item.genre.desc;head.append(label,desc);const num=document.createElement('span');num.className='genre-score';num.textContent=item.score===null?'':String(item.score);const bar=document.createElement('div');bar.className='bar-track';const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=`${item.score||0}%`;bar.append(fill);if(item.score===null)bar.hidden=true;row.append(head,num,bar);genres.append(row);
 });
 const axes=$('axis-results');axes.replaceChildren();if(!share){Object.entries(result.axes).sort((a,b)=>b[1]-a[1]).slice(0,state.mode==='deep'?8:3).forEach(([k,v])=>{const item=document.createElement('div');item.className='axis-line';const span=document.createElement('span');span.textContent=AXES[k];const track=document.createElement('div');track.className='axis-track';const fill=document.createElement('i');fill.style.width=v+'%';track.append(fill);const b=document.createElement('b');b.textContent=v;item.append(span,track,b);axes.append(item);});}else{const p=document.createElement('p');p.className='fine-print';p.textContent='공유 링크에는 답변과 취향 세부 정보가 들어 있지 않습니다.';axes.append(p);}
 const margin=!share?picks[0].score-picks[1].score:null;$('result-insight').textContent=share?'공유된 결과는 요약 정보만 표시합니다.':margin<=4?`상위 두 장르의 점수 차이가 ${margin}점으로 작아요. 두 스타일 모두 살펴보세요.`:`${AXES[Object.keys(result.axes).sort((a,b)=>result.axes[b]-result.axes[a])[0]]}에 대한 선호가 상대적으로 강하게 나타났어요.`;
 $('result-extra-analysis').hidden=Boolean(share)||state.mode!=='deep';
 $('axis-note').textContent=!share&&state.mode==='deep'?'공통 객관식 16문항과 5단계 선호 응답 24문항을 함께 계산한 상대적 취향 지표입니다.':'선택한 답변에서 상대적으로 자주 나타난 선호입니다.';
 if(!share&&state.mode==='deep'){$('deep-plus').textContent='추천을 이해할 때는 점수뿐 아니라 불편을 느낄 조건도 확인하세요. ‘'+AXES[Object.keys(result.axes).sort((a,b)=>result.axes[a]-result.axes[b])[0]]+'’의 우선순위는 비교적 낮았어요. 장르 내부에서도 차종별 차이가 크니 실제로 확인해 보세요.'+(result.unrated?' 경험이 없어 판단을 보류한 '+result.unrated+'개 문항은 점수 계산에서 제외했어요.':'');}
 const mod=$('model-examples');mod.replaceChildren();picks.slice(0,2).forEach(x=>{if(!x.genre)return;const p=document.createElement('div');p.className='model-item';const b=document.createElement('b');b.textContent=x.genre.name;const small=document.createElement('span');small.textContent=x.genre.models.join(' · ');p.append(b,small);mod.append(p);});
 drawSignature($('dna-signature-svg'),displayAxesForResult(result));
 document.querySelector('.signature-footnote').textContent=share?'공유된 장르 요약으로 만든 패턴 · 세부 점수 제외':'나의 여덟 가지 라이딩 취향';
 $('dna-signature-svg').setAttribute('aria-label',share?'공유된 추천 장르를 바탕으로 만든 장식 패턴':'8가지 라이딩 취향 지표에 따라 만들어진 도형');
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
function revealPersonality(){
 const card=$('mbti-card');card.classList.remove('mbti-revealing');
 requestAnimationFrame(()=>{if(state.screen!=='result')return;
  card.scrollIntoView({block:'start',behavior:'instant'});
  if(motionEnabled())card.classList.add('mbti-revealing');
  $('mbti-title').focus({preventScroll:true});
 });
}
function renderMbti(){const total=mbtiTotal(),at=state.personalityIndex,question=PERSONALITY_ITEMS[at];if(!question){show('result');return;}
 $('mbti-progress-label').textContent=String(at+1).padStart(2,'0')+' / '+total;$('mbti-question').textContent=question.t;
 updateProgressMotion($('mbti-progress-track'));
 const percent=Math.round(at/total*100);$('mbti-progress-fill').style.width=percent+'%';$('mbti-progress-track').setAttribute('aria-valuenow',String(percent));
 const list=$('mbti-choices');list.replaceChildren();['전혀 아니다','아니다','보통이다','그렇다','매우 그렇다'].forEach((txt,i)=>{const b=document.createElement('button');b.type='button';b.className='likert-option';b.textContent=txt;b.classList.toggle('chosen',state.personality[at]===i-2);b.setAttribute('aria-pressed',String(state.personality[at]===i-2));b.addEventListener('click',()=>{state.personality[at]=i-2;if(at===total-1){const r=estimateMbti(total);state.estimated=r.type;state.estimateLength=total;show('result',{focus:false});revealPersonality();toast('예상 성격 유형을 추가했어요.');}else{state.personalityIndex++;show('mbti',{focus:false});}});list.append(b);});$('mbti-prev').disabled=at===0;
}
function renderManual(){const wrap=$('manual-pairs');wrap.replaceChildren();const labels=[['에너지 방향','E','I'],['정보 선호','S','N'],['판단 선호','T','F'],['생활 방식','J','P']];labels.forEach(([tag,a,b],index)=>{const row=document.createElement('div');row.className='manual-pair';const label=document.createElement('span');label.textContent=tag;row.append(label);[a,b].forEach(letter=>{const btn=document.createElement('button');btn.type='button';btn.textContent=letter;btn.classList.toggle('selected',state.manualDraft[index]===letter);btn.setAttribute('aria-pressed',String(state.manualDraft[index]===letter));btn.addEventListener('click',()=>{state.manualDraft[index]=letter;renderManual();persist();});row.append(btn);});wrap.append(row);});}
function manualSave(){if(state.manualDraft.some(x=>!x)){toast('4개 항목을 모두 골라 주세요.');return;}state.mbtiManual=state.manualDraft.join('');show('result');toast('입력한 MBTI를 별도로 표시했어요.');}
function shareData(){if(state.shared)return state.sharedData;const r=calculate();return {type:r.type,mode:state.mode,genres:r.genres.slice(0,2).map(x=>({id:x.genre.id})),estimated:state.estimated,self:state.mbtiManual};}
function allowedMBTI(s){return typeof s==='string'&&s.length===4&&['EI','SN','TF','JP'].every((p,i)=>p.includes(s[i])||s[i]==='?');}
function cleanSummary(d){
 if(!d||!Number.isInteger(d.type)||d.type<0||d.type>=TYPES.length||!['quick','deep'].includes(d.mode)||!Array.isArray(d.genres)||d.genres.length!==2)return null;
 const ids=d.genres.map(g=>g&&g.id);
 if(new Set(ids).size!==2||!ids.every(id=>GENRES.some(x=>x.id===id)))return null;
 return {type:d.type,mode:d.mode,genres:ids.map(id=>({id})),estimated:allowedMBTI(d.estimated)?d.estimated:null,self:allowedMBTI(d.self)&&!d.self.includes('?')?d.self:null};
}
function parseShared(){
 if(location.search.length>600)return false;
 const p=new URLSearchParams(location.search);
 if(!p.has('r')||!p.has('g'))return false;
 if(p.getAll('r').length!==1||p.getAll('g').length!==1)return false;
 const r=p.get('r'), ids=p.get('g').split(',');
 if(!/^(?:[0-9]|1[0-5])$/.test(r)||ids.length!==2)return false;
 const safe=cleanSummary({type:Number(r),mode:p.get('d')==='1'?'deep':'quick',genres:ids.map(id=>({id})),estimated:p.get('e'),self:p.get('s')});
 if(!safe)return false;
 state.shared=true;state.sharedData=safe;
 if(p.get('duo')==='1'){duoInvite=safe;saveInvite();}
 return true;
}
function baseShareUrl(d,opts={}){
 const safe=cleanSummary(d);if(!safe)throw Error('올바른 결과가 없습니다.');
 const u=new URL(location.pathname,location.origin);
 u.searchParams.set('r',String(safe.type));
 u.searchParams.set('g',safe.genres.map(g=>g.id).join(','));
 if(safe.mode==='deep')u.searchParams.set('d','1');
 if(opts.mbti){if(safe.estimated)u.searchParams.set('e',safe.estimated);if(safe.self)u.searchParams.set('s',safe.self);}
 if(opts.duo)u.searchParams.set('duo','1');
 return u.href;
}
function getShareOptions(){return {mbti:$('share-mbti').checked,duo:$('share-duo').checked};}
function shareLink(){return baseShareUrl(shareData(),getShareOptions());}
function displayShareOptions(){const d=cleanSummary(shareData());$('share-summary-type').textContent=TYPES[d.type][0];$('share-summary-genre').textContent=d.genres.map(g=>GENRES.find(x=>x.id===g.id)?.name).join(' · ');}
function openShare(invite=false){displayShareOptions();$('share-kakao').hidden=!kakaoConfigKey();$('kakao-unconfigured').hidden=Boolean(kakaoConfigKey());$('share-mbti').checked=false;$('share-duo').checked=invite;$('share-dialog-feedback').textContent='';$('share-dialog').showModal();}
async function nativeShare(){const url=shareLink();if(!navigator.share){await copyShare();return;}
 try{await navigator.share({title:'RIDE DNA — 나의 라이더 유형',text:`${TYPES[shareData().type][0]} · 내 라이딩 취향`,url});$('share-dialog-feedback').textContent='공유 메뉴에서 전송을 선택했어요.';}
 catch(e){if(e?.name!=='AbortError')await copyShare();}
}
async function copyShare(){const link=shareLink();let ok=false;
 try{await navigator.clipboard.writeText(link);ok=true;}catch{}
 if(!ok){const t=document.createElement('textarea');t.value=link;t.setAttribute('readonly','');t.style.position='fixed';t.style.top='-1000px';document.body.append(t);t.select();try{ok=document.execCommand('copy');}catch{}t.remove();}
 $('share-dialog-feedback').textContent=ok?'링크를 복사했어요.':`복사가 제한되었어요. 주소: ${link}`;
}
function kakaoConfigKey(){const key=window.RIDE_DNA_CONFIG?.kakaoJavaScriptKey;return typeof key==='string'&&/^[a-f\d]{32}$/i.test(key)?key:'';}
function preloadKakao(){
 if(!kakaoConfigKey()||window.Kakao||document.querySelector('script[data-kakao-sdk]'))return;
 const s=document.createElement('script');s.src='https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js';
 s.integrity='sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj';s.crossOrigin='anonymous';s.async=true;s.dataset.kakaoSdk='1';
 s.onload=()=>{try{if(window.Kakao&&!Kakao.isInitialized())Kakao.init(kakaoConfigKey());}catch{}};
 s.onerror=()=>{$('share-dialog-feedback').textContent='카카오 연결을 불러오지 못했어요. 링크 복사를 이용할 수 있어요.';};
 document.head.append(s);
}
function kakaoShare(){
 const k=kakaoConfigKey();if(!k){$('share-dialog-feedback').textContent='카카오 개발자 키가 아직 설정되지 않았어요. 기본 공유 메뉴를 이용할 수 있어요.';return;}
 if(!window.Kakao?.Share){preloadKakao();$('share-dialog-feedback').textContent='카카오 공유 기능을 준비하는 중이에요. 잠시 후 다시 눌러 주세요.';return;}
 try{
  if(!Kakao.isInitialized())Kakao.init(k);
  const d=cleanSummary(shareData()),url=shareLink();
  const first=GENRES.find(g=>g.id===d.genres[0].id)?.name;
  Kakao.Share.sendDefault({objectType:'feed',content:{title:`${TYPES[d.type][0]} · RIDE DNA`,description:`어울리는 바이크: ${first}${getShareOptions().mbti&&d.estimated?' · 예상 '+d.estimated:''}`,imageUrl:new URL('assets/social-preview.jpg',location.href).href,link:{mobileWebUrl:url,webUrl:url}},buttons:[{title:getShareOptions().duo?'친구와 비교하기':'라이더 결과 보기',link:{mobileWebUrl:url,webUrl:url}}]});
  $('share-dialog-feedback').textContent='카카오톡에서 대화 상대를 선택해 주세요.';
 }catch(e){$('share-dialog-feedback').textContent='카카오 설정 또는 도메인을 확인해 주세요. 링크 복사도 사용할 수 있어요.';}
}
function saveInvite(){try{if(duoInvite)sessionStorage.setItem(DUO_SESSION,JSON.stringify(duoInvite));else sessionStorage.removeItem(DUO_SESSION);}catch{}}
function loadInvite(){try{const s=sessionStorage.getItem(DUO_SESSION)||'';if(s.length>500)return null;return cleanSummary(JSON.parse(s));}catch{return null;}}
function openDuo(){
 if(state.shared){duoInvite=cleanSummary(shareData());saveInvite();}
 if(!duoInvite){openShare(true);return;}
 const own=state.shared?savedOwn:(state.completed?cleanSummary(shareData()):null);
 if(!own){$('share-dialog').close?.();action('choose');toast('내 라이더 유형을 찾은 뒤 친구와 비교할 수 있어요.');return;}
 show('duo');
}
function renderDuo(){
 const own=state.shared?savedOwn:(state.completed?cleanSummary(shareData()):null),f=duoInvite;
 if(!own||!f){show('result',{nav:'replace'});return;}
 $('duo-my-type').textContent=TYPES[own.type][0];$('duo-friend-type').textContent=TYPES[f.type][0];
 const names=d=>d.genres.map(g=>GENRES.find(x=>x.id===g.id)?.name||'—');
 $('duo-my-genre').textContent=names(own).join(' / ');$('duo-friend-genre').textContent=names(f).join(' / ');
 const same=own.genres.filter(g=>f.genres.some(x=>x.id===g.id)).map(x=>GENRES.find(y=>y.id===x.id)?.name);
 $('duo-match-heading').textContent=same.length?`공통으로 끌리는 스타일: ${same.join(' · ')}`:'서로 다른 스타일을 즐기는 조합';
 $('duo-match-description').textContent=same.length?'추천 장르에 공통점이 있어요. 서로 어떤 부분을 좋아하는지 이야기해 보세요.':'추천받은 상위 장르가 달라요. 이동 목적과 원하는 조작감을 비교해 보는 것도 재미있겠어요.';
 const tags=$('duo-common');tags.replaceChildren();[...new Set([...names(own),...names(f)])].forEach(name=>{const b=document.createElement('span');b.textContent=name;tags.append(b);});
}
function canvasWrap(ctx,str,x,y,maxWidth,font,lineHeight,linesMax=3){
 ctx.font=font;const lines=[];let acc='';for(const c of Array.from(str)){if(acc&&ctx.measureText(acc+c).width>maxWidth){lines.push(acc);acc=c;}else acc+=c;}if(acc)lines.push(acc);
 lines.slice(0,linesMax).forEach((line,i)=>ctx.fillText(line,x,y+i*lineHeight));return Math.min(lines.length,linesMax);
}
const IMAGE_SIZES={feed:[1080,1350],story:[1080,1920],square:[1080,1080]};
function createCard(){
 const choice=document.querySelector('input[name="studio-size"]:checked')?.value||'feed';
 const [w,h]=IMAGE_SIZES[choice]||IMAGE_SIZES.feed,c=$('studio-canvas'),ctx=c.getContext('2d');if(!ctx)return;
 c.width=w;c.height=h;const d=cleanSummary(shareData()),first=GENRES.find(x=>x.id===d.genres[0].id),second=GENRES.find(x=>x.id===d.genres[1].id);
 // 고정된 로컬 데이터만 캔버스에 그립니다. URL 문자열이나 사용자 HTML 삽입 없음.
 ctx.fillStyle='#101116';ctx.fillRect(0,0,w,h);
 const grd=ctx.createLinearGradient(0,0,w,h);grd.addColorStop(0,'#191921');grd.addColorStop(1,'#101116');ctx.fillStyle=grd;ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#DB4354';ctx.fillRect(0,0,13,h);ctx.fillRect(76,105,w-152,5);
 // Share card uses the same eight-axis static signature as the animated on-page pattern.
 const sigAxes=state.shared?displayAxesForResult(d):calculate().axes;
 const sigPts=signaturePoints(sigAxes);ctx.save();ctx.translate(w-168,205);ctx.scale(.70,.70);ctx.translate(-110,-110);
 ctx.strokeStyle='rgba(210,185,193,.18)';ctx.lineWidth=1.5;[44,76,103].forEach(r=>{ctx.beginPath();ctx.arc(110,110,r,0,Math.PI*2);ctx.stroke();});
 ctx.beginPath();sigPts.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));ctx.closePath();ctx.fillStyle='rgba(210,59,75,.20)';ctx.fill();ctx.strokeStyle='#ed7482';ctx.lineWidth=3;ctx.stroke();
 sigPts.forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,3.8,0,Math.PI*2);ctx.fillStyle='#f1a3ac';ctx.fill();});ctx.restore();
 const txt=(str,x,y,font,color)=>{ctx.fillStyle=color;ctx.font=font;ctx.fillText(str,x,y);};
 txt('RIDE DNA',76,192,'800 66px system-ui, sans-serif','#F4F2F1');
 txt(d.mode==='deep'?'DEEP RIDER REPORT':'RIDER ID CARD',76,247,'600 24px system-ui, sans-serif','#B9AFB6');
 const square=h===1080,top=square?300:h===1350?405:560,titleSize=square?64:82,lh=square?79:107;
 txt('MY RIDER TYPE',76,top,'700 27px system-ui, sans-serif','#DF7F8B');
 ctx.fillStyle='#F9F6F4';const count=canvasWrap(ctx,TYPES[d.type][0],76,top+100,w-152,`750 ${titleSize}px system-ui, sans-serif`,lh,3);
 const englishY=top+100+count*lh+32;
 txt(TYPES[d.type][1],76,englishY,'560 27px system-ui, sans-serif','#C7BFC5');
 const separator=square?640:h===1350?870:1120;
 ctx.fillStyle='#454149';ctx.fillRect(76,separator,w-152,2);
 txt('MOTORCYCLE MATCH',76,separator+66,'700 25px system-ui, sans-serif','#C4BAC0');
 ctx.fillStyle='#FFFFFF';canvasWrap(ctx,first?.name||'—',76,separator+139,w-152,`720 ${square?42:51}px system-ui, sans-serif`,63,2);
 txt(`2ND PICK   ${second?.name||'—'}`,76,separator+198,'550 28px system-ui, sans-serif','#CDC4C8');
 if($('studio-mbti').checked&&(d.estimated||d.self))txt(`MBTI   ${d.self||d.estimated}${d.self?' · 직접 입력':' · 비공식 예상'}`,76,separator+263,'600 26px system-ui, sans-serif','#F09BA6');
 ctx.fillStyle='#514C53';ctx.fillRect(76,h-130,w-152,2);
 txt('RIDE DNA  /  EST. 2026',76,h-68,'500 23px system-ui, sans-serif','#ADA5AC');
 cardFile=null;const version=++imageVersion;
 c.toBlob(blob=>{if(blob&&version===imageVersion)cardFile=new File([blob],`RIDE_DNA_${choice.toUpperCase()}.png`,{type:'image/png'});},'image/png');
}
function openStudio(){if($('share-dialog').open)$('share-dialog').close();$('studio-feedback').textContent='';$('studio-mbti').checked=false;document.querySelector('input[value="feed"][name="studio-size"]').checked=true;$('studio-dialog').showModal();createCard();}
function downloadCard(){const c=$('studio-canvas');try{const a=document.createElement('a');a.download=`RIDE_DNA_${(document.querySelector('input[name="studio-size"]:checked')?.value||'feed').toUpperCase()}.png`;a.href=c.toDataURL('image/png');document.body.append(a);a.click();a.remove();$('studio-feedback').textContent='PNG 저장을 요청했어요.';}catch{$('studio-feedback').textContent='저장할 수 없어요. 브라우저의 공유 기능을 이용해 주세요.';}}
async function sendCard(){if(!cardFile){$('studio-feedback').textContent='이미지를 준비하는 중이에요. 잠시 뒤 다시 눌러 주세요.';return;}
 if(!navigator.share||!navigator.canShare?.({files:[cardFile]})){$('studio-feedback').textContent='이 브라우저는 이미지 공유를 지원하지 않아요. PNG 저장을 이용해 주세요.';return;}
 try{await navigator.share({files:[cardFile],title:'RIDE DNA · 라이더 카드'});$('studio-feedback').textContent='공유 메뉴를 열었어요.';}catch(e){if(e.name!=='AbortError')$('studio-feedback').textContent='공유할 수 없어요. PNG 저장을 이용해 주세요.';}
}
function action(name){if(name==='home'){state.shared=false;state.sharedData=null;history.replaceState({rideDna:true,screen:'home'},'',location.pathname);show('home');return;}
 if(name==='choose'){show('choose');return;}if(name==='duo'){openDuo();return;}if(name==='quick'||name==='deep'){chooseMode(name);return;}
 if(name==='resume'){show('quiz');return;}if(name==='restart'){state.shared=false;state.sharedData=null;state=blankState();history.replaceState({rideDna:true,screen:'choose'},'',location.pathname);show('choose');return;}
 if(name==='upgrade'){upgrade();return;}if(name==='result'){show('result');return;}
 if(name==='mbti-test'){if(state.estimateLength===8&&state.mode==='deep'&&state.personality.slice(0,8).every(v=>v!==null)){state.personalityIndex=8;}else{state.personalityIndex=0;state.personality=Array(20).fill(null);}show('mbti');return;}
 if(name==='mbti-manual'){state.manualDraft=state.mbtiManual?state.mbtiManual.split(''):[null,null,null,null];show('manual');return;}}
setMotionMode(readMotionMode(),{save:false});
$('motion-settings-button').addEventListener('click',openMotionSettings);
$('motion-close').addEventListener('click',()=>$('motion-dialog').close());
document.querySelectorAll('input[name="motion-mode"]').forEach(x=>x.addEventListener('change',()=>setMotionMode(x.value)));
$('reveal-skip').addEventListener('click',()=>dismissReveal());
$('reveal-overlay').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dismissReveal();}});
$('motion-dialog').addEventListener('click',e=>{if(e.target===$('motion-dialog'))$('motion-dialog').close();});
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.action)));
$('quiz-exit').addEventListener('click',quit);$('quiz-prev').addEventListener('click',prev);
$('exit-cancel').addEventListener('click',()=>$('exit-dialog').close());$('exit-confirm').addEventListener('click',()=>{$('exit-dialog').close();show('home');});
$('mbti-prev').addEventListener('click',()=>{state.personalityIndex=Math.max(0,state.personalityIndex-1);show('mbti');});
$('manual-save').addEventListener('click',manualSave);
$('share-button').addEventListener('click',()=>openShare(false));$('image-button').addEventListener('click',openStudio);
$('duo-button').addEventListener('click',openDuo);$('duo-share-button').addEventListener('click',()=>openShare(true));
$('share-kakao').addEventListener('click',kakaoShare);$('share-native').addEventListener('click',nativeShare);$('share-copy').addEventListener('click',copyShare);
$('share-open-studio').addEventListener('click',openStudio);$('studio-download').addEventListener('click',downloadCard);$('studio-native').addEventListener('click',sendCard);
document.querySelectorAll('input[name="studio-size"],#studio-mbti').forEach(x=>x.addEventListener('change',createCard));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close)?.close()));
['share-dialog','studio-dialog'].forEach(id=>$(id).addEventListener('click',e=>{if(e.target===$(id))$(id).close();}));
$('studio-dialog').addEventListener('close',()=>{imageVersion++;cardFile=null;const c=$('studio-canvas');c.width=1;c.height=1;});
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
restore();
if(state.completed&&!state.shared){savedOwn=cleanSummary(shareData());}
duoInvite=loadInvite();
if(parseShared())show('result',{nav:'replace',focus:false});else show(state.screen,{nav:'replace',focus:false});
preloadKakao();
