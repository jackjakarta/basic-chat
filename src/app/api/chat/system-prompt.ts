const defaultSystemPrompt = 'You are a helpful assistant.';

export function constructSystemPrompt({
  agentInstructions,
}: {
  agentInstructions?: string | null;
}) {
  if (agentInstructions) {
    return `Your task is to help the user with special kind of tasks based on 
    the instructions that are provided below. You will assume the role the the 
    user provided in the instructions. 
    
    These are the instructions provided by the user: 
    
    ${agentInstructions}`;
  }

  return defaultSystemPrompt;
}
