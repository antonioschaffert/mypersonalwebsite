import test from 'node:test';
import assert from 'node:assert/strict';
import { Invocation, MAX_ANSWER, MAX_PETITION } from '../dist/lucifer/engine.mjs';
const prayer='Lucifer, please answer my question.';
test('hidden typing never appears in the invocation; sealing reveals the intended answer',()=>{
  const game=new Invocation(prayer);game.insert(';');
  for(const char of 'My friend Rafael'){game.insert(char);assert.ok(!game.visible.includes('Rafael'));}
  game.insert(';');assert.equal(game.visible,prayer);assert.equal(game.mode,'sealed');assert.equal(game.result('fallback'),'My friend Rafael');
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
test('Enter / explicit seal ends capture; sealed answer cannot be overwritten',()=>{
  const game=new Invocation(prayer);game.insert(';Blue');game.seal();game.insert('red');assert.equal(game.result('fallback'),'Blue');
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
