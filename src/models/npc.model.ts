export type MovementPattern = { [key: string]: number[][] };

export class NPC {
  currentX: number;
  currentY: number;
  isMovingX: boolean;
  isMovingY: boolean;
  currentDirection: string;
  isMoving: boolean;
  frameWidth: number;
  frameIndex: number;
  movementQueue: string[];
  previousX: { value: number };
  previousY: { value: number };
  playable: boolean;
  playerID?: string;
  state: NPCState;

  constructor(currentX: number = 10, currentY: number = 10, playable : boolean = false, state : NPCState = NPCState.Idle ) {
    this.currentX = currentX;
    this.currentY = currentY;
    this.isMovingX = false;
    this.isMovingY = false;
    this.currentDirection = 'left';
    this.isMoving = false;
    this.frameWidth = 12;
    this.frameIndex = 0;
    this.movementQueue = [];
    this.previousX = { value: 0 };
    this.previousY = { value: 0 };
    this.playable = playable;
    this.state = state;
  }
}

export enum NPCState {
  Idle,
  Wandering,
  Seeking
}