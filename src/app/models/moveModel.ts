export class MoveModel {
  username: string = '';
  gameId: number = 0;
  position: number = 0;

  constructor(username: string, gameId: number, position: number) {
    this.username = username;
    this.gameId = gameId;
    this.position = position;
  }
}
