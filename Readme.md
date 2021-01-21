# Stimulus Events

Stimulus events is a simple Typescript library that uses the power of decorators
to easily create an easy eventing system for communication between your different
Stimulus controllers.

Never forget to call and manage `removeEventListener` on `disconnect()` again!

First, let's define an `Events.ts` file for our event constants! Helps us keep track
of what's out there.

````ts
export const UserCountChanged = "UserCountChanged"
````

This isn't strictly necessary, but it helps keep your code more maintainable and is highly recommended.

````ts
import {UserCountChanged} from './Events';

class MyController extends Controller {
    
    @subscribeTo(UserCountChanged)
    updateUserCount(payload: Payload) {
        let {count} = payload
        // And yer off!
        // We'll automatically subscribe on connect() and unsubscribe on disconnect()
    }
}
````

And, triggering this from anywhere in your application is as easy as...

````ts
MainBus.send(UserCountChanged, {count: 3})
````

BOOM! That's it. All done. Time for a tea break.