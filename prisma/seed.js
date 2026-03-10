const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Models
  const models = [
    { modelId: "gpt-4-turbo", provider: "openai", displayName: "GPT-4 Turbo" },
    { modelId: "claude-3-opus", provider: "anthropic", displayName: "Claude 3 Opus" },
    { modelId: "gemini-1.5-pro", provider: "google", displayName: "Gemini 1.5 Pro" },
  ];

  for (const model of models) {
    await prisma.modelConfig.upsert({
      where: { modelId: model.modelId },
      update: {},
      create: model,
    });
  }

  // Seed an API Key
  await prisma.apiKey.upsert({
    where: { key: "tk_test_123456789" },
    update: {},
    create: {
      name: "Default Test Key",
      key: "tk_test_123456789",
      budgetLimit: 100.0,
    },
  });

  // Seed Prompt Templates
  const prompts = [
    { 
      name: "Customer Support Hero", 
      content: "You are a helpful customer support agent for Takeoff AI. Always be polite.",
      description: "Default persona for support bots."
    },
    { 
      name: "SQL Expert", 
      content: "You are an expert SQL engineer. Generate only valid SQLite syntax.",
      description: "Optimized for data querying tasks."
    },
  ];

  for (const prompt of prompts) {
    await prisma.promptTemplate.upsert({
      where: { name: prompt.name },
      update: {},
      create: prompt,
    });
  }

  // Seed MCP Servers
  const mcpServers = [
    { name: "GitHub Integration", url: "mcp://github.com/takeoff", type: "GitHub", status: "Online" },
    { name: "Slack Bridge", url: "https://slack.takeoff.ai/mcp", type: "Slack", status: "Offline" },
  ];

  for (const mcp of mcpServers) {
    await prisma.mcpServer.upsert({
      where: { name: mcp.name },
      update: {},
      create: mcp,
    });
  }

  // Seed Agent Configs
  const agents = [
    { 
      name: "Triage Agent", 
      framework: "CrewAI", 
      role: "Customer Success Coordinator", 
      goal: "Analyze incoming tickets and route to correct department.",
      status: "Active"
    },
    { 
      name: "Code Reviewer", 
      framework: "LangChain", 
      role: "Senior Software Engineer", 
      goal: "Evaluate PRs for security and performance.",
      status: "Active"
    },
  ];

  for (const agent of agents) {
    await prisma.agentConfig.upsert({
      where: { name: agent.name },
      update: {},
      create: agent,
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
