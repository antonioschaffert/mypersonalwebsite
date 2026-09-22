export const MAX_ANSWER = 180;
export const MAX_PETITION = 400;

// One visible message; the answer exists only in this round's memory.
export class Invocation {
  constructor(prayer) { this.prayer = prayer; this.reset(); }
  reset() { this.visible = ''; this.answer = ''; this.prefix = ''; this.mode = 'normal'; this.caret = 0; }
  get question() {
    if (this.mode === 'secret') return '';
    return (this.visible.startsWith(this.prayer) ? this.visible.slice(this.prayer.length) : this.visible).trim();
  }
  mask() {
    const length = Math.min(this.prefix.length + this.answer.length + 1, MAX_PETITION);
    const filler = `${this.prayer} `;
    this.visible = filler.repeat(Math.ceil(length / filler.length)).slice(0, length);
    this.caret = this.visible.length;
  }
  seal() {
    if (this.mode === 'secret') {
      this.mode = 'question'; this.visible = `${this.prayer} `; this.caret = this.visible.length;
    }
  }
  insert(text, start = this.visible.length, end = start) {
    if (this.visible.length && start === 0 && end === this.visible.length) { this.reset(); start = 0; end = 0; }
    for (const char of text.replace(/[\r\n]/g, ' ').slice(0, MAX_PETITION)) {
      if (char === ';' && this.mode !== 'question') {
        if (this.mode === 'secret') this.seal();
        else { this.prefix = this.visible.slice(0, start); this.mode = 'secret'; this.answer = ''; this.mask(); }
        start = this.visible.length; end = start;
      } else if (this.mode === 'secret') {
        if (this.answer.length + char.length <= MAX_ANSWER) this.answer += char;
        this.mask();
      } else {
        this.visible = (this.visible.slice(0, start) + char + this.visible.slice(end)).slice(0, MAX_PETITION);
        start = Math.min(start + char.length, this.visible.length); end = start; this.caret = start;
      }
    }
  }
  remove(start, end, forward = false) {
    if (start === 0 && end === this.visible.length) { this.reset(); return; }
    if (this.mode === 'secret') {
      if (this.answer.length) this.answer = Array.from(this.answer).slice(0, -1).join('');
      else { this.mode = 'normal'; this.visible = this.prefix; this.caret = this.visible.length; return; }
      this.mask(); return;
    }
    if (start === end) {
      if (forward) end += Array.from(this.visible.slice(end))[0]?.length ?? 0;
      else start -= Array.from(this.visible.slice(0, start)).at(-1)?.length ?? 0;
    }
    this.visible = this.visible.slice(0, start) + this.visible.slice(end); this.caret = start;
    if (!this.visible) this.reset();
  }
  result(fallback) { return this.answer.trim() || fallback; }
}
