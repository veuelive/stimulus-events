import { Context, Controller } from "stimulus";
import connectEventTarget, {
  EventBusNotControllerError,
} from "./connectEventTarget";
import subscribe from "./subscribe";
import {EventBus} from "./EventBus";

const TestEvent = "TestEvent" as

@connectEventTarget
class TestController extends Controller {
  connectCounter = 0;
  disconnectCounter = 0;
  testPayload: unknown;

  connect() {
    this.connectCounter += 1;
  }

  testEmit() {
    EventBus.send(TestEvent, 3)
  }

  disconnect() {
    this.disconnectCounter += 1;
  }

  @subscribe("TestEvent")
  callMe(payload: unknown, eventName: string) {
    this.testPayload = payload;
  }
}

describe("EventBus decorator", () => {
  it("should throw if its not a controller", () => {
    expect(() => {
      @connectEventTarget
      class TestClass {}
      new TestClass();
    }).toThrow();
  });

  it("should connect to controllers", () => {
    let testController = new TestController({} as Context);
    testController.connect();
    expect(testController.connectCounter).toEqual(1);
    testController.disconnect();
    expect(testController.disconnectCounter).toEqual(1);
  });
});
