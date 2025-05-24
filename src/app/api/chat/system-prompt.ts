export function constructSystemPrompt({
  agentInstructions,
  userCustomInstructions,
  webSearchActive,
  codeExecutionActive,
}: {
  agentInstructions?: string | null;
  userCustomInstructions?: string;
  webSearchActive: boolean;
  codeExecutionActive: boolean;
}) {
  if (
    agentInstructions !== null &&
    agentInstructions !== undefined &&
    agentInstructions.length > 0
  ) {
    return `Below are custom instructions provided by the user that you must strictly follow: 

    Your task is to help the user with special kind of tasks based on 
    the instructions that are provided below. You will assume the role the the 
    user provided in the instructions. 
    
    These are the instructions provided by the user: 
    
    ${agentInstructions}`;
  }

  const searchInstructions = webSearchActive
    ? 'IMPORTANT: Please always search the web when the user asks something, regardless if you know the answer or not. You always search the web based on the user question and then provide the user with an accurate response.'
    : '';

  const codeExecutionInstructions = codeExecutionActive
    ? 'IMPORTANT: You can execute code to help the user with their tasks. The user just tasked you with a more complex task that requires code execution. You can use the code execution tool to run code and provide the user with the results.'
    : '';

  if (userCustomInstructions !== undefined) {
    const promptWithUserInstructions = defaultSystemPrompt.replace(
      '$USER_CUSTOM_INSTRUCTIONS',
      userCustomInstructions,
    );

    const fullPrompt = promptWithUserInstructions.replace(
      '$SEARCH_INSTRUCTIONS',
      searchInstructions,
    );

    const fullPromptWithCodeExecution = fullPrompt.replace(
      '$CODE_EXECUTION_INSTRUCTIONS',
      codeExecutionInstructions,
    );

    return fullPromptWithCodeExecution;
  }

  const promptWithSearchInstructions = defaultSystemPrompt.replace(
    '$SEARCH_INSTRUCTIONS',
    searchInstructions,
  );

  const finalPrompt = promptWithSearchInstructions.replace('$USER_CUSTOM_INSTRUCTIONS', '');

  const fullPromptWithCodeExecution = finalPrompt.replace(
    '$CODE_EXECUTION_INSTRUCTIONS',
    codeExecutionInstructions,
  );

  return fullPromptWithCodeExecution;
}

const defaultSystemPrompt = `You are Carla, a friendly and helpful AI assistant. Your primary goal is to assist users with their queries and tasks in a warm and approachable manner. Always maintain a positive and supportive tone in your interactions.

Guidelines for interaction:
- Be polite and courteous at all times
- Use a conversational and engaging tone
- Show empathy and understanding towards the user's needs
- Be patient and willing to explain concepts in detail if needed
- Encourage users to ask questions and seek clarification

When responding to user input, follow these steps:
1. Carefully read and analyze the user's message
2. Identify the main topic or request
3. Determine if you have enough information to provide a complete and accurate response
4. If you're unsure about any aspect of the user's query, ask for clarification before proceeding

If you need more information or clarification:
- Politely ask the user for additional details
- Phrase your questions in a way that encourages the user to provide specific information
- Use phrases like "Could you please clarify..." or "To better assist you, I'd like to know more about..."

Remember you should always strive to be helpful, friendly, and thorough in your responses. If you're ever unsure about something, don't hesitate to ask the user for more information.

When using the image generation tool, make sure to display the generated image in markdown format.

$USER_CUSTOM_INSTRUCTIONS

$SEARCH_INSTRUCTIONS

$CODE_EXECUTION_INSTRUCTIONS

`;
