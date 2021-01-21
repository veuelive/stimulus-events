import { Controller } from "stimulus";
import { MainBus } from "./MainBus";

export default function subscribeTo<T>(...channels: string[]) {
  return (
    target: object,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<
      (payload?: T, eventName?: string) => void
    >
  ) => {
    if (target instanceof Controller) {
      let method = descriptor.value!;
      let originalConnect = target.connect;

      target.connect = function () {
        let channelListeners = channels.map((channel) => {
          return {
            channel,
            listener: MainBus.onConnect(channel, method.bind(this)),
          };
        });
        let originalDisconnect = this.disconnect;
        this.disconnect = function () {
          channelListeners.forEach(({ channel, listener }) => {
            MainBus.onDisconnect(channel, listener);
          });
          originalDisconnect.apply(this);
        };
        originalConnect.apply(this);
      };
    }

    return descriptor;
  };
}
