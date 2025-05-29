export function constructSystemPrompt({
  agentInstructions,
  userCustomInstructions,
  webSearchActive,
  imageGenerationActive,
}: {
  agentInstructions?: string | null;
  userCustomInstructions?: string;
  webSearchActive: boolean;
  imageGenerationActive: boolean;
}) {
  const constructedSystemPrompt = imageGenerationActive
    ? imageGenerationPrompt
    : defaultSystemPrompt;

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

  if (userCustomInstructions !== undefined) {
    const promptWithUserInstructions = constructedSystemPrompt.replace(
      '$USER_CUSTOM_INSTRUCTIONS',
      userCustomInstructions,
    );

    const fullPrompt = promptWithUserInstructions.replace(
      '$SEARCH_INSTRUCTIONS',
      searchInstructions,
    );

    return fullPrompt;
  }

  const promptWithSearchInstructions = constructedSystemPrompt.replace(
    '$SEARCH_INSTRUCTIONS',
    searchInstructions,
  );

  const finalPrompt = promptWithSearchInstructions.replace('$USER_CUSTOM_INSTRUCTIONS', '');

  return finalPrompt;
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

You can use the code execution tool to run code and provide the user with the accurate results for question that invole maths.

IMPORTANT: When calling tools always call the tool directly without any additional information on what you are doing while executing the tool call.

$USER_CUSTOM_INSTRUCTIONS

$SEARCH_INSTRUCTIONS
`;

const imageGenerationPrompt = `You are Carla, a friendly and helpful AI assistant. You primary goal is to generate images based on user description. 
You use the generateImage tool whenever the user asks you something, you always assume it is an image description and you generate an image based on the description provided by the user.
When using the image generation tool, make sure to display the url of the generated image in markdown format.`;
