import { Context, Controller } from 'stimulus';
import subscribeTo from './subscribeTo';
import { MainBus } from './MainBus';

const TestEvent = 'TestEvent';
const SecondEvent = 'SecondEvent';

class TestController extends Controller {
  connectCounter = 0;
  disconnectCounter = 0;
  eventCount = 0;
  testPayload: unknown;

  connect() {
    this.connectCounter++;
  }

  disconnect() {
    this.disconnectCounter++;
  }

  @subscribeTo(TestEvent)
  callMe(payload: unknown) {
    this.testPayload = payload;
  }

  @subscribeTo(TestEvent, SecondEvent)
  incrementCounterBy(payload: unknown) {
    this.eventCount++;
  }
}

test('basic function', () => {
  const firstController = new TestController({} as Context);
  const secondController = new TestController({} as Context);

  // Helper function to assert validations
  const expectControllerState = (
    controller: TestController,
    connectCount: number,
    disconnectCount: number,
    eventCount: number,
    testPayload: unknown,
  ) => {
    expect(controller.connectCounter).toEqual(connectCount);
    expect(controller.disconnectCounter).toEqual(disconnectCount);
    expect(controller.eventCount).toEqual(eventCount);
    expect(controller.testPayload).toEqual(testPayload);
  };

  // Clean starting state
  expectControllerState(firstController, 0, 0, 0, undefined);
  expectControllerState(secondController, 0, 0, 0, undefined);

  // Connect!
  firstController.connect();
  expectControllerState(firstController, 1, 0, 0, undefined);
  expectControllerState(secondController, 0, 0, 0, undefined);

  // Trigger the event!
  MainBus.send(TestEvent, '1982');
  expectControllerState(firstController, 1, 0, 1, '1982');
  expectControllerState(secondController, 0, 0, 0, undefined);

  // Add in the second controller
  secondController.connect();
  expectControllerState(firstController, 1, 0, 1, '1982');
  expectControllerState(secondController, 1, 0, 0, undefined);

  // Try it again!
  const testObject = { name: 'Phyliss Diller' };
  MainBus.send(TestEvent, testObject);
  expectControllerState(firstController, 1, 0, 2, testObject);
  expectControllerState(secondController, 1, 0, 1, testObject);

  // Disconnect the first one
  firstController.disconnect();
  expectControllerState(firstController, 1, 1, 2, testObject);
  expectControllerState(secondController, 1, 0, 1, testObject);

  // This means only the second controller should trigger and change values
  MainBus.send(TestEvent, 'MLC');
  expectControllerState(firstController, 1, 1, 2, testObject);
  expectControllerState(secondController, 1, 0, 2, 'MLC');

  // And it's also listening to the second event
  MainBus.send(SecondEvent);
  expectControllerState(firstController, 1, 1, 2, testObject);
  expectControllerState(secondController, 1, 0, 3, 'MLC');
});
