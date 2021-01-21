import EventBus from "./EventBus";
import { MainBus } from "./MainBus";

function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}

export default function subscribeTo(
  channelOrBus: string | EventBus,
  ...channels: string[]
) {
  return (
    target: object,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<
      (payload: unknown, eventName: string) => void
    >
  ) => {
    let eventBus = MainBus;
    if (channelOrBus instanceof EventBus) {
      eventBus = channelOrBus;
    } else {
      channels.unshift(channelOrBus);
    }
    MainBus.addSubscribingClass(target, channels, propertyName);
  };
}
