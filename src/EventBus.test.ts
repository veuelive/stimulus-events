import { Context, Controller } from "stimulus";
import connectEventBus, { EventBusNotControllerError } from "./connectEventBus";
import subscribeTo from "./subscribeTo";
import { MainBus } from "./MainBus";

const TestEvent = "TestEvent";

@connectEventBus()
class TestController extends Controller {
  connectCounter = 0;
  disconnectCounter = 0;
  testPayload: unknown;

  connect() {
    this.connectCounter += 1;
  }

  testEmit() {
    MainBus.send(TestEvent, 3);
  }

  disconnect() {
    this.disconnectCounter += 1;
  }

  @subscribeTo(TestEvent)
  callMe(payload: unknown, eventName: string) {
    this.testPayload = payload;
  }
}

describe("EventBus decorator", () => {
  it("should throw if its not a controller", () => {
    expect(() => {
      @connectEventBus()
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
