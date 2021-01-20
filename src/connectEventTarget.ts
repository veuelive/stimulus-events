import EventSubscriber from "./EventSubscriber";
import { Controller } from "stimulus";
import { MainBus } from "./MainBus";

export class EventBusNotControllerError extends Error {}

type Constructor = { new (...args: any[]): {} };

export default function connectEventTarget(eventBus: ) {
  
  // //new constructor function
  // let newConstructorFunction: any = function (...args: unknown[]) {
  //   let func: any = function () {
  //     return new originalConstructor(...args);
  //   };
  //   func.prototype = originalConstructor.prototype;
  //   let controllerInstance: any = new func();
  //   if (!(controllerInstance instanceof Controller)) {
  //     throw new EventBusNotControllerError();
  //   }
  //   Object.defineProperty(controllerInstance, "eventSubscriber", {
  //     value: new EventSubscriber(
  //       controllerInstance as EventSubscriberController,
  //       document
  //     ),
  //   });
  //   Object.defineProperty(controllerInstance, "emitEvent", {
  //     value: (eventName: string, payload: unknown) => {
  //       EVENT_BUS_TARGET.dispatchEvent(
  //         new CustomEvent(eventName, { detail: payload })
  //       );
  //     },
  //   });
  //   return controllerInstance;
  // };
  // newConstructorFunction.prototype = originalConstructor.prototype;
  // return new (class extends newConstructorFunction {
  //   dispatchEvent(event: string, payload?: unknown) {
  //     document.dispatchEvent(new CustomEvent(event, { detail: payload }));
  //   }
  // })();

  return class extends originalConstructor {
    eventBus = MainBus;
  };
}
