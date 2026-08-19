(function (global) {
  const BLOCKED = 1;
  const PLAYABLE = 0;

  class Board {
    constructor({ cols, rows, colors, mask }) {
      this.cols = cols;
      this.rows = rows;
      this.maxColor = colors;
      this.cell = [];
      this.gems = [];
      for (let x = 0; x < cols; x++) {
        this.cell[x] = [];
        this.gems[x] = [];
        for (let y = 0; y < rows; y++) {
          const blocked = mask && mask[y] && mask[y][x] === BLOCKED;
          this.cell[x][y] = blocked ? BLOCKED : PLAYABLE;
          this.gems[x][y] = 0;
        }
      }
    }

    isPlayable(x, y) {
      return x >= 0 && y >= 0 && x < this.cols && y < this.rows && this.cell[x][y] === PLAYABLE;
    }

    colorAt(x, y) {
      return this.isPlayable(x, y) ? this.gems[x][y] : 0;
    }

    randomColor() {
      return 1 + Math.floor(Math.random() * this.maxColor);
    }

    wouldMatch(x, y, color) {
      if (this.colorAt(x - 1, y) === color && this.colorAt(x - 2, y) === color) return true;
      if (this.colorAt(x, y - 1) === color && this.colorAt(x, y - 2) === color) return true;
      return false;
    }

    fillColor(x, y) {
      const options = [];
      for (let c = 1; c <= this.maxColor; c++) {
        if (!this.wouldMatch(x, y, c)) options.push(c);
      }
      return options.length ? options[Math.floor(Math.random() * options.length)] : this.randomColor();
    }

    generateInitial() {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          this.gems[x][y] = this.isPlayable(x, y) ? this.fillColor(x, y) : 0;
        }
      }
      if (!this.hasPossibleMove()) this.shuffle();
    }

    findMatches() {
      const marked = new Set();
      const mark = (x, y) => marked.add(x + "," + y);

      for (let y = 0; y < this.rows; y++) {
        let run = 1;
        for (let x = 1; x <= this.cols; x++) {
          const same = x < this.cols && this.colorAt(x, y) > 0 && this.colorAt(x, y) === this.colorAt(x - 1, y);
          if (same) run++;
          else {
            if (run >= 3) for (let i = 0; i < run; i++) mark(x - 1 - i, y);
            run = 1;
          }
        }
      }
      for (let x = 0; x < this.cols; x++) {
        let run = 1;
        for (let y = 1; y <= this.rows; y++) {
          const same = y < this.rows && this.colorAt(x, y) > 0 && this.colorAt(x, y) === this.colorAt(x, y - 1);
          if (same) run++;
          else {
            if (run >= 3) for (let i = 0; i < run; i++) mark(x, y - 1 - i);
            run = 1;
          }
        }
      }
      return [...marked].map((key) => {
        const [x, y] = key.split(",").map(Number);
        return { x, y, color: this.gems[x][y] };
      });
    }

    clearCells(cells) {
      cells.forEach(({ x, y }) => {
        this.gems[x][y] = 0;
      });
    }

    swap(x1, y1, x2, y2) {
      const t = this.gems[x1][y1];
      this.gems[x1][y1] = this.gems[x2][y2];
      this.gems[x2][y2] = t;
    }

    isAdjacent(a, b) {
      return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
    }

    applyGravity() {
      const moves = [];
      for (let x = 0; x < this.cols; x++) {
        let dest = null;
        for (let y = this.rows - 1; y >= 0; y--) {
          if (!this.isPlayable(x, y)) {
            dest = null;
            continue;
          }
          if (dest === null) dest = y;
          const color = this.gems[x][y];
          if (color > 0) {
            if (y !== dest) {
              this.gems[x][dest] = color;
              this.gems[x][y] = 0;
              moves.push({ fromX: x, fromY: y, toX: x, toY: dest, color });
            }
            const next = dest - 1;
            dest = next >= 0 && this.isPlayable(x, next) ? next : null;
          }
        }
      }
      return moves;
    }

    fillFromTop() {
      const spawned = [];
      for (let x = 0; x < this.cols; x++) {
        let slot = 0;
        for (let y = 0; y < this.rows; y++) {
          if (!this.isPlayable(x, y) || this.gems[x][y] > 0) continue;
          const color = this.randomColor();
          this.gems[x][y] = color;
          spawned.push({ x, y, color, fromY: -1 - slot });
          slot++;
        }
      }
      return spawned;
    }

    createsMatchAfterSwap(x1, y1, x2, y2) {
      this.swap(x1, y1, x2, y2);
      const ok = this.findMatches().length > 0;
      this.swap(x1, y1, x2, y2);
      return ok;
    }

    hasPossibleMove() {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          if (this.colorAt(x, y) <= 0) continue;
          if (x + 1 < this.cols && this.colorAt(x + 1, y) > 0 && this.createsMatchAfterSwap(x, y, x + 1, y)) return true;
          if (y + 1 < this.rows && this.colorAt(x, y + 1) > 0 && this.createsMatchAfterSwap(x, y, x, y + 1)) return true;
        }
      }
      return false;
    }

    shuffle() {
      const colors = [];
      for (let x = 0; x < this.cols; x++) {
        for (let y = 0; y < this.rows; y++) {
          if (this.gems[x][y] > 0) colors.push(this.gems[x][y]);
        }
      }
      for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
      }
      let i = 0;
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          if (this.gems[x][y] > 0) this.gems[x][y] = colors[i++];
        }
      }
      if (this.findMatches().length || !this.hasPossibleMove()) this.generateInitial();
    }
  }

  global.GemEngine = { Board, PLAYABLE, BLOCKED };
})(window);
