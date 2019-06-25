# State Machine

[![npm version](https://badge.fury.io/js/%40working-sloth%2Fstate-machine.svg)](https://badge.fury.io/js/%40working-sloth%2Fstate-machine)
[![Build Status](https://travis-ci.org/work-work-komei/node.state-machine.svg?branch=develop)](https://travis-ci.org/work-work-komei/node.state-machine)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/03db41b395194a168573c9b647f9db24)](https://app.codacy.com/app/work-work-komei/node.state-machine?utm_source=github.com&utm_medium=referral&utm_content=work-work-komei/node.state-machine&utm_campaign=Badge_Grade_Dashboard)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

![StateMachine](https://github.com/work-work-komei/node.state-machine/blob/develop/samples/SlothState.png)

Note: Current version is beta.

## Functions
 - Provide rich and typed state machine
 - Export state machine as text (ex. PlantUML)

## Quick start
 
### case: String state (most simple)
```js
import { StateMachine } from '@working-sloth/state-machine';

enum SlothState {
    Idle = 'Idle',
    ...
}

enum SlothAction {
    Sleep = 'Sleep',
    ...
}

const fsm = StateMachine.fromString<SlothState, SlothAction>(
    'Sloth State', // state machine name
    SlothState.Idle, // start state
    {
        state: SlothState.Idle,
        actions: [
            [SlothAction.Sleep, SlothState.Sleep],
            [SlothAction.Eat, SlothState.Eating],
        ]
    }, {
        state: SlothState.Sleeping,
        actions: [
            [SloshAction.Wake, SlothState.Idle],
        ]
    }, {
        state: SlothState.Eating,
        actions: [
            [SlothAction.Sleep, SlothState.Sleep],
            [SlothAction.Stop, SlothState.Idle],
        ]
    }
);

if (fsm.can(SlothAction.Sleep)) {
    fsm.do(SlothAction.Sleep);
}
```

### case: Named static state (rich state)
 See samples: https://github.com/work-work-komei/node.state-machine/tree/develop/samples


### case: Typed dynamic state (rich state with life cycle)
 See samples: https://github.com/work-work-komei/node.state-machine/tree/develop/samples


## Schedule
 - Create string-based fsm from PlantUML: someday
 - State nesting: someday
 - Check coverage: someday
 - Crate docs: someday
 - Release v1.0: someday
 - Rest: every day
 - Sleep: every day
 - Be clever and lazy: soon
 - Be stupid and diligent: never
