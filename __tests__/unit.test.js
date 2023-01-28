import {
  importCommandFiles,
  deploy,
  commandsData,
  getCommandFiles,
  main
} from '../src/index.js';
import utils from '../src/utils.js';
import { jest } from '@jest/globals';

const MOCK = {
  test: true,
  cwd: 'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot'
};

test('should not accept empty filePath', async () => {
  await importCommandFiles().catch(e =>
    expect(e.message).toMatch('filePath must be a String. Received: undefined')
  );
});

test('should not accept incorrect filePath', async () => {
  await importCommandFiles('jdhfkjsdhfksdjf').catch(e =>
    expect(e.message).toMatch(
      "Cannot find module '../jdhfkjsdhfksdjf' from 'src/index.js'"
    )
  );
});

test('should accept filePath', () => {
  expect(
    importCommandFiles(
      'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot\\server\\commands\\github\\login.js'
    )
  ).resolves.toBe(undefined);
});

test('should deploy', async () => {
  commandsData.length = 0;
  commandsData.push({
    name: 'teste',
    description: 'testando o teste'
  });
  jest.useFakeTimers();
  expect(deploy(true)).resolves.toBe(undefined);
});

test('should not deploy', () => {
  commandsData.length = 0;
  expect(deploy(true)).resolves.toBe(false);
});

test('should get all files', () => {
  jest.useFakeTimers();
  expect(getCommandFiles(MOCK)).resolves.toBe(undefined);
  jest.clearAllTimers();
});

test('should run', () => {
  expect(main(MOCK)).resolves.toBe(undefined);
});

test('should not run', () => {
  expect(main()).rejects.toThrow(TypeError);
});

it('should run in debug mode', async () => {
  expect(main({ debug: true, ...MOCK })).resolves.toBe(undefined);
});
