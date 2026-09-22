import { Invocation } from './engine.mjs';

const messages = {
  en: {
    skip:'Skip to game',back:'Tony Schaffert',language:'Language',guideButton:'Operator guide',
    eyebrow:'FROM THE DAYS OF DOS. BACK FROM THE DARK.',edition:'BROWSER\nEDITION / 01',
    lead:'Some questions are better left unasked.',connection:'SESSION OPEN',
    welcome:'The terminal is listening. Address it, then ask your question.',
    petitionLabel:'The invocation',petitionHint:'Begin with “Lucifer, please answer my question.”',
    prayer:'Lucifer, please answer my question.',questionLabel:'Your question',
    questionPlaceholder:'Who is in the room with me?',summon:'Ask Lúcifer',reset:'New session',
    responseLabel:'TRANSMISSION RECEIVED',footerLeft:'ONE TERMINAL. MANY SECRETS.',
    originLabel:'A PIECE OF MY HISTORY',
    origin:'I created a version of Lúcifer in Brazil. This is my browser recreation of that old computer prank — a little nostalgia, a little theater, and a lot of fun with friends.',
    portfolio:'Back to my universe ↗',disclaimer:'A theatrical party trick. No supernatural powers.',
    guideEyebrow:'BEHIND THE CURTAIN',guideTitle:'You are the secret.',
    guideIntro:'Read this before inviting your audience. The operator supplies the answer; the invocation hides what they type.',
    instruction1:'Start a new session. In the invocation field, type a semicolon (;) to begin the hidden answer.',
    instruction2:'Type the answer you want Lúcifer to give. Your audience sees the invocation appear instead. Backspace corrects your hidden answer.',
    instruction3:'Type another semicolon (;) or press Enter to seal it. The invocation completes. Then type the question in the second field.',
    instruction4:'Choose “Ask Lúcifer.” After a short pause, your answer appears. “New session” clears everything for the next round.',
    exampleTitle:'TRY THIS',exampleAnswer:'You are wearing blue.',exampleQuestion:'Then ask: “What color am I wearing?”',
    practiceQuestion:'What color am I wearing?',
    guideNote:'Without a hidden answer, Lúcifer gives a mysterious stock reply. Nothing you type is sent to a server or saved. Keep it playful with people who enjoy the joke.',
    rehearse:'Load a practice round',practiceNote:'Loads the example answer and question so you can try the reveal.',
    closeGuide:'Close guide',waiting:'Listening to the silence…',working:'LISTENING',answered:'ANSWER DELIVERED',
    validation:'Complete the invocation and ask a question first.',
    fallbacks:['The answer is closer than you think.','The room has not yet given up its secrets.','Some things remain hidden. Ask again when the silence changes.','I hear your question. The answer chooses to remain in the shadows.']
  },
  'pt-BR': {
    skip:'Pular para o jogo',back:'Tony Schaffert',language:'Idioma',guideButton:'Guia do operador',
    eyebrow:'DOS TEMPOS DO DOS. DE VOLTA DAS SOMBRAS.',edition:'EDIÇÃO WEB\nVERSÃO / 01',
    lead:'Algumas perguntas é melhor não fazer.',connection:'SESSÃO ABERTA',
    welcome:'O terminal está ouvindo. Faça a invocação e depois a sua pergunta.',
    petitionLabel:'A invocação',petitionHint:'Comece com “Lúcifer, por favor, responda à minha pergunta.”',
    prayer:'Lúcifer, por favor, responda à minha pergunta.',questionLabel:'Sua pergunta',
    questionPlaceholder:'Quem está aqui comigo?',summon:'Perguntar a Lúcifer',reset:'Nova sessão',
    responseLabel:'TRANSMISSÃO RECEBIDA',footerLeft:'UM TERMINAL. MUITOS SEGREDOS.',
    originLabel:'UM PEDAÇO DA MINHA HISTÓRIA',
    origin:'Criei uma versão do Lúcifer no Brasil. Esta é a minha recriação daquela antiga pegadinha de computador para o navegador — um pouco de nostalgia, um pouco de teatro e muita diversão com os amigos.',
    portfolio:'Voltar ao meu universo ↗',disclaimer:'Uma brincadeira teatral. Sem poderes sobrenaturais.',
    guideEyebrow:'POR TRÁS DA CORTINA',guideTitle:'O segredo é você.',
    guideIntro:'Leia antes de chamar a plateia. O operador fornece a resposta; a invocação esconde o que ele digita.',
    instruction1:'Comece uma nova sessão. No campo da invocação, digite ponto e vírgula (;) para iniciar a resposta oculta.',
    instruction2:'Digite a resposta que você quer que Lúcifer dê. A plateia vê a invocação aparecer no lugar dela. Use Backspace para corrigir a resposta oculta.',
    instruction3:'Digite outro ponto e vírgula (;) ou pressione Enter para encerrar. A invocação se completa. Depois, digite a pergunta no segundo campo.',
    instruction4:'Escolha “Perguntar a Lúcifer”. Após uma breve pausa, a sua resposta aparece. “Nova sessão” apaga tudo para a próxima rodada.',
    exampleTitle:'EXPERIMENTE',exampleAnswer:'Você está vestindo azul.',exampleQuestion:'Depois pergunte: “Qual é a cor da minha roupa?”',
    practiceQuestion:'Qual é a cor da minha roupa?',
    guideNote:'Sem uma resposta oculta, Lúcifer dá uma resposta misteriosa pronta. Nada do que você digita é enviado a um servidor ou salvo. Brinque com quem também gosta da brincadeira.',
    rehearse:'Carregar uma rodada de teste',practiceNote:'Preenche a resposta e a pergunta do exemplo para você testar a revelação.',
    closeGuide:'Fechar guia',waiting:'Ouvindo o silêncio…',working:'OUVINDO',answered:'RESPOSTA ENTREGUE',
    validation:'Complete a invocação e faça uma pergunta primeiro.',
    fallbacks:['A resposta está mais perto do que você imagina.','Este lugar ainda não revelou seus segredos.','Algumas coisas permanecem ocultas. Pergunte novamente quando o silêncio mudar.','Eu ouvi a sua pergunta. A resposta prefere continuar nas sombras.']
  }
};
const $ = selector => document.querySelector(selector);
const petition=$('#petition'), question=$('#question'), form=$('#ritual');
const guide=$('#guide'), response=$('#response'), answer=$('#answer'), summon=$('#summon');
const cover=$('#composition-cover'), language=$('#language');
let locale='en', model=new Invocation(messages.en.prayer), timer, phase='ready', composing=false, compositionRange=[0,0];
const t=key=>messages[locale][key];
function sync(){
  petition.value=model.visible;
  petition.readOnly=model.mode==='sealed';
  if(!petition.readOnly && document.activeElement===petition)petition.setSelectionRange(petition.value.length,petition.value.length);
}
function clearRound(focus=true){
  clearTimeout(timer);timer=undefined;phase='ready';composing=false;cover.hidden=true;
  model.reset();petition.disabled=false;question.disabled=false;summon.disabled=false;
  sync();question.value='';answer.textContent='';response.hidden=true;response.classList.remove('is-waiting');
  $('#connection').textContent=t('connection');$('#error').textContent='';
  if(focus)petition.focus();
}
function setLanguage(next){
  locale=next in messages?next:'en';language.value=locale;model=new Invocation(t('prayer'));
  document.documentElement.lang=locale;
  document.title=locale==='pt-BR'?'Lúcifer — A pegadinha de computador está de volta | Tony Schaffert':'Lúcifer — A Brazilian Computer Prank, Reborn | Tony Schaffert';
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  petition.placeholder=t('prayer');question.placeholder=t('questionPlaceholder');
  $('#guide-close').setAttribute('aria-label',t('closeGuide'));
  $('#example-code').textContent=`;${t('exampleAnswer')};`;
  clearRound(false);
}
function insert(text,start=petition.selectionStart,end=petition.selectionEnd){
  if(phase!=='ready')return;
  model.insert(text,start,end);sync();
}
petition.addEventListener('beforeinput',event=>{
  if(composing||event.isComposing||!event.cancelable)return;
  if(phase!=='ready'||model.mode==='sealed'){event.preventDefault();return;}
  const type=event.inputType;
  if(type==='insertLineBreak'||type==='insertParagraph'){event.preventDefault();model.seal();sync();question.focus();return;}
  if(type.startsWith('insert')){
    const text=event.data??event.dataTransfer?.getData('text/plain');
    if(text!=null){event.preventDefault();insert(text);}
  }else if(type.startsWith('delete')){
    event.preventDefault();model.remove(petition.selectionStart,petition.selectionEnd,type.includes('Forward'));sync();
  }else if(type.startsWith('history'))event.preventDefault();
});
petition.addEventListener('keydown',event=>{
  if(event.key==='Enter'&&!event.isComposing){event.preventDefault();model.seal();sync();question.focus();}
});
petition.addEventListener('paste',event=>{
  event.preventDefault();insert(event.clipboardData?.getData('text/plain')??'');
});
petition.addEventListener('cut',event=>{
  event.preventDefault();if(model.mode==='sealed'||petition.selectionStart===petition.selectionEnd)return;
  event.clipboardData?.setData('text/plain',model.visible.slice(petition.selectionStart,petition.selectionEnd));
  model.remove(petition.selectionStart,petition.selectionEnd);sync();
});
petition.addEventListener('drop',event=>{event.preventDefault();insert(event.dataTransfer?.getData('text/plain')??'');});
petition.addEventListener('compositionstart',()=>{
  composing=true;compositionRange=[petition.selectionStart,petition.selectionEnd];
  cover.textContent=model.visible||t('prayer');cover.hidden=false;
});
petition.addEventListener('compositionend',event=>{
  if(!composing)return;
  composing=false;insert(event.data??'',...compositionRange);cover.hidden=true;
});
// Fallback for virtual keyboards whose edits do not produce cancellable beforeinput.
petition.addEventListener('input',()=>{
  if(composing)return;
  const actual=petition.value, previous=model.visible;
  if(actual===previous)return;
  let start=0;while(start<actual.length&&start<previous.length&&actual[start]===previous[start])start++;
  let a=actual.length,b=previous.length;
  while(a>start&&b>start&&actual[a-1]===previous[b-1]){a--;b--;}
  if(a===start)model.remove(start,b);else model.insert(actual.slice(start,a),start,b);
  sync();
});
form.addEventListener('submit',event=>{
  event.preventDefault();if(phase!=='ready')return;
  if(!model.visible.trim()||!question.value.trim()){
    $('#error').textContent=t('validation');(!model.visible.trim()?petition:question).focus();return;
  }
  $('#error').textContent='';
  const pool=t('fallbacks'),reply=model.result(pool[Math.floor(Math.random()*pool.length)]);
  sync();phase='waiting';petition.disabled=true;question.disabled=true;summon.disabled=true;
  response.hidden=false;response.classList.add('is-waiting');answer.textContent=t('waiting');$('#connection').textContent=t('working');
  timer=setTimeout(()=>{
    phase='answered';response.classList.remove('is-waiting');answer.textContent=reply;
    $('#connection').textContent=t('answered');model.reset();
  },1800);
});
$('#reset').addEventListener('click',()=>clearRound());
language.addEventListener('change',()=>setLanguage(language.value));
$('#guide-open').addEventListener('click',()=>{guide.showModal();document.body.classList.add('guide-open');});
$('#guide-close').addEventListener('click',()=>guide.close());
guide.addEventListener('close',()=>document.body.classList.remove('guide-open'));
guide.addEventListener('click',event=>{if(event.target===guide){const r=guide.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)guide.close();}});
$('#rehearse').addEventListener('click',()=>{
  clearRound(false);model.insert(`;${t('exampleAnswer')};`);sync();question.value=t('practiceQuestion');guide.close();summon.focus();
});
window.addEventListener('pagehide',()=>clearRound(false));
setLanguage(navigator.language?.toLowerCase().startsWith('pt')?'pt-BR':'en');
