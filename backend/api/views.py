from django.http import StreamingHttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
import os
from dotenv import load_dotenv
import openai


load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")

def read_in_prompt():
    prompt = ""
    with open("./prompt.txt") as text:
        prompt = text.read()
    return prompt

def run_prompt(current_messages):
    try :
        messages = [
            {
                "role": "system",
                "content": str(read_in_prompt())
            }
        ]
        messages.extend(current_messages)
        completions = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=256,
            n=1,
            stop=None,
            temperature=0.7,
            stream=True
        )

        # Save ai_response in chunks 
        # Streaming openai response
        ai_response = ""
        for chunk in completions:
            content = chunk["choices"][0].get("delta", {}).get("content")
            if content is not None:
                ai_response += content
                yield content
    except Exception as e:
        print("ERROR: ", e)
        ai_response = "Sorry, I had trouble responsing. Could you please try again?"
    return ai_response

@api_view(['POST'])
@csrf_exempt
def talk(request):
    body = json.loads(request.body.decode('utf-8'))
    messages = body.get("Body")
    ai_response = run_prompt(messages)
    return StreamingHttpResponse(ai_response, content_type='text/event-stream')
