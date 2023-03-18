import {
  importCommandFiles,
  deploy,
  buildCommandFiles,
  getCommandFiles,
  main,
} from "../dist/src/index";
import { jest } from "@jest/globals";
import { cwd } from "process";

const commandsData = new Array();

test("should not accept invalid filePath", async () => {
  await buildCommandFiles("").catch((e) =>
    expect(e.message).toMatch("filePath must be Valid.")
  );
  await buildCommandFiles("jsdkhajkdkjsdhdsadll").catch((e) =>
    expect(e.message).toMatch("filePath must be Valid.")
  );
  await buildCommandFiles(
    "C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot"
  ).catch((e) => expect(e.message).toMatch("filePath must be Valid."));
});

test("should not return an undefined array", async () => {
  commandsData.push({
    name: "teste",
    description: "testando o teste",
  });
  expect(importCommandFiles()).resolves.not.toBe(undefined);
});

test("should not accept filePath", () => {
  expect(
    buildCommandFiles(
      "C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot\\server\\commands\\github\\login.js"
    )
  ).rejects.toThrow(TypeError("filePath must be Valid."));
});

test("should deploy", async () => {
  commandsData.push({
    name: "teste",
    description: "testando o teste",
  });
  jest.useFakeTimers();
  expect(deploy(commandsData)).resolves.toBe(false);
});

test("should not deploy", () => {
  commandsData.length = 0;
  expect(deploy(commandsData)).resolves.toBe(false);
});

test("should get all files", () => {
  jest.useFakeTimers();
  expect(getCommandFiles()).resolves.toBe(undefined);
  jest.clearAllTimers();
});

test("should run", () => {
  jest.useFakeTimers();
  expect(
    main({
      test: true,
      cwd: cwd(),
    })
  ).resolves.toBe(undefined);
  jest.clearAllTimers();
});

test("should not run", () => {
  jest.useFakeTimers();
  expect(main()).rejects.toThrow(TypeError);
  jest.clearAllTimers();
});

it("should run in debug mode", async () => {
  jest.useFakeTimers();
  expect(main({ debug: true, test: true, cwd: cwd() })).resolves.toBe(
    undefined
  );
  jest.clearAllTimers();
});
