import { Controller } from "stimulus";
import { MainBus } from "./MainBus";
import EventBus from "./EventBus";

export class EventBusNotControllerError extends Error {}

type Constructor = { new (...args: any[]): {} };

export default function connectEventBus(eventBus: EventBus = MainBus) {
  return function <T extends Constructor>(constructor: T) {
    return class extends constructor {
      eventBus = MainBus.wrapLifecycleMethods(this);
    };
  };
}
