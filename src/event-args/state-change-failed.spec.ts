import { StateChangeFailedEvent } from './state-change-failed';
import { buildDataMatrix } from '@working-sloth/data-matrix';

describe('StateChangeFailedEvent', () => {
    const CurStates = ['1', '2', '3'];
    const Arg = new StateChangeFailedEvent(CurStates, 'action', undefined, 'message');

    type Test = { label: string, input: {}, expect: {} };
    const tests = buildDataMatrix<Test>([
        'label          input               expect',
    ], [
        ['current',     Arg.current,        '3'],
        ['currentRoot', Arg.currentRoot,    '1'],
    ]);

    for (const test of tests) {
        it(test.label, () => {
            expect(test.input).toEqual(test.expect);
        });
    }
});
