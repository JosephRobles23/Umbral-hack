import { describe, it, expect } from "vitest";

describe("graph connection", () => {
  it("exports isConnected function", async () => {
    const mod = await import("./connection");
    expect(typeof mod.isConnected).toBe("function");
  });

  it("exports getDriver function", async () => {
    const mod = await import("./connection");
    expect(typeof mod.getDriver).toBe("function");
  });

  it("isConnected returns a boolean", async () => {
    const { isConnected } = await import("./connection");
    const result = await isConnected();
    expect(typeof result).toBe("boolean");
  });

  it("getDriver returns a driver instance with session method", async () => {
    const { getDriver } = await import("./connection");
    const driver = getDriver();
    expect(driver).toBeDefined();
    expect(typeof driver.session).toBe("function");
    await driver.close();
  });
});
