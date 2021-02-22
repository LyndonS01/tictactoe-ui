export class NewGameModel {
  username: string = '';
  opponent: string = '';

  constructor(username: string, opponent: string) {
    this.username = username;
    this.opponent = opponent;
  }
}
