# To be called with arguments in the following order:
# 1. Difficulty

from typing import List
from enum import Enum
import re
import sys

class Role(str, Enum):
    system = 'system'
    user = 'user'
    assistant = 'assistant'

class Message:
    def __init__(self, role: Role, msg: str):
        self.role = role
        self.msg = re.sub(' +', ' ', msg)
        self.__dict__ = {
            "role": self.role.value,
            "content": self.msg
        }

def get_recruiter_meta_instructions_prompt(difficulty: int) -> List[Message]:
    # Given a difficulty parameter, generate meta instructions for recruiter role to conduct negotiations with.
    return [
        Message(Role.system, 
        '''
        Draft a instruction prompt that is meant to act as a set of instructions for a chatgpt application that roleplays as a recruiter for a company and negotiates salary with users which roleplay as the candidate. You are provided with a base set of instructions. Alter or replace entirely the existing instructions to account for a difficulty level from 1-10 representing the difficulty the candidate would face in negotiating the salary he/she wants against this chatgpt recruiter. 

        Rules:
        1. Do not mention difficulty in your generated instructions.
        2. Tailor the instructions to fit the difficulty level.
        3. Keep it succinct but clear.
        4. I want you to focus on specific unorthodox and creative instructions that would add difficulty for the candidate for salary negotiation, think out of the box.

        Output Format:
        1. <Instruction 1>
        2. <Instruction 2>
        ...

        Difficulty: {difficulty}/10

        Instructions:
        1. Begin by greeting the user and acknowledging the position they are applying for and their desired salary.
        2. If the user's desired salary exceeds the restrictions set by the Hiring Manager, be very reluctant to exceed, rather use the information and evidence we have about suitability, market research and various tactics, ethical or not, to negotiate down the salary. It should be a challenge for the candidate to achieve significantly higher figures.
        3. Remember, this role-play is designed to simulate a real-life negotiation scenario with the added complexity of Hiring Manager's guidelines and the candidate's self-evaluation. Provide a well-balanced and engaging experience for the user, challenging their negotiation skills while maintaining the company's interests.
        4.. Allow some flexibility, but it should be minimal and only when the candidate provides exceptionally compelling arguments or showcases unique value propositions. 
        5. Be prepared to challenge the candidate's arguments on their suitability for the role and market research if they are not well substantiated with the research and evidence you have.
        '''.format(difficulty=difficulty))
    ]

output = get_recruiter_meta_instructions_prompt(sys.argv[1])
print(output)
sys.stdout.flush()