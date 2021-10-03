# -*- coding: utf-8 -*-
import requests # pip install requests

def send_email(to="", subject="Test", text="Test Message"):
	return requests.post(
		"https://api.mailgun.net/v3/[your_domain].mailgun.org/messages",
		auth=("api", "[your api key]"),
		data={"from": "HUMAN <human@gg.com>",
			"to": [to],
			"subject": subject,
			"text": text
    }
  )