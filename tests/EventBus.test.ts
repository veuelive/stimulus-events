import { Context, Controller } from 'stimulus';
import subscribeTo, {Payload} from '../src/subscribeTo';
import { MainBus } from '../src/MainBus';

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
  callMe(payload: Payload) {
    this.testPayload = payload;
  }

  @subscribeTo(TestEvent, SecondEvent)
  incrementCounterBy(payload: Payload) {
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
  const firstPayload = {year: '1982'};
  MainBus.send(TestEvent, firstPayload);
  expectControllerState(firstController, 1, 0, 1, firstPayload);
  expectControllerState(secondController, 0, 0, 0, undefined);

  // Add in the second controller
  secondController.connect();
  expectControllerState(firstController, 1, 0, 1, firstPayload);
  expectControllerState(secondController, 1, 0, 0, undefined);

  // Try it again!
  const secondPayload = { name: 'Phyliss Diller' };
  MainBus.send(TestEvent, secondPayload);
  expectControllerState(firstController, 1, 0, 2, secondPayload);
  expectControllerState(secondController, 1, 0, 1, secondPayload);

  // Disconnect the first one
  firstController.disconnect();
  expectControllerState(firstController, 1, 1, 2, secondPayload);
  expectControllerState(secondController, 1, 0, 1, secondPayload);

  // This means only the second controller should trigger and change values
  const michaelPayload = {name: 'MLC'};
  MainBus.send(TestEvent, michaelPayload);
  expectControllerState(firstController, 1, 1, 2, secondPayload);
  expectControllerState(secondController, 1, 0, 2, michaelPayload);

  // And it's also listening to the second event
  MainBus.send(SecondEvent);
  expectControllerState(firstController, 1, 1, 2, secondPayload);
  expectControllerState(secondController, 1, 0, 3, michaelPayload);
});
