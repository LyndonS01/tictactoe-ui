export class NewGameModel {
  username = '';
  opponent = '';
  setId: number | undefined;
  bestOf = 0;

  constructor(
    username: string,
    opponent: string,
    setId: number | undefined,
    bestOf: number
  ) {
    this.username = username;
    this.opponent = opponent;
    this.setId = setId;
    this.bestOf = bestOf;
  }
}
