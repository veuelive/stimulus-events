import { Controller } from "stimulus";

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

  send(eventName: string, payload?: unknown) {
    document.body.dispatchEvent(
      new CustomEvent(eventName, { detail: payload })
    );
  }

  onConnect<T>(
    channel: string,
    method: (payload: T, channel: string) => void
  ): EventListener {
    let listener = (event: Event) => {
      if (event instanceof CustomEvent) {
        method(event.detail, channel);
      }
    };
    this.eventTarget.addEventListener(channel, listener);
    return listener;
  }

  onDisconnect(channel: string, listener: EventListener) {
    this.eventTarget.removeEventListener(channel, listener);
  }
}
