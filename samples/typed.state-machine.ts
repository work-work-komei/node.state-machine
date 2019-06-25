import { StateMachine, MetaState, MetaStateAction, PumlWriter } from "@working-sloth/state-machine";


class SlothState {
    constructor(
        public readonly energyIncrease: number,
        public readonly sleepinessIncrease: number
    ) {
    }

    mainTask(): void {
        // Foo bar
    }

    dispose(): void {
        // Destroy
    }
}

enum SlothAction {
    Work = 'Work',
    Eat = 'Eat',
    Sleep = 'Sleep',
    Wake = 'Wake',
    Stop = 'Stop'
}

class SlothStateType implements StateType<SlothState> {
    public static readonly Idle = new SlothStateType('Idle', -0.1, 0.1);
    public static readonly Working = new SlothStateType('Working', -1, 100);
    public static readonly Eating = new SlothStateType('Eating', 10, 2);
    public static readonly Sleepy = new SlothStateType('Sleepy', 0.05, 0);
    public static readonly Sleeping = new SlothStateType('Sleeping', -0.01, -10);

    constructor(
        public readonly name: string,
        public readonly energyIncrease: number,
        public readonly sleepinessIncrease: number
    ) {
    }

    getState() {
        return new SlothState(this.energyIncrease, this.sleepinessIncrease);
    }

    onLeaveState(oldState: SlothState) {
        oldState.dispose();
    }
}



const slothStateMachine: StateMachine<SlothState, SlothAction> = StateMachine.fromType<SlothState, SlothAction>(
    'SlothState',
    SlothStateType.Idle,
    {
        state: MetaState.Anytime,
        actions: [
            [SlothAction.Sleep, SlothStateType.Sleeping]
        ]
    },
    {
        state: SlothStateType.Idle,
        actions: [
            [SlothAction.Work, SlothStateType.Working],
            [SlothAction.Eat, SlothStateType.Eating]
        ]
    },
    {
        state: SlothStateType.Working,
        actions: [
            [SlothAction.Stop, SlothStateType.Idle]
        ]
    },
    {
        state: SlothStateType.Sleeping,
        actions: [
            [SlothAction.Wake, SlothStateType.Idle]
        ]
    },
    {
        state: SlothStateType.Eating,
        actions: [
            [SlothAction.Stop, SlothStateType.Idle]
        ]
    },
    {
        state: SlothStateType.Sleepy,
        actions: [
            [SlothAction.Wake, SlothStateType.Idle]
        ]
    },
    {
        state: SlothStateType.Sleeping,
        actions: [
            [SlothAction.Wake, SlothStateType.Sleepy]
        ]
    }
);

console.log(slothStateMachine.export(PumlWriter.getWriter({autoNumber: true})));


slothStateMachine.do(MetaStateAction.DoStart); // Don't forget

if (slothStateMachine.can(SlothAction.Sleep)) {
    slothStateMachine.do(SlothAction.Sleep);
}

let energy = 10;
energy += slothStateMachine.current.energyIncrease;

slothStateMachine.current.mainTask();
