export class SymbolsModel {
  symbol: string[] = [];

  constructor() {
    for (let i = 0; i < 9; i++) {
      this.symbol[i] = '?';
    }
  }
}
