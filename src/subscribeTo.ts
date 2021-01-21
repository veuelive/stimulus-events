import { Controller } from "stimulus";
import { MainBus } from "./MainBus";

export default function subscribeTo(...channels: string[]) {
  return (
    target: object,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<
      (payload: unknown | null, eventName: string) => void
    >
  ) => {
    if (target instanceof Controller) {
      let method = descriptor.value!;
      let originalConnect = target.connect;

      target.connect = function () {
        channels.forEach((channel) => {
          MainBus.addEventListener(channel, method.bind(this));
        });
        originalConnect.apply(this);
      };
    }

    return descriptor;
  };
}
