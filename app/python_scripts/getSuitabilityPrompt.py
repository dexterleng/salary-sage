# To be called with arguments in the following order:
# 1. Normalised resume
# 2. Company
# 3. Job title
# 4. Job description

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
        
def get_suitability_prompt(normalised_resume: str, company: str, job_title: str, job_description: str) -> List[Message]:
    # Returns 2 prompts to get the suitability of a candidate to a role
    return [
            Message(Role.user, 
            f'''
            You are a recruiter. You are provided with the following job description and resume of a candidate. 
            Steps:
            1) Step-by-step, detail positive and negative factors using specific citations of the job description and the candidate's resume on the suitability of the candidate for the job. Determine the strength of the factor in contributing to the suitability of the candidate for this role from -100 to 100. -100 being a major detriment and 100 being a major contributor to the suitability of the candidate for the role.

            2) Output in this Format for each factor:
            <Sequence number>.
            Description: <Factor description>
            Job description citation(s): <job description citations>
            Resume citation(s):<resume citations>
            Evaluation: <evaluation>
            Strength of factor: <Strength of factor>

            3) Determine an overall suitability score from 0 to 100 of the candidate for this specific role.

            Company and role:
            {company}, {job_title}

            Job Description:
            {job_description}

            Resume:
            {normalised_resume}
            ''')
    ]

output = get_suitability_prompt(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
print(output)
sys.stdout.flush()