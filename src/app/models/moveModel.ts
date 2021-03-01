export class MoveModel {
  username = '';
  gameId = 0;
  position = 0;

  constructor(username: string, gameId: number, position: number) {
    this.username = username;
    this.gameId = gameId;
    this.position = position;
  }
}
