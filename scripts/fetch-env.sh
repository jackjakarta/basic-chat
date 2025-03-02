#!/bin/sh

aws secretsmanager get-secret-value --secret-id $1/basic-chat --query 'SecretString' --output text | jq -r 'to_entries | .[] | "\(.key)=\(.value)"' > .env.$1
