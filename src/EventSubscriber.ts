import { Controller } from "stimulus";
import { EventBusNotControllerError } from "./connectEventTarget";

type EventName = string;

export default class EventSubscriber {
  controller: Controller;
  eventTarget: EventBus;

  constructor(controller: object, eventTarget: EventTarget) {}

  private connectCallback() {}

  private disconnect() {
    for (const eventName in this.subscriptions) {
      if (this.subscriptions.hasOwnProperty(eventName)) {
        const listeners = this.subscriptions[eventName];
        if (listeners) {
          listeners.forEach((listener) => {
            EVENT_BUS_TARGET.removeEventListener(eventName, listener);
          });
        }
      }
    }
  }
}
