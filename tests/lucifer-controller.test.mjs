import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Exercise the real event controller without introducing browser/test dependencies.
// Native layout and virtual-keyboard behavior still require device testing.
class Element {
  constructor(){this.value='';this.textContent='';this.hidden=false;this.disabled=false;this.readOnly=false;this.listeners={};this.dataset={};this.selectionStart=0;this.selectionEnd=0;this.attributes={};this.classList={add(){},remove(){}};}
  addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
  emit(name,data={}){const event={preventDefault(){this.defaultPrevented=true;},target:this,...data};for(const fn of this.listeners[name]??[])fn(event);return event;}
  focus(){document.activeElement=this;}
  setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
  setAttribute(k,v){this.attributes[k]=v;}
  showModal(){this.open=true;}
  close(){this.open=false;this.emit('close');}
}

test('real controller: typing, safe reveal, pending reset, language switch, fallback, rehearsal',async()=>{
  const html=await readFile(new URL('../dist/lucifer/index.html',import.meta.url),'utf8');
  const nodes=new Map([...html.matchAll(/id="([^"]+)"/g)].map(match=>['#'+match[1],new Element()]));
  const labels=[...html.matchAll(/data-i18n="([^"]+)"/g)].map(match=>{const el=new Element();el.dataset.i18n=match[1];return el;});
  const scheduled=new Map();let sequence=0;
  const original={document:globalThis.document,window:globalThis.window,setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout};
  globalThis.document={querySelector:s=>{assert.ok(nodes.has(s),`Missing HTML element ${s}`);return nodes.get(s);},querySelectorAll:()=>labels,documentElement:{},body:new Element(),activeElement:null};
  globalThis.window=new Element();globalThis.setTimeout=fn=>{scheduled.set(++sequence,fn);return sequence;};globalThis.clearTimeout=id=>scheduled.delete(id);
  try{
    await import('../dist/lucifer/game.mjs');
    const get=id=>nodes.get('#'+id), petition=get('petition');
    const type=text=>{petition.focus();petition.setSelectionRange(petition.value.length,petition.value.length);petition.emit('beforeinput',{cancelable:true,isComposing:false,inputType:'insertText',data:text});};
    const finish=()=>{for(const [id,fn] of [...scheduled]){scheduled.delete(id);fn();}};
    get('language').value='en';get('language').emit('change');
    for(const node of labels)assert.equal(typeof node.textContent,'string',`Missing translation ${node.dataset.i18n}`);
    type(';A blue shirt;');assert.equal(petition.value,'Lucifer, please answer my question.');assert.equal(petition.readOnly,true);
    get('question').value='What am I wearing?';get('ritual').emit('submit');assert.equal(get('summon').disabled,true);assert.ok(!get('answer').textContent.includes('blue'));
    finish();assert.equal(get('answer').textContent,'A blue shirt');
    get('reset').emit('click');assert.equal(petition.value,'');assert.equal(get('answer').textContent,'');assert.equal(get('response').hidden,true);
    type(';Should never appear;');get('question').value='Who?';get('ritual').emit('submit');get('reset').emit('click');finish();assert.equal(get('answer').textContent,'');
    get('language').value='pt-BR';get('language').emit('change');assert.equal(document.documentElement.lang,'pt-BR');
    get('rehearse').emit('click');assert.equal(get('question').value,'Qual é a cor da minha roupa?');get('ritual').emit('submit');finish();assert.equal(get('answer').textContent,'Você está vestindo azul.');
    get('reset').emit('click');type('Uma invocação normal');get('question').value='Quem?';get('ritual').emit('submit');finish();assert.ok(get('answer').textContent.length>0);assert.notEqual(get('answer').textContent,'Você está vestindo azul.');
    get('reset').emit('click');type(';<img src=x onerror=alert(1)>;');get('question').value='Teste';get('ritual').emit('submit');finish();assert.equal(get('answer').textContent,'<img src=x onerror=alert(1)>');
    get('reset').emit('click');type(';Pendente;');get('question').value='Teste';get('ritual').emit('submit');get('language').value='en';get('language').emit('change');finish();assert.equal(get('answer').textContent,'');assert.equal(get('connection').textContent,'SESSION OPEN');
    get('ritual').emit('submit');assert.equal(get('error').textContent,'Complete the invocation and ask a question first.');
    get('guide-open').emit('click');assert.equal(get('guide').open,true);get('guide-close').emit('click');assert.equal(get('guide').open,false);
  }finally{Object.assign(globalThis,original);}
});
