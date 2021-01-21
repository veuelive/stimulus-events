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

  wrapLifecycleMethods(controller: object): EventBus {
    if (!(controller instanceof Controller)) {
      throw EventBusNotControllerError;
    }

    // Wrap connect() method
    let superConnect = controller.connect;
    controller.connect = (...args) => {
      this.connectCallback(controller);
      superConnect.call(controller, ...args);
    };

    // Wrap disconnect() method
    let superDisconnect = controller.disconnect;
    controller.disconnect = (...args) => {
      this.disconnectCallback(controller);
      superDisconnect.call(controller, ...args);
    };

    return this;
  }

  disconnectCallback(controller: Controller) {
    throw new Error("Method not implemented.");
  }

  connectCallback(controller: Controller) {
    for (const methodSubscription of this.methodSubscriptions) {
      console.log(controller.isPrototypeOf(methodSubscription.prototype));
    }
  }

  addSubscribingClass(prototype: any, channels: string[], methodName: string) {
    channels.forEach((channel) => {
      this.methodSubscriptions.push({
        prototype,
        channel,
        method: methodName,
      });
    });
  }
}
