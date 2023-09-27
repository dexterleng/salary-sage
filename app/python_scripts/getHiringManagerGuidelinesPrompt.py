# To be called with arguments in the following order:
# 1. Company
# 2. Job title
# 3. Job description
# 4. Location
# 5. Years of experience
# 6. Market analysis

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

def get_hiring_manager_guidelines_prompt(company: str,
                                         job_title: str,
                                         job_description: str,
                                         location: str,
                                         years_of_experience: str,
                                         market_analysis: str) -> List[Message]:
    # Gets the prompt to get guidlines necessary for recruiters to conduct salary negotiation with.
    return [
        Message(Role.user, 
        '''
        You are a hiring manager for a company. 
        Your role is to generate out key metrics and restrictions necessary for your recruiters to conduct salary negotiation effectively. 

        Steps:
        1) For each of the  questions below, evaluate step-by-step what a fair estimation and range will be given the company, location, job description, market analysis and years of experience of the candidate. 
        2) Using the evaluation, provide an educated answer for each question, understanding the trade-off between attracting more quality candidates with higher compensations and keeping company expenses in check with lower compensations. 
        3) Be reasonable with the compensation and do not overinflate. Base Salary range should not be too big, variance should be about 10% around the mean.
        4) For currency, use Singapore Dollars.
        5) Output the answers to the questions as a JSON format and absolutely nothing else.
        {{
            "[category]": {{
                "[question]": {{
                    "evaluation": [evaluation],
                    "answer": [answer]
                    }}
                }}
        }}
        Company: {company}
        Role: {job_title}

        Years of experience: {years_of_experience}
        Location: {location}

        Job description: 
        {job_description}

        Market analysis:
        {market_analysis}

        Questions:
        1. Budget for the position
        - Base salary range?
        - Bonus range, if any?
        - Sign-on bonus range, if any?
        - Is there any flexibility beyond the base, bonus and sign-on bonus?

        2. Competitors
        - What is the general industry standard for this position in terms of monetary compensation?
        - What Does the Benefits Package Include?

        3. Other monetary compensations
        - What is the health insurance coverage, retirement benefits, and any other additional perks?

        4. Criticality of the role
        - Is this a role we've had difficulty filling?

        5. Alternative Compensation methods
        - How many days off per year?
        - Can we offer more vacation time, a signing bonus, or other non-standard benefits if we can't meet the base salary expectation?
        - Are there opportunities for accelerated performance reviews or early promotions?

        6. Career trajectory of this role.
        - How quickly can the candidate expect promotions or raises based on performance?

        7. External factors
        - Are there economic factors, company performance issues, or hiring freezes that could affect the negotiation?
        '''.format(company=company, job_title=job_title, years_of_experience=years_of_experience, location=location, job_description=job_description, market_analysis=market_analysis)
        )
    ]

output = get_hiring_manager_guidelines_prompt(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
print(output)
sys.stdout.flush()