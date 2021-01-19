import EventSubscriber from "./EventSubscriber";

export default function eventBus<Controller extends { new (...args: any[]): {} }>(
    klass: Controller
) {
    return class extends klass {
        eventSubscriber = new EventSubscriber()


    };
}