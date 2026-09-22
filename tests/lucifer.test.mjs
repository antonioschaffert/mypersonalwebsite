import test from 'node:test';
import assert from 'node:assert/strict';
import { Invocation, MAX_ANSWER, MAX_PETITION } from '../dist/lucifer/engine.mjs';
const prayer='Lucifer, please answer my question.';
test('hidden typing never appears in the invocation; sealing reveals the intended answer',()=>{
  const game=new Invocation(prayer);game.insert(';');
  for(const char of 'My friend Rafael'){game.insert(char);assert.ok(!game.visible.includes('Rafael'));}
  game.insert(';');assert.equal(game.visible,prayer+' ');assert.equal(game.mode,'question');assert.equal(game.result('fallback'),'My friend Rafael');
});
test('normal invocation has no secret and produces a stock reply',()=>{
  const game=new Invocation(prayer);game.insert(prayer);assert.equal(game.result('The shadows remain.'),'The shadows remain.');
});
test('pasted sequence works with Portuguese accents and emoji',()=>{
  const game=new Invocation('Lúcifer, por favor, responda à minha pergunta.');
  game.insert(';Você está em São Paulo 👋;');assert.equal(game.result('fallback'),'Você está em São Paulo 👋');
});
test('backspace corrects secret by Unicode character without exposing it',()=>{
  const game=new Invocation(prayer);game.insert(';Azul😈');game.remove(game.visible.length,game.visible.length);game.insert('!;');assert.equal(game.result('fallback'),'Azul!');
});
test('Enter ends capture and leaves the same box ready for the question',()=>{
  const game=new Invocation(prayer);game.insert(';Blue');game.seal();game.insert('What color?');assert.equal(game.result('fallback'),'Blue');assert.equal(game.question,'What color?');
});
test('new round erases the old answer and resets capture mode',()=>{
  const game=new Invocation(prayer);game.insert(';old secret;');game.reset();assert.equal(game.visible,'');assert.equal(game.answer,'');game.insert(prayer);assert.equal(game.result('fallback'),'fallback');
});
test('deleting full masked selection clears the secret',()=>{
  const game=new Invocation(prayer);game.insert(';hidden');game.remove(0,game.visible.length);assert.equal(game.answer,'');assert.equal(game.mode,'normal');
});
test('normal selections support insertion and removal',()=>{
  const game=new Invocation(prayer);game.insert('Hello world');game.insert('there',6,11);assert.equal(game.visible,'Hello there');game.remove(5,11);assert.equal(game.visible,'Hello');
});
test('empty hidden answers fall back; malicious text remains literal data',()=>{
  const game=new Invocation(prayer);game.insert(';  ;');assert.equal(game.result('fallback'),'fallback');game.reset();game.insert(';<img src=x onerror=alert(1)>;');assert.equal(game.result('fallback'),'<img src=x onerror=alert(1)>');
});
test('answer and invocation lengths are bounded',()=>{
  const game=new Invocation(prayer);game.insert(';'+ 'a'.repeat(1000));assert.equal(game.answer.length,MAX_ANSWER);game.reset();game.insert('a'.repeat(1000));assert.equal(game.visible.length,MAX_PETITION);
});

test('a complete pasted round uses one box and retains the question after the closing delimiter',()=>{
  const game=new Invocation(prayer);game.insert(';São Paulo;Where am I?');assert.equal(game.visible,prayer+' Where am I?');assert.equal(game.question,'Where am I?');assert.equal(game.result('fallback'),'São Paulo');
});
test('question editing and semicolons do not overwrite the hidden answer',()=>{
  const game=new Invocation(prayer);game.insert(';Blue;What color; really?');const start=game.visible.indexOf('really');game.insert('today',start,start+6);assert.equal(game.question,'What color; today?');assert.equal(game.result('fallback'),'Blue');
});
test('select-all replacement starts a clean message, never reusing an earlier answer',()=>{
  const game=new Invocation(prayer);game.insert(';old secret;First question?');game.insert('New question?',0,game.visible.length);assert.equal(game.answer,'');assert.equal(game.question,'New question?');assert.equal(game.result('fallback'),'fallback');
});
test('hidden capture and a completed invocation alone are not a question',()=>{
  const game=new Invocation(prayer);game.insert(';Blue');assert.equal(game.question,'');game.seal();assert.equal(game.question,'');game.insert('Who?');assert.equal(game.question,'Who?');
});
