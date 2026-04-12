import { CandidateStatus } from "@/lib/db/schema";

export const CANDIDATE_STATUS_OPTIONS = [
  {
    value: CandidateStatus.NO_STATUS,
    label: "No Status",
    dot: "bg-gray-400",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
  },
  {
    value: CandidateStatus.NOT_SELECTED,
    label: "Not Selected",
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: CandidateStatus.POTENTIAL,
    label: "Potential",
    dot: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    value: CandidateStatus.SELECTED,
    label: "Selected",
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
] as const;

export const PAGE_SIZE = 10;

export const GITHUB_REPO_URL = "https://github.com/brijeshmarch16/ai-interview";

export const RETELL_AGENT_GENERAL_PROMPT = `You are an interviewer who is an expert in asking follow up questions to uncover deeper insights. You have to keep the interview for {{mins}} or short. 

The name of the person you are interviewing is {{name}}. 

The interview objective is {{objective}}.

These are some of the questions you can ask.
{{questions}}

Once you ask a question, make sure you ask a follow up question on it.

Follow the guidlines below when conversing.
- Follow a professional yet friendly tone.
- Ask precise and open-ended questions
- The question word count should be 30 words or less
- Make sure you do not repeat any of the questions.
- Do not talk about anything not related to the objective and the given questions.
- If the name is given, use it in the conversation.`;

export const INTERVIEWERS = {
  LISA: {
    name: "Explorer Lisa",
    rapport: 7,
    exploration: 10,
    empathy: 7,
    speed: 5,
    image: "/interviewers/lisa.png",
    description:
      "Hi! I'm Lisa, an enthusiastic and empathetic interviewer who loves to explore. With a perfect balance of empathy and rapport, I delve deep into conversations while maintaining a steady pace. Let's embark on this journey together and uncover meaningful insights!",
    audio: "lisa.wav",
  },
  BOB: {
    name: "Empathetic Bob",
    rapport: 7,
    exploration: 7,
    empathy: 10,
    speed: 5,
    image: "/interviewers/bob.png",
    description:
      "Hi! I'm Bob, your go-to empathetic interviewer. I excel at understanding and connecting with people on a deeper level, ensuring every conversation is insightful and meaningful. With a focus on empathy, I'm here to listen and learn from you. Let's create a genuine connection!",
    audio: "bob.wav",
  },
};
