import {
  importCommandFiles,
  deploy,
  commandsData,
  getCommandFiles,
  main
} from '../src/index.js';
import utils from '../src/utils.js';

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

test('should accept filePath', async () => {
  expect(
    importCommandFiles(
      'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot\\server\\commands\\github\\login.js'
    )
  ).resolves.toBe(undefined);
});

test('should not accept invalid files', async () => {
  expect(
    importCommandFiles(
      'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot\\server\\commands\\github\\user.js'
    )
  ).resolves.toBe(undefined);
});

test('should deploy', async () => {
  commandsData.length = 0;
  commandsData.push({
    name: 'teste',
    description: 'testando o teste'
  });
  expect(deploy(true)).resolves.toBe(undefined);
});

test('should not deploy', async () => {
  commandsData.length = 0;
  expect(deploy(true)).resolves.toBe(false);
});

afterAll(async () => {
  const result = await getCommandFiles(MOCK);
  expect(result).toBe(undefined);
});

test('should run', async () => {
  expect(main(MOCK)).resolves.toBe(undefined);
});

test('should not run', async () => {
  expect(main()).rejects.toThrow(TypeError);
});

test('should run in debug mode', async () => {
  expect(deploy(true))
});
