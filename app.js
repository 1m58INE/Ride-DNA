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
const SAVE_KEY='ride-dna-quiz-v1.2';
const LEGACY_SAVE_KEY='ride-dna-quiz-v1';
let state={completed:false,screen:'home',answers:Array(QUESTIONS.length).fill(null),qIndex:0,adaptive:[],adaptIndex:0,adaptAnswers:[],personality:Array(MBTI_QUESTIONS.length).fill(null),personalityIndex:0,mbti:null,mbtiSource:null,shared:false};
const $=id=>document.getElementById(id);const screens={home:$('home-screen'),quiz:$('quiz-screen'),result:$('result-screen'),mbti:$('mbti-screen'),manual:$('manual-screen')};
function save(){
 if(state.shared)return; // Opening a friend's shared result must not erase one's own in-progress test.
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{}
}
function restore(){
 try{
  const text=localStorage.getItem(SAVE_KEY)||sessionStorage.getItem(LEGACY_SAVE_KEY);
  const data=JSON.parse(text||'null');
  if(!data||!Array.isArray(data.answers)||data.answers.length!==QUESTIONS.length)return;
  if(!data.answers.every(x=>x===null||(Number.isInteger(x)&&x>=0&&x<4)))return;
  Object.assign(state,data);
  if(!Array.isArray(state.adaptive))state.adaptive=[];
  if(!Array.isArray(state.adaptAnswers))state.adaptAnswers=[];
  if(!Array.isArray(state.personality)||state.personality.length!==12)state.personality=Array(12).fill(null);
  if(!Number.isInteger(state.qIndex)||state.qIndex<0||state.qIndex>20)state.qIndex=0;
  if(!Number.isInteger(state.adaptIndex)||state.adaptIndex<0||state.adaptIndex>=Math.max(1,state.adaptive.length))state.adaptIndex=0;
  if(!Number.isInteger(state.personalityIndex)||state.personalityIndex<0||state.personalityIndex>11)state.personalityIndex=0;
  if(!screens[state.screen]||state.screen==='manual')state.screen='home';
  if(state.screen==='result'&&!state.completed)state.screen='home';
  state.shared=false;
  if(!localStorage.getItem(SAVE_KEY))save();
 }catch{}
}
function hasUnfinishedQuiz(){return !state.completed&&!state.shared&&(state.answers.some(x=>x!==null)||state.qIndex>0);}
function updateHomeCta(){const active=hasUnfinishedQuiz();$('hero-cta-label').textContent=active?'이어서 테스트하기':'내 라이더 유형 찾기';$('hero-reset').hidden=!active;}
function route(){return {rideDna:true,screen:state.screen,qIndex:state.qIndex,adaptIndex:state.adaptIndex,personalityIndex:state.personalityIndex};}
function show(screen,{focus=true,nav='push'}={}){
 if(!screens[screen])screen='home';
 if(screen!=='quiz'){clearTimeout(answerTimer);answerLocked=false;}
 state.screen=screen;
 document.body.setAttribute('data-view',screen);
 updateHomeCta();
 for(const [name,el] of Object.entries(screens))el.hidden=name!==screen;
 window.scrollTo(0,0);
 if(screen==='quiz')renderQuestion();
 if(screen==='result')renderResult();
 if(screen==='mbti')renderMbti();
 if(screen==='manual')renderManual();
 save();
 if(nav!=='silent'){
  const now=route(),prior=history.state;
  const changed=!prior?.rideDna||Object.keys(now).some(k=>now[k]!==prior[k]);
  if(nav==='replace')history.replaceState(now,'');
  else if(changed)history.pushState(now,'');
 }
 if(focus){const target=screens[screen].querySelector('h1[tabindex],h2[tabindex]');if(target)requestAnimationFrame(()=>target.focus({preventScroll:true}));}
}
function start(){
 state={completed:false,screen:'quiz',answers:Array(20).fill(null),qIndex:0,adaptive:[],adaptIndex:0,adaptAnswers:[],personality:Array(12).fill(null),personalityIndex:0,mbti:null,mbtiSource:null,shared:false};
 history.replaceState({rideDna:true,screen:'home',qIndex:0,adaptIndex:0,personalityIndex:0},'',location.pathname);
 show('quiz');
}
function quitQuiz(){
 const modal=$('exit-dialog');
 if(typeof modal.showModal==='function')modal.showModal();
 else if(confirm('테스트를 나갈까요? 답변은 이 브라우저에 보관됩니다.'))show('home');
}
let answerLocked=false,answerTimer=null;
function renderQuestion(){clearTimeout(answerTimer);answerLocked=false;const isExtra=state.qIndex>=QUESTIONS.length;let q;
 if(!isExtra){q=QUESTIONS[state.qIndex];$('quiz-stage').textContent='라이더 성향';$('quiz-progress-label').textContent=String(state.qIndex+1).padStart(2,'0')+' / 20';$('quiz-progress').setAttribute('aria-valuenow',String(Math.round((state.qIndex/20)*100)));$('quiz-progress-fill').style.width=(state.qIndex/20*100)+'%';$('quiz-helper').textContent='답변을 선택하면 다음 질문으로 이동해요.';}else{q=state.adaptive[state.adaptIndex];if(!q){finish();return;}$('quiz-stage').textContent='추가 취향 확인';$('quiz-progress-label').textContent=String(state.adaptIndex+1)+' / '+state.adaptive.length;$('quiz-progress').setAttribute('aria-valuenow',String(Math.round(100*(state.adaptIndex+1)/(state.adaptive.length+1))));$('quiz-progress-fill').style.width=(state.adaptIndex+1)/(state.adaptive.length+1)*100+'%';$('quiz-helper').textContent='가까운 두 장르를 구분하기 위한 추가 질문이에요.';}
 $('question-category').textContent=isExtra?'선호가 가까운 장르가 있어요':q.c;$('question-title').textContent=isExtra?'둘 중 어느 쪽이 조금 더 끌리나요?':q.t;$('question-hint').textContent=isExtra?'어느 쪽도 아니라면 비슷하다고 선택해도 괜찮아요.':q.h;
 const choices=isExtra?[q.options[0],q.options[1],'두 가지 모두 비슷하게 끌린다']:q.a.map(x=>x.label);const el=$('answers');el.replaceChildren();choices.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='answer';b.append(document.createTextNode(v));const selected=isExtra?state.adaptAnswers[state.adaptIndex]:state.answers[state.qIndex];if(selected===i)b.classList.add('chosen');b.setAttribute('aria-pressed',selected===i?'true':'false');b.addEventListener('click',()=>chooseAnswer(i));el.append(b);});$('quiz-prev').disabled=state.qIndex===0;
}
function chooseAnswer(i){
 if(state.screen!=='quiz'||answerLocked||!Number.isInteger(i))return;
 const allowed=state.qIndex<20?4:3;
 if(i<0||i>=allowed)return;
 answerLocked=true;
 const selected=$('answers').children[i];
 if(selected){document.querySelectorAll('#answers .answer').forEach(b=>{b.classList.remove('chosen');b.setAttribute('aria-pressed','false');});selected.classList.add('chosen');selected.setAttribute('aria-pressed','true');}
 answerTimer=setTimeout(()=>commitAnswer(i),290);
}
function commitAnswer(i){if(state.qIndex<20){state.answers[state.qIndex]=i;if(state.qIndex<19){state.qIndex++;show('quiz',{focus:false});return;}initAdaptive();}else{state.adaptAnswers[state.adaptIndex]=i;if(state.adaptIndex<state.adaptive.length-1){state.adaptIndex++;show('quiz',{focus:false});return;}if(state.adaptive.length===2){const res=calculate();if(res.genres[0].score-res.genres[1].score<=4){const next=buildAdaptive(res,2);if(next.length){state.adaptive.push(...next);state.adaptIndex++;state.qIndex=20;show('quiz',{focus:false});return;}}}finish();}}
function initAdaptive(){const res=calculate();if(res.genres[0].score-res.genres[1].score<=8){state.adaptive=buildAdaptive(res,2);state.adaptIndex=0;state.adaptAnswers=[];if(state.adaptive.length){state.qIndex=20;show('quiz',{focus:false});return;}}finish();}
function buildAdaptive(res,count){const a=res.genres[0].genre,b=res.genres[1].genre;const used=new Set(state.adaptive.map(x=>x.axis));const order=K.map(k=>({k,dist:Math.abs(a.profile[k]-b.profile[k])})).filter(x=>x.dist>=15&&!used.has(x.k)).sort((x,y)=>y.dist-x.dist);return order.slice(0,count).map(x=>({axis:x.k,options:ADAPTIVE_AXES[x.k]}));}
function rawAxes(){const sum=Object.fromEntries(K.map(k=>[k,0]));let solo=0;QUESTIONS.forEach((q,i)=>{const c=q.a[state.answers[i]];if(!c)return;Object.entries(c.w).forEach(([k,v])=>sum[k]+=v);solo+=c.solo;});const peak=Math.max(...Object.values(sum),1);const axes=Object.fromEntries(K.map(k=>[k,Math.round(12+88*(sum[k]/peak))]));state.adaptive.forEach((q,i)=>{const ans=state.adaptAnswers[i];if(ans===0)axes[q.axis]=Math.min(100,axes[q.axis]+10);if(ans===1)axes[q.axis]=Math.max(0,axes[q.axis]-10);});return {axes,solo};}
function calculate(){const {axes,solo}=rawAxes();const weighted={city:1.1,touring:1.1,agility:1.15,comfort:1.1,versatility:1.2,expression:.94,practicality:1.04,sportiness:1.05};const genres=GENRES.map(genre=>{let diff=0,n=0;K.forEach(k=>{diff+=weighted[k]*(axes[k]-genre.profile[k])**2;n+=weighted[k];});const score=Math.max(0,Math.round(100-Math.sqrt(diff/n)));return {genre,score};}).sort((a,b)=>b.score-a.score||a.genre.id.localeCompare(b.genre.id));
 const mid={explore:(axes.touring+axes.versatility-axes.city-axes.practicality)/2,active:(axes.agility+axes.sportiness)/2-axes.comfort,express:axes.expression-axes.practicality,solo};const flags=[mid.explore>8,mid.active>8,mid.express>8,solo>=2];const idx=flags.reduce((n,f,i)=>n+(f?(8>>i):0),0);const neutral=Object.entries(mid).filter(([k,v])=>Math.abs(v)<(k==='solo'?2:8)).map(([k])=>k);return {axes,genres,type:idx,neutral};}
function finish(){state.qIndex=20;state.completed=true;show('result');}
function renderResult(){const shared=state.shared&&state.sharedData;const res=shared?state.sharedData:calculate();const type=TYPES[res.type]||TYPES[0];$('result-serial').textContent='TYPE '+String(res.type+1).padStart(2,'0')+' / 16';$('result-title').textContent=type[0];$('result-english').textContent=type[1];$('result-description').textContent=type[2]+(!shared&&res.neutral.length?' 여러 성향이 비슷하게 나타나 결과를 혼합형으로도 볼 수 있어요.':'');$('shared-note').hidden=!shared;
 const top=shared?GENRES.find(g=>g.id===res.genres[0]?.id):res.genres[0]?.genre;
 const second=shared?GENRES.find(g=>g.id===res.genres[1]?.id):res.genres[1]?.genre;
 $('result-best-genre').textContent=top?.name||'—';
 $('result-next-genre').textContent=second?.name||'—';
 const genreEl=$('genre-results');genreEl.replaceChildren();const picks=shared?res.genres:res.genres.slice(0,2);picks.forEach((g,i)=>{const item=shared?GENRES.find(x=>x.id===g.id):g.genre;if(!item)return;const s=shared?null:g.score;const e=document.createElement('div');e.className='genre-row';e.innerHTML='<div><span class="genre-label"></span><small></small></div><span class="genre-score"></span><div class="bar-track"><div class="bar-fill"></div></div>';e.querySelector('.genre-label').textContent=(i?'두 번째 취향 · ':'가장 가까운 취향 · ')+item.name;e.querySelector('small').textContent=item.desc;e.querySelector('.genre-score').textContent=s===null?'—':s;e.querySelector('.genre-score').append(Object.assign(document.createElement('sup'),{textContent:s===null?'':'/100'}));e.querySelector('.bar-fill').style.width=(s===null?0:s)+'%';if(shared)e.querySelector('.bar-track').hidden=true;genreEl.append(e);});
 const ax=$('axis-results');ax.replaceChildren();$('axis-note').textContent=shared?'공유 링크에는 개별 설문 응답과 선호 지표가 포함되지 않아요.':'응답에서 상대적으로 강하게 나타난 선호입니다. 절대적인 능력이나 성격 점수가 아니에요.';if(!shared){Object.entries(res.axes).sort((a,b)=>b[1]-a[1]).slice(0,5).forEach(([k,v])=>{const el=document.createElement('div');el.className='axis-line';const label=document.createElement('span');label.textContent=AXES[k];const track=document.createElement('div');track.className='axis-track';const fill=document.createElement('i');fill.style.width=v+'%';track.append(fill);const score=document.createElement('b');score.textContent=v;el.append(label,track,score);ax.append(el);});}else{const p=document.createElement('p');p.className='fine-print';p.textContent='이 링크는 결과 요약만 공유합니다. 나의 취향 지도를 보려면 직접 테스트해 보세요.';ax.append(p);}
 const mb=shared?res.mbti:state.mbti;$('mbti-result').hidden=!mb;$('mbti-result').replaceChildren();if(mb){$('mbti-result').append(document.createTextNode(mb),Object.assign(document.createElement('small'),{textContent:shared?'공유자가 선택적으로 포함한 성격 유형':state.mbtiSource==='manual'?'본인이 직접 선택한 MBTI':'12문항 독자 검사 기반 · 비공식 경향 추정'}));} document.querySelectorAll('.mbti-actions').forEach(x=>x.hidden=Boolean(shared));
 const modelEl=$('model-examples');modelEl.replaceChildren();const div=document.createElement('div');div.className='model-list';picks.forEach((g,i)=>{const genre=shared?GENRES.find(x=>x.id===g.id):g.genre;if(!genre)return;const p=document.createElement('div');p.className='model-item';const t=document.createElement('b');t.textContent=genre.name;const f=document.createElement('span');f.textContent=genre.models.join(' · ');p.append(t,f);div.append(p);});modelEl.append(div);$('share-feedback').textContent='';}
function selectPrev(){clearTimeout(answerTimer);answerLocked=false;if(state.qIndex===0)return;if(state.qIndex>=20){if(state.adaptIndex>0){state.adaptIndex--;}else{state.qIndex=19;}}else{state.qIndex--;}show('quiz');$('question-title').focus({preventScroll:true});}
function renderMbti(){
 $('mbti-progress-label').textContent=String(state.personalityIndex+1).padStart(2,'0')+' / 12';
 const percent=state.personalityIndex/12*100;
 $('mbti-progress-fill').style.width=percent+'%';
 $('mbti-progress-track').setAttribute('aria-valuenow',String(Math.round(percent)));
 const q=MBTI_QUESTIONS[state.personalityIndex];$('mbti-question').textContent=q.t;
 const wrap=$('mbti-choices');wrap.replaceChildren();
 ['전혀 아니다','아니다','보통이다','그렇다','매우 그렇다'].forEach((label,i)=>{
  const b=document.createElement('button');b.type='button';b.className='likert-option';
  const number=document.createElement('strong');number.textContent=String(i+1);
  const name=document.createElement('span');name.textContent=label;b.append(number,name);
  const was=state.personality[state.personalityIndex]===i-2;
  b.classList.toggle('chosen',was&&state.personality[state.personalityIndex]!==null);
  b.setAttribute('aria-pressed',b.classList.contains('chosen')?'true':'false');
  b.addEventListener('click',()=>{
   state.personality[state.personalityIndex]=i-2;
   if(state.personalityIndex===11){finishMbti();return;}
   state.personalityIndex++;show('mbti');
  });wrap.append(b);
 });$('mbti-prev').disabled=state.personalityIndex===0;
}
function finishMbti(){const sum={EI:0,SN:0,TF:0,JP:0};MBTI_QUESTIONS.forEach((q,i)=>{sum[q.a]+=(state.personality[i]??0)*(q.r?-1:1);});const parts=[['EI','E','I'],['SN','N','S'],['TF','T','F'],['JP','J','P']];state.mbti=parts.map(([k,pos,neg])=>sum[k]>=2?pos:sum[k]<=-2?neg:'?').join('');state.mbtiSource='estimated';show('result');toast(state.mbti.includes('?')?'비슷한 성향은 ?로 표시했어요.':'성격 경향 결과를 추가했어요.');}
function renderManual(){const pairs=[['에너지 방향','E','I'],['정보를 보는 방식','S','N'],['판단에서 우선하는 것','T','F'],['생활 방식','J','P']];const wrap=$('manual-pairs');wrap.replaceChildren();pairs.forEach(([label,l,r],i)=>{const row=document.createElement('div');row.className='manual-pair';const s=document.createElement('span');s.textContent=label;const start=document.createElement('button'),end=document.createElement('button');start.type=end.type='button';start.textContent=l;end.textContent=r;let val=state.manualDraft?.[i];start.classList.toggle('selected',val===l);end.classList.toggle('selected',val===r);start.addEventListener('click',()=>updateManual(i,l));end.addEventListener('click',()=>updateManual(i,r));row.append(s,start,end);wrap.append(row);});}
function updateManual(i,v){if(!state.manualDraft)state.manualDraft=[null,null,null,null];state.manualDraft[i]=v;renderManual();save();}
function saveManual(){if(!state.manualDraft||state.manualDraft.some(x=>!x)){toast('4가지 항목을 모두 선택해 주세요.');return;}state.mbti=state.manualDraft.join('');state.mbtiSource='manual';show('result');toast('입력한 MBTI를 결과에 추가했어요.');}
function toast(message){const el=$('toast');el.textContent=message;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,3500);}
function shareData(){if(state.shared)return state.sharedData;const res=calculate();return {type:res.type,genres:res.genres.slice(0,2).map(x=>({id:x.genre.id})),mbti:state.mbti||null};}
function buildShareLink(){const v=shareData();const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('r',String(v.type));url.searchParams.set('g',v.genres.map(x=>x.id).join(','));if(v.mbti)url.searchParams.set('m',v.mbti);return url.toString();}
async function share(){const url=buildShareLink();if(navigator.share){try{await navigator.share({title:'RIDE DNA — 내 라이더 유형',text:'나의 라이더 스타일을 확인해 보세요.',url});$('share-feedback').textContent='결과를 공유했어요.';return;}catch(e){if(e.name==='AbortError')return;}}try{await navigator.clipboard.writeText(url);$('share-feedback').textContent='결과 링크를 복사했어요.';}catch{const t=document.createElement('textarea');t.value=url;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();$('share-feedback').textContent=ok?'결과 링크를 복사했어요.':url;}}
function downloadImage(){
 const data=shareData(),canvas=document.createElement('canvas');
 canvas.width=1080;canvas.height=1350;
 const c=canvas.getContext('2d');if(!c){toast('이 브라우저에서는 이미지 저장이 지원되지 않아요.');return;}
 const x=78,edge=1002;
 const draw=(t,y,font,color)=>{c.fillStyle=color;c.font=font;c.fillText(String(t),x,y);};
 const wrap=(value,top,maxWidth,font,lineHeight,maxLines=2)=>{
  c.font=font;
  let current='',lines=[];
  for(const letter of Array.from(value)){
   if(current&&c.measureText(current+letter).width>maxWidth){lines.push(current);current=letter;}
   else current+=letter;
  }
  if(current)lines.push(current);
  const selected=lines.slice(0,maxLines);
  selected.forEach((part,i)=>draw(part,top+i*lineHeight,font,'#f2eeec'));
  return top+(selected.length-1)*lineHeight;
 };
 c.fillStyle='#111114';c.fillRect(0,0,1080,1350);
 c.fillStyle='#242128';c.fillRect(0,0,1080,14);
 c.fillStyle='#d23b4b';c.fillRect(0,0,275,14);
 draw('RIDE DNA',150,'850 70px system-ui, sans-serif','#f2eeec');
 c.textAlign='right';c.fillStyle='#b9acb3';c.font='550 27px system-ui,sans-serif';
 c.fillText('TYPE '+String(data.type+1).padStart(2,'0')+' / 16',edge,145);c.textAlign='left';
 c.strokeStyle='#474048';c.lineWidth=2;c.beginPath();c.moveTo(x,210);c.lineTo(edge,210);c.stroke();
 draw('나의 라이더 유형',292,'600 28px system-ui,sans-serif','#db969f');
 const title=TYPES[data.type]?.[0]||'나의 라이더 유형';
 const endTitle=wrap(title,421,915,'760 86px system-ui,sans-serif',113,2);
 draw(TYPES[data.type]?.[1]||'',Math.max(570,endTitle+95),'620 29px system-ui,sans-serif','#d2bdc4');
 c.strokeStyle='#474048';c.beginPath();c.moveTo(x,690);c.lineTo(edge,690);c.stroke();
 draw('가장 가까운 바이크 스타일',766,'540 27px system-ui,sans-serif','#ada3aa');
 const gs=data.genres.map(g=>GENRES.find(x=>x.id===g.id)?.name).filter(Boolean);
 wrap(gs[0]||'—',856,920,'760 62px system-ui,sans-serif',72,2);
 draw('함께 추천하는 스타일',965,'540 26px system-ui,sans-serif','#ada3aa');
 wrap(gs[1]||'—',1034,920,'660 43px system-ui,sans-serif',56,2);
 if(data.mbti)draw('성격 유형  '+data.mbti,1143,'610 28px system-ui,sans-serif','#e7b0b8');
 c.fillStyle='#37323a';c.fillRect(x,1213,edge-x,2);
 draw('당신만의 라이딩 취향을 찾아보세요.',1267,'500 25px system-ui,sans-serif','#aba0a8');
 draw('RIDE DNA  ·  비공식 취향 테스트',1310,'480 20px system-ui,sans-serif','#898188');
 try{const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='RIDE_DNA_RESULT.png';document.body.append(a);a.click();a.remove();toast('결과 이미지를 저장했어요.');}
 catch{toast('이미지 저장에 실패했어요. 다시 시도해 주세요.');}
}
function parseShared(){const p=new URLSearchParams(location.search);if(!p.has('r')||!p.has('g'))return false;const n=Number(p.get('r'));const ids=p.get('g').split(',');const mb=p.get('m');if(!Number.isInteger(n)||n<0||n>=16||ids.length!==2||!ids.every(x=>GENRES.some(g=>g.id===x)))return false;const validMb=mb&&/^[EINSFTJP?]{4}$/.test(mb)&&["EI?".includes(mb[0]),"SN?".includes(mb[1]),"TF?".includes(mb[2]),"JP?".includes(mb[3])].every(Boolean)?mb:null;state.shared=true;state.sharedData={type:n,genres:ids.map(id=>({id})),mbti:validMb};return true;}
function action(name){if(name==='home'){show('home');return;}if(name==='start'){if(hasUnfinishedQuiz()){show('quiz');return;}start();return;}if(name==='restart'){start();return;}if(name==='result'){show('result');return;}if(name==='mbti-test'){state.personality=Array(12).fill(null);state.personalityIndex=0;show('mbti');return;}if(name==='mbti-manual'){state.manualDraft=state.mbtiSource==='manual'&&state.mbti?state.mbti.split(''):[null,null,null,null];show('manual');return;}}
document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action)));$('quiz-exit').addEventListener('click',quitQuiz);$('quiz-prev').addEventListener('click',selectPrev);$('mbti-prev').addEventListener('click',()=>{state.personalityIndex=Math.max(0,state.personalityIndex-1);show('mbti');$('mbti-question').focus({preventScroll:true});});$('manual-save').addEventListener('click',saveManual);$('share-button').addEventListener('click',share);$('image-button').addEventListener('click',downloadImage);
document.addEventListener('keydown',e=>{if($('exit-dialog').open||e.altKey||e.metaKey||e.ctrlKey||e.target.closest('input,select,textarea'))return;const k=Number(e.key);if(state.screen==='quiz'&&Number.isInteger(k)&&k>=1&&k<= (state.qIndex>=20?3:4)){chooseAnswer(k-1);e.preventDefault();}if(state.screen==='mbti'&&k>=1&&k<=5){const b=$('mbti-choices').children[k-1];if(b)b.click();}});
$('exit-cancel').addEventListener('click',()=>$('exit-dialog').close());
$('exit-confirm').addEventListener('click',()=>{$('exit-dialog').close();show('home');});
window.addEventListener('popstate',e=>{
 const r=e.state;if(!r?.rideDna||!screens[r.screen])return;
 if(Number.isInteger(r.qIndex))state.qIndex=Math.max(0,Math.min(20,r.qIndex));
 if(Number.isInteger(r.adaptIndex))state.adaptIndex=Math.max(0,Math.min(Math.max(0,state.adaptive.length-1),r.adaptIndex));
 if(Number.isInteger(r.personalityIndex))state.personalityIndex=Math.max(0,Math.min(11,r.personalityIndex));
 show(r.screen,{nav:'silent'});
});
restore();
if(parseShared())show('result',{nav:'replace',focus:false});
else {state.shared=false;show(state.screen,{nav:'replace',focus:false});}
