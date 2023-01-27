import {
  importCommandFiles,
  deploy,
  commandsData,
  getCommandFiles,
  main
} from '../src/index.js';

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
  expect(
    await getCommandFiles({
      test: true,
      cwd: 'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot'
    })
  ).toBe(undefined);
});

test('should run', async () => {
  const mock = {
    test: true,
    cwd: 'C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot'
  };
  expect(main(mock)).resolves.toBe(undefined);
});

test('should not run', async () => {
  expect(main()).rejects.toThrow(TypeError);
});
