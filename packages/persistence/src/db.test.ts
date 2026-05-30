import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const TEST_DB_PATH = join(tmpdir(), `umbral-test-${process.pid}.db`);

const mockLoad = vi.hoisted(() => vi.fn());
vi.mock("sqlite-vec", () => ({ load: mockLoad }));

function cleanup() {
  for (const suffix of ["", "-wal", "-shm"]) {
    const f = TEST_DB_PATH + suffix;
    try {
      if (existsSync(f)) unlinkSync(f);
    } catch {
      // ignore busy files on Windows
    }
  }
}

beforeEach(async () => {
  const real = await vi.importActual<typeof import("sqlite-vec")>("sqlite-vec");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockLoad.mockImplementation((db: any) => real.load(db));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("openDb", () => {
  it("abre DB y aplica WAL", async () => {
    const { openDb } = await import("./db");
    const db = openDb(TEST_DB_PATH);
    try {
      const mode = db.pragma("journal_mode", { simple: true });
      expect(mode).toBe("wal");
    } finally {
      db.close();
    }
  });

  it("falla al boot si sqlite-vec ausente", async () => {
    mockLoad.mockImplementation(() => {
      throw new Error("extension not found");
    });
    const { openDb } = await import("./db");
    expect(() => openDb(TEST_DB_PATH)).toThrow("[S13]");
  });
});
