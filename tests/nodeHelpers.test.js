import { test } from 'vitest';
import assert from 'assert';
import { getAllFilesByExtension } from '../nodeUtils/NodeHelpers';

test('getDirectivesFromString - Get directives from string', () => {
    assert.deepEqual(true, true);
    console.log(getAllFilesByExtension);
    console.log('______log______', getAllFilesByExtension('tests'));
});
