import { Controller } from "stimulus";

export default function subscribe(...channels: string[]) {
  return (
    target: Controller,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<
      (payload: unknown, eventName: string) => void
    >
  ) => {};
}
