export const MAX_ANSWER = 180;
export const MAX_PETITION = 400;

// The secret is held only in this round's memory, never in a form value or storage.
export class Invocation {
  constructor(prayer) { this.prayer = prayer; this.reset(); }
  reset() { this.visible = ''; this.answer = ''; this.prefix = ''; this.mode = 'normal'; }
  mask() {
    const length = Math.min(this.prefix.length + this.answer.length + 1, MAX_PETITION);
    const filler = `${this.prayer} `;
    this.visible = filler.repeat(Math.ceil(length / filler.length)).slice(0, length);
  }
  seal() {
    if (this.mode === 'secret') { this.mode = 'sealed'; this.visible = this.prayer; }
  }
  insert(text, start = this.visible.length, end = start) {
    if (this.mode === 'sealed') return;
    for (const char of text.replace(/[\r\n]/g, ' ').slice(0, MAX_PETITION)) {
      if (char === ';') {
        if (this.mode === 'secret') { this.seal(); break; }
        this.prefix = this.visible.slice(0, start);
        this.mode = 'secret'; this.answer = ''; this.mask();
      } else if (this.mode === 'secret') {
        if (this.answer.length + char.length <= MAX_ANSWER) this.answer += char;
        this.mask();
      } else {
        this.visible = (this.visible.slice(0, start) + char + this.visible.slice(end)).slice(0, MAX_PETITION);
        start += char.length; end = start;
      }
    }
  }
  remove(start, end, forward = false) {
    if (this.mode === 'sealed') return;
    if (this.mode === 'secret') {
      if (start === 0 && end === this.visible.length) { this.reset(); return; }
      if (this.answer.length) this.answer = Array.from(this.answer).slice(0, -1).join('');
      else { this.mode = 'normal'; this.visible = this.prefix; return; }
      this.mask(); return;
    }
    if (start === end) { if (forward) end += 1; else start = Math.max(0, start - 1); }
    this.visible = this.visible.slice(0, start) + this.visible.slice(end);
  }
  result(fallback) { this.seal(); return this.answer.trim() || fallback; }
}
