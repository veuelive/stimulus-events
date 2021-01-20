import { Controller } from "stimulus";
import { EventBusNotControllerError } from "./connectEventTarget";

export default class EventBus {
  eventTarget: EventTarget;

  constructor(eventTarget: EventTarget) {
    this.eventTarget = eventTarget;
  }

  send(eventName: string, payload: unknown) {
    document.body.dispatchEvent(
      new CustomEvent(eventName, { detail: payload })
    );
  }

  wrapLifecycleMethods(controller: object) {
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
  }

  disconnectCallback(controller: Controller) {
    throw new Error("Method not implemented.");
  }

  connectCallback(controller: Controller) {}
}
