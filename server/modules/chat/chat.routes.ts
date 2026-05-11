import { Router } from "express";
import { createChatController } from "./chat.controller.js";
import type { AgentClient } from "./chat.types.js";

interface ChatRouterDependencies {
  agentClient: AgentClient;
}

export function createChatRouter(dependencies: ChatRouterDependencies) {
  const router = Router();

  router.post("/", createChatController(dependencies));

  return router;
}
