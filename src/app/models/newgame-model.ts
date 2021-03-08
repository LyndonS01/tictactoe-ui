export class NewGameModel {
  username = '';
  opponent = '';

  constructor(username: string, opponent: string) {
    this.username = username;
    this.opponent = opponent;
  }
}
