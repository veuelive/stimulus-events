import { Controller } from 'stimulus';
import { MainBus } from './MainBus';

export type Payload = Record<string, unknown>;

export type SubscriberMethod = (payload: Payload) => void;

export default function subscribeTo(...channels: string[]) {
  return (target: object, propertyName: string, descriptor: TypedPropertyDescriptor<SubscriberMethod>) => {
    if (target instanceof Controller && descriptor.value instanceof Function) {
      const method = descriptor.value!;
      const originalConnect = target.connect;

      target.connect = function () {
        const channelListeners = channels.map((channel) => {
          return {
            channel,
            listener: MainBus.onConnect(channel, method.bind(this)),
          };
        });
        const originalDisconnect = this.disconnect;
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
