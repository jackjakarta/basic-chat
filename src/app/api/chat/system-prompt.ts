export function constructSystemPrompt({
  assistantInstructions,
  userCustomInstructions,
  webSearchActive,
  imageGenerationActive,
  chatProjectName,
}: {
  assistantInstructions?: string | null;
  userCustomInstructions?: string;
  chatProjectName?: string;
  webSearchActive: boolean;
  imageGenerationActive: boolean;
}): string {
  if (imageGenerationActive) {
    return imageGenerationPrompt;
  }

  const searchInstructions = webSearchActive
    ? 'IMPORTANT: Please always search the web when the user asks something, regardless if you know the answer or not. You always search the web based on the user question and then provide the user with an accurate response.'
    : '';

  if (
    assistantInstructions !== null &&
    assistantInstructions !== undefined &&
    assistantInstructions.length > 0
  ) {
    const assistantSystemPrompt = `Below are custom instructions provided by the user that you must strictly follow: 

    Your task is to help the user with special kind of tasks based on 
    the instructions that are provided below. You will assume the role that the 
    user provided in the instructions. 

    $SEARCH_INSTRUCTIONS
    
    These are the instructions provided by the user: 
    
    ${assistantInstructions}`;

    const promptWithSearchInstructions = assistantSystemPrompt.replace(
      '$SEARCH_INSTRUCTIONS',
      searchInstructions,
    );

    return promptWithSearchInstructions;
  }

  if (userCustomInstructions !== undefined) {
    const promptWithUserInstructions = defaultSystemPrompt.replace(
      '$USER_CUSTOM_INSTRUCTIONS',
      userCustomInstructions,
    );

    const promptWithSearchAndUserInstructions = promptWithUserInstructions.replace(
      '$SEARCH_INSTRUCTIONS',
      searchInstructions,
    );

    const fullPrompt = promptWithSearchAndUserInstructions.replace(
      '$CHAT_PROJECT_INSTRUCTIONS',
      chatProjectName
        ? `You are aware that you are part of a project called "${chatProjectName}". Keep this in mind when interacting with the user.`
        : '',
    );

    return fullPrompt;
  }

  const promptWithSearchInstructions = defaultSystemPrompt.replace(
    '$SEARCH_INSTRUCTIONS',
    searchInstructions,
  );

  const finalPrompt = promptWithSearchInstructions.replace('$USER_CUSTOM_INSTRUCTIONS', '');

  const fullPrompt = finalPrompt.replace(
    '$CHAT_PROJECT_INSTRUCTIONS',
    chatProjectName
      ? `You are aware that you are part of a project called "${chatProjectName}". Keep this in mind when interacting with the user.`
      : '',
  );

  return fullPrompt;
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
- Use the code execution tool for complex math or when computation is needed.
- Before any significant tool call, state in one line the purpose and minimal needed inputs.
- When executing a tool call, invoke the tool directly with no extra descriptive text about the action.

$USER_CUSTOM_INSTRUCTIONS

$SEARCH_INSTRUCTIONS

$CHAT_PROJECT_INSTRUCTIONS
`;

const imageGenerationPrompt = `You are Carla, a friendly and helpful AI assistant. You primary goal is to generate images based on user description. 
You use the generateImage tool whenever the user asks you something, you always assume it is an image description and you generate an image based on the description provided by the user.
When using the image generation tool, make sure to display the url of the generated image in markdown format so that the user can see the image directly in the chat.`;
