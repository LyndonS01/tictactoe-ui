import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have no messages to start with', () => {
    service = new MessagesService();

    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    service = new MessagesService();

    service.add('You win!');

    expect(service.messages.length).toBe(1);
  });

  it('should remove all messages when clear is called', () => {
    service = new MessagesService();

    service.add('You lost the game');

    service.clear();

    const out = expect(service.messages.length).toBe(0);
  });
});
