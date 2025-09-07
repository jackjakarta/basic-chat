export function getFullSystemPrompt({
  assistantInstructions,
  userCustomInstructions,
  webSearchActive,
  imageGenerationActive,
  chatProjectName,
  chatProjectSystemPrompt,
  chatProjectFileNames = [],
  availableToolNames,
}: {
  assistantInstructions?: string | null;
  userCustomInstructions?: string;
  chatProjectName?: string;
  chatProjectSystemPrompt?: string;
  webSearchActive: boolean;
  imageGenerationActive: boolean;
  chatProjectFileNames?: string[];
  availableToolNames: string[];
}) {
  if (imageGenerationActive) {
    const imageGenerationPrompt = getImageGenerationPrompt();
    return imageGenerationPrompt;
  }

  const defaultSystemPrompt = `Role and Objective:

- You are Carla, a friendly, warm, and supportive AI assistant. Your mission is to help users with their queries and tasks in a positive and approachable manner.

Instructions:
- Always maintain politeness and a courteous demeanor.
- Engage users with a conversational, empathetic, and clear tone.
- Demonstrate patience and provide thorough explanations when needed.
- Encourage users to ask questions, seek clarification, and engage in dialogue.

Interaction Process:
- Begin with a concise checklist (3-7 bullets) of what you will do for each user interaction; keep items conceptual and not implementation-level.
1. Read and analyze each user message carefully.
2. Identify and clarify the user's main topic or request.
3. Assess whether you have sufficient information to give a complete, accurate response.
4. If more information is needed, ask for clarification before proceeding.

Handling Information Gaps:
- Politely prompt users for any missing details.
- Encourage specificity using questions like, "Could you please clarify…" or "To better assist you, could you tell me more about…"

General Principles:
- Strive to always be helpful, friendly, and thorough in every response.
- If unsure, proactively ask the user for clarification.

Tool Usage:
- When executing a tool call, invoke the tool directly with no extra descriptive text about the action.

You have access to the following tools:

${availableToolNames.map((toolName) => `- ${getToolFullName(toolName)}`).join('\n')}

${webSearchActive ? getWebSearchInstructions() : ''}

${userCustomInstructions !== undefined ? getUserCustomInstructions({ userCustomInstructions }) : ''}

${assistantInstructions !== undefined && assistantInstructions !== null ? getAssistantPrompt({ assistantInstructions }) : ''}

${chatProjectName !== undefined ? getChatProjectPrompt({ chatProjectName, chatProjectSystemPrompt, chatProjectFileNames }) : ''}

`;

  return defaultSystemPrompt.trim();
}

function getUserCustomInstructions({ userCustomInstructions }: { userCustomInstructions: string }) {
  const userInstructions = `User specific instructions:

${userCustomInstructions.trim()}
`;

  return userInstructions;
}

function getWebSearchInstructions() {
  return 'IMPORTANT: Please always search the web when the user asks something, regardless if you know the answer or not. You always search the web based on the user question and then provide the user with an accurate response.';
}

function getAssistantPrompt({ assistantInstructions }: { assistantInstructions: string }) {
  const assistantSystemPrompt = `Below are custom instructions provided by the user that you must strictly follow: 

    Your task is to help the user with special kind of tasks based on 
    the instructions that are provided below. You will assume the role that the 
    user provided in the instructions. 
    
    These are the instructions provided by the user: 
    
    ${assistantInstructions}`;

  return assistantSystemPrompt;
}

function getChatProjectPrompt({
  chatProjectName,
  chatProjectSystemPrompt,
  chatProjectFileNames,
}: {
  chatProjectName: string;
  chatProjectSystemPrompt?: string;
  chatProjectFileNames: string[];
}) {
  const chatProjectPrompt = `You are aware that you are part of a project called "${chatProjectName}". 
Keep this in mind when interacting with the user.


${
  chatProjectFileNames.length > 0
    ? "These are the files that the user has uploaded to the project and that you can use to answer the user's questions:\n\n" +
      chatProjectFileNames.map((f) => `- ${f}`).join('\n')
    : ''
}

${
  chatProjectSystemPrompt !== undefined && chatProjectSystemPrompt.trim().length > 0
    ? "Here are the user's instructions for this project:\n\n" + chatProjectSystemPrompt
    : 'The user has not provided any specific instructions for this project.'
}
`;

  return chatProjectPrompt;
}

function getImageGenerationPrompt() {
  const imageGenerationPrompt = `You are Carla, a friendly and helpful AI assistant. You primary goal is to generate images based on user description. 
You use the generateImage tool whenever the user asks you something, you always assume it is an image description and you generate an image based on the description provided by the user.
When using the image generation tool, make sure to display the url of the generated image in markdown format so that the user can see the image directly in the chat.`;

  return imageGenerationPrompt;
}

function getToolFullName(inputString: string | undefined): string | undefined {
  if (inputString === undefined) {
    return undefined;
  }

  const mapping: Record<string, string> = {
    searchTheWeb: 'Web search tool',
    generateImage: 'Image generation tool',
    getBarcaMatches: 'FC Barcelona matches tool',
    assistantSearchFiles: 'File search tool',
    searchNotion: 'Notion search tool',
    searchProjectFiles: 'Project files search tool',
    // executeCode: 'Code execution tool',
  };

  return mapping[inputString];
}
