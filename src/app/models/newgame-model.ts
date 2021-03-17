export class NewGameModel {
  username = '';
  opponent = '';
  setId = 0;
  bestOf = 0;

  constructor(
    username: string,
    opponent: string,
    setId: number,
    bestOf: number
  ) {
    this.username = username;
    this.opponent = opponent;
    this.setId = setId;
    this.bestOf = bestOf;
  }
}
