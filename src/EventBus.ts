import { Controller } from "stimulus";
import { EventBusNotControllerError } from "./connectEventBus";

type MethodSubscription = {
  prototype: any;
  method: string;
  channel: string;
};

export default class EventBus {
  eventTarget: EventTarget;
  methodSubscriptions: MethodSubscription[] = [];
  subscribedInstances: Record<any, Record<string, EventListener[]>> = {};

  constructor(eventTarget: EventTarget) {
    this.eventTarget = eventTarget;
  }

  send(eventName: string, payload: unknown) {
    document.body.dispatchEvent(
      new CustomEvent(eventName, { detail: payload })
    );
  }

  addEventListener(
    channel: string,
    method: (payload: unknown, channel: string) => void
  ) {
    this.eventTarget.addEventListener(channel, (event: Event) => {
      if (event instanceof CustomEvent) {
        method(event.detail, channel);
      }
    });
  }
}
