import { SubscriberMethod, Payload } from './subscribeTo';

type MethodSubscription = {
  prototype: any;
  method: string;
  channel: string;
};

export default class EventBus {
  eventTarget: EventTarget;

  constructor(eventTarget: EventTarget) {
    this.eventTarget = eventTarget;
  }

  send(eventName: string, payload: Payload = {}) {
    document.body.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
  }

  onConnect(channel: string, method: SubscriberMethod): EventListener {
    const listener = (event: Event) => {
      if (event instanceof CustomEvent) {
        method(event.detail);
      }
    };
    this.eventTarget.addEventListener(channel, listener);
    return listener;
  }

  onDisconnect(channel: string, listener: EventListener) {
    this.eventTarget.removeEventListener(channel, listener);
  }
}
