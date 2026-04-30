import { describe, expect, it } from "vitest";
import express from "express";
import { createApp } from "./app";

describe("createApp", () => {
  it("returns an instance of Express", () => {
    const app = createApp();
    expect(app).toBeInstanceOf(express.application.constructor);
  });
});
