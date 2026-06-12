from dotenv import load_dotenv
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase




def evaluate(query: str , response : str , content: str):
    
    
    faithfulness_metric = FaithfulnessMetric(threshold=0.90)
    answer_relevancy_metric = AnswerRelevancyMetric(threshold=0.95)
        
    test_case = LLMTestCase(
        input=query,
        actual_output=response,
        retrieval_context=[content]
        )
        

    faithfulness_metric.measure(test_case)
    answer_relevancy_metric.measure(test_case)
    
    a_score = answer_relevancy_metric.score
            
    f_success = faithfulness_metric.is_successful()
    a_success = answer_relevancy_metric.is_successful()
            
    if not f_success and not a_success:
            return a_score
        
    return 0
