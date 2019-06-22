/// <reference path=",,/../../node_modules/@types/jasmine/index.d.ts" />
import { StateMachine } from './state-machine'
import { MetaState, MetaStateAction } from './state-meta'

enum StringState {
    State1 = 'State1',
    State2 = 'State2',
    State3 = 'State3'
}

class NamedState {
    public static readonly State1 = new NamedState('State1');
    public static readonly State2 = new NamedState('State2');
    public static readonly State3 = new NamedState('State3');

    constructor(public readonly name: string) {
    }
}

class TypedState {
    public static readonly State1 = new TypedState(StringState.State1);
    public static readonly State2 = new TypedState(StringState.State2);
    public static readonly State3 = new TypedState(StringState.State3);

    get name(): string {
        return this.state;
    }

    constructor(public readonly state: StringState) {
    }

    getState() {
        return this.state;
    }
}

enum Action {
    Action1 = 'Action1',
    Action2 = 'Action2',
    Action3 = 'Action3'
}

describe('StateMachine', () => {
    describe('static', () => {
        describe('fromString()', () => {
            it('should create a machine with meta start state', () => {
                // Given
                const name = 'name';

                // When
                const fsm = StateMachine.fromString<StringState, Action>(name, StringState.State1);

                // Then
                expect(fsm.name).toBe(name);
                expect(fsm.current).toBe(MetaState.Start);
            });
        });

        describe('fromNamed()', () => {
            it('should create a machine with meta start state', () => {
                // Given
                const name = 'name';

                // When
                const fsm = StateMachine.fromNamed<NamedState, Action>(name, NamedState.State1);

                // Then
                expect(fsm.name).toBe(name);
                expect(fsm.current).toBe(MetaState.Start);
            });
        });

        describe('fromType()', () => {
            it('should create a machine with meta start state', () => {
                // Given
                const name = 'name';

                // When
                const fsm = StateMachine.fromType<StringState, Action>(name, TypedState.State1);

                // Then
                expect(fsm.name).toBe(name);
                expect(fsm.current).toBe(MetaState.Start);
            });
        });
    });

    describe('instance', () => {
        describe('do', () => {
            it('should transit to user-defined start state when do start if state is start', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1);
    
                // When
                fsm.do(MetaStateAction.DoStart);
    
                // Then
                expect(fsm.current).toBe(StringState.State1);
            });

            it('should transit to next state when do action if transition is defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: TypedState.State1,
                    actions: [
                        [Action.Action1, TypedState.State2]
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                fsm.do(Action.Action1);
    
                // Then
                expect(fsm.current).toBe(StringState.State2);
            });

            it('should NOT transit to next state when do action if transition is NOT defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: TypedState.State1,
                    actions: [
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                fsm.do(Action.Action1);
    
                // Then
                expect(fsm.current).toBe(StringState.State1);
            });

            it('should transit to next state when do action if anytime transition is defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: MetaState.Anytime,
                    actions: [
                        [Action.Action1, TypedState.State2]
                    ]
                },
                {
                    state: TypedState.State1,
                    actions: [
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                fsm.do(Action.Action1);
    
                // Then
                expect(fsm.current).toBe(StringState.State2);
            });
        });

        describe('can', () => {
            it('should return true when try to do start if state is start', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1);
    
                // When
                const result = fsm.can(MetaStateAction.DoStart);
    
                // Then
                expect(result).toBe(true);
            });

            it('should return true when try to do action if transition is defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: TypedState.State1,
                    actions: [
                        [Action.Action1, TypedState.State2]
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                const result = fsm.can(Action.Action1);
    
                // Then
                expect(result).toBe(true);
            });

            it('should return false when try to do action if transition is NOT defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: TypedState.State1,
                    actions: [
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                const result = fsm.can(Action.Action1);
    
                // Then
                expect(result).toBe(false);
            });

            it('should return true when try to do action if anytime transition is defined', () => {
                // Given
                const fsm = StateMachine.fromType<StringState, Action>('name', TypedState.State1,
                {
                    state: MetaState.Anytime,
                    actions: [
                        [Action.Action1, TypedState.State2]
                    ]
                },
                {
                    state: TypedState.State1,
                    actions: [
                    ]
                });
                fsm.do(MetaStateAction.DoStart);
    
                // When
                const result = fsm.can(Action.Action1);
    
                // Then
                expect(result).toBe(true);
            });
        });

        describe('toMachineMap', () => {
            it('should return only meta start map if state is empty', () => {
                // Given
                const name = 'name';
                const fsm = StateMachine.fromString<StringState, Action>(name, StringState.State1);

                // When
                const result = fsm.toMachineMap();

                // Then
                expect(result).toEqual({
                    name,
                    states: [{
                        name: MetaState.StartName,
                        actions: [{
                            name: MetaStateAction.DoStart,
                            destination: StringState.State1
                        }]
                    }]
                });
            });

            it('should return user-defined map if some states are defined', () => {
                // Given
                const name = 'name';
                const fsm = StateMachine.fromString<StringState, Action>(
                    name,
                    StringState.State1,
                    {
                        state: StringState.State1,
                        actions: [
                            [Action.Action1, StringState.State2]
                        ]
                    }
                );

                // When
                const result = fsm.toMachineMap();

                // Then
                expect(result).toEqual({
                    name,
                    states: [{
                        name: StringState.State1,
                        actions: [{
                            name: Action.Action1,
                            destination: StringState.State2
                        }]
                    }, {
                        name: MetaState.StartName,
                        actions: [{
                            name: MetaStateAction.DoStart,
                            destination: StringState.State1
                        }]
                    }]
                });
            });

            it('should return same map each other', () => {
                // Given
                const name = 'name';
                const stringFsm = StateMachine.fromString<StringState, Action>(
                    name,
                    StringState.State1,
                    {
                        state: MetaState.Anytime,
                        actions: [
                            [Action.Action3, StringState.State1]
                        ]
                    },
                    {
                        state: StringState.State1,
                        actions: [
                            [Action.Action1, StringState.State2]
                        ]
                    },
                    {
                        state: StringState.State2,
                        actions: [
                            [Action.Action2, StringState.State3]
                        ]
                    },
                    {
                        state: StringState.State3,
                        actions: [
                            [Action.Action1, StringState.State2],
                            [Action.Action3, StringState.State1]
                        ]
                    }
                );
                const namedFsm = StateMachine.fromNamed<NamedState, Action>(
                    name,
                    NamedState.State1,
                    {
                        state: MetaState.Anytime,
                        actions: [
                            [Action.Action3, NamedState.State1]
                        ]
                    },
                    {
                        state: NamedState.State1,
                        actions: [
                            [Action.Action1, NamedState.State2]
                        ]
                    },
                    {
                        state: NamedState.State2,
                        actions: [
                            [Action.Action2, NamedState.State3]
                        ]
                    },
                    {
                        state: NamedState.State3,
                        actions: [
                            [Action.Action1, NamedState.State2],
                            [Action.Action3, NamedState.State1]
                        ]
                    }
                );
                const typedFsm = StateMachine.fromType<StringState, Action>(
                    name,
                    TypedState.State1,
                    {
                        state: MetaState.Anytime,
                        actions: [
                            [Action.Action3, TypedState.State1]
                        ]
                    },
                    {
                        state: TypedState.State1,
                        actions: [
                            [Action.Action1, TypedState.State2]
                        ]
                    },
                    {
                        state: TypedState.State2,
                        actions: [
                            [Action.Action2, TypedState.State3]
                        ]
                    },
                    {
                        state: TypedState.State3,
                        actions: [
                            [Action.Action1, TypedState.State2],
                            [Action.Action3, TypedState.State1]
                        ]
                    }
                );

                // When
                const stringResult = stringFsm.toMachineMap();
                const namedResult = namedFsm.toMachineMap();
                const typedResult = typedFsm.toMachineMap();

                // Then
                expect(stringResult).toEqual(namedResult);
                expect(stringResult).toEqual(typedResult);
                expect(namedResult).toEqual(typedResult);
            });
        });
    });
});
