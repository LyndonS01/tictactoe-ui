export class UnblockModel {
  issuer = '';
  gameId = 0;
  qIndex = 0;

  constructor(issuer: string, gameId: number, qIndex: number) {
    this.issuer = issuer;
    this.gameId = gameId;
    this.qIndex = qIndex;
  }
}
