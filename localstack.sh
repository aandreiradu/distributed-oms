# !/usr/bin/env bash

set -euo pipefail

echo "Configuring Localstack"
echo "==================="
echo ""

LOCALSTACK_HOST=${LOCALSTACK_HOST:-localhost}
AWS_REGION=eu-central-1
LOCALSTACK_DUMMY_ID=000000000000

create_topic() {
    local TOPIC_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME_TO_CREATE} --output text
}

create_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    local QUEUE_DEAD_LETTERS_ARN=$2
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --attributes "{\"RedrivePolicy\": \"{\\\"maxReceiveCount\\\":\\\"5\\\", \\\"deadLetterTargetArn\\\": \\\"${QUEUE_DEAD_LETTERS_ARN}\\\"}\"}" --output text
}

create_dead_letter_queue() {
    local QUEUE_NAME_TO_CREATE=$1
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --output text
}

link_queue_and_topic() {
    local TOPIC_ARN_TO_LINK=$1
    local QUEUE_ARN_TO_LINK=$2
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${TOPIC_ARN_TO_LINK} --protocol sqs --notification-endpoint ${QUEUE_ARN_TO_LINK} --output text
}

set_subscription_prefix_filter() {
    local SUBSCRIPTION_ARN=$1
    local FILTER_ATTRIBUTE=$2
    awslocal sns set-subscription-attributes --subscription-arn "$SUBSCRIPTION_ARN" --attribute-name FilterPolicy --attribute-value "{ \"type\": [{\"prefix\": \"$FILTER_ATTRIBUTE\"}] }"
}

guess_queue_arn_from_name() {
    local QUEUE_NAME=$1
    echo "arn:aws:sqs:${AWS_REGION}:${LOCALSTACK_DUMMY_ID}:$QUEUE_NAME"
}

guess_topic_arn_from_name() {
    local TOPIC_NAME=$1
    echo "arn:aws:sns:${AWS_REGION}:${LOCALSTACK_DUMMY_ID}:$TOPIC_NAME"
}

create_s3_bucket() { 
    local BUCKET_NAME=$1
    echo "creating bucket" "$BUCKET_NAME"
    awslocal s3api create-bucket --bucket "$BUCKET_NAME" --create-bucket-configuration LocationConstraint="$AWS_REGION"
    echo "successfully created bucket" "$BUCKET_NAME"
    echo "applying cors config to bucket" "$BUCKET_NAME"
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file://s3-cors-config.json
    echo "successfully applied cors config to bucket" "$BUCKET_NAME"
}


# # events topic
# echo "Creating events topic"
# TOPIC_EVENTS_URL=$(create_topic events)
# TOPIC_EVENTS_ARN=$(guess_topic_arn_from_name events)


# echo $TOPIC_EVENTS_URL
# echo $TOPIC_EVENTS_ARN

# echo "Queues:"


# echo "Creating notifications dead letter queue"
# QUEUE_NOTIFICATIONS_DEAD_LETTER_URL=$(create_dead_letter_queue notifications-dead-letter)
# QUEUE_NOTIFICATIONS_DEAD_LETTERS_ARN=$(guess_queue_arn_from_name notifications-dead-letter)


# echo "Creating notifications queue"
# QUEUE_NOTIFICATIONS_URL=$(create_queue notifications $QUEUE_NOTIFICATIONS_DEAD_LETTERS_ARN)
# QUEUE_NOTIFICATIONS_ARN=$(guess_queue_arn_from_name notifications)

# echo "Creating categories dead letter queue"
# QUEUE_CATEGORIES_DEAD_LETTER_URL=$(create_dead_letter_queue categories-dead-letter)
# QUEUE_CATEGORIES_DEAD_LETTER_ARN=$(guess_queue_arn_from_name categories-dead-letter)

# echo "Creating categories queue"
# QUEUE_CATEGORIES_URL=$(create_queue categories $QUEUE_CATEGORIES_DEAD_LETTER_URL)
# QUEUE_CATEGORIES_ARN=$(guess_queue_arn_from_name categories)

# echo "Creating platforms dead letter queue"
# QUEUE_PLATFORMS_DEAD_LETTER_URL=$(create_dead_letter_queue platforms-dead-letter)
# QUEUE_PLATFORMS_DEAD_LETTER_ARN=$(guess_queue_arn_from_name platforms-dead-letter)

# echo "Creating platforms queue"
# QUEUE_PLATFORMS_URL=$(create_queue platforms $QUEUE_PLATFORMS_DEAD_LETTER_URL)
# QUEUE_PLATFORMS_ARN=$(guess_queue_arn_from_name platforms)


# echo "Creating orders dead letter queue"
# QUEUE_ORDERS_DEAD_LETTER_URL=$(create_dead_letter_queue orders-dead-letter)
# QUEUE_ORDERS_DEAD_LETTERS_ARN=$(guess_queue_arn_from_name orders-dead-letter)

# echo "Creating orders queue"
# QUEUE_ORDERS_URL=$(create_queue orders $QUEUE_ORDERS_DEAD_LETTER_URL)
# QUEUE_ORDERS_ARN=$(guess_queue_arn_from_name orders)


# echo "Creating payments dead letter queue"
# QUEUE_PAYMENTS_DEAD_LETTER_URL=$(create_dead_letter_queue payments-dead-letter)
# QUEUE_PAYMENTS_DEAD_LETTERS_ARN=$(guess_queue_arn_from_name payments-dead-letter)

# echo "Creating payments queue"
# QUEUE_PAYMENTS_URL=$(create_queue payments $QUEUE_PAYMENTS_DEAD_LETTER_URL)
# QUEUE_PAYMENTS_ARN=$(guess_queue_arn_from_name payments)

# echo "Creating inventory dead letter queue"
# QUEUE_INVENTORY_DEAD_LETTER_URL=$(create_dead_letter_queue inventory-dead-letter)
# QUEUE_INVENTORY_DEAD_LETTER_ARN=$(guess_queue_arn_from_name inventory-dead-letter)

# echo "Creating inventory queue"
# QUEUE_INVENTORY_URL=$(create_queue inventory $QUEUE_INVENTORY_DEAD_LETTER_URL)
# QUEUE_PAYMENTS_ARN=$(guess_queue_arn_from_name inventory)


# echo "Creating invoices dead letter queue"
# QUEUE_INVOICES_DEAD_LETTER_URL=$(create_dead_letter_queue invoices-dead-letter)
# QUEUE_INVOICES_DEAD_LETTER_ARN=$(guess_queue_arn_from_name invoices-dead-letter)

# echo "Creating invoices queue"
# QUEUE_INVOICES_URL=$(create_queue invoices $QUEUE_INVOICES_DEAD_LETTER_URL)
# QUEUE_INVOICES_ARN=$(guess_queue_arn_from_name invoices)


# echo "Linking notifications events to queue notifications"
# SUBSCRIPTION_ARN_NOTIFICATIONS=$(link_queue_and_topic $TOPIC_EVENTS_ARN $QUEUE_NOTIFICATIONS_ARN notifications)
# echo $SUBSCRIPTION_ARN_NOTIFICATIONS
# set_subscription_prefix_filter $SUBSCRIPTION_ARN_NOTIFICATIONS notifications

# echo "Linking categories events to queue categories"
# SUBSCRIPTION_ARN_CATEGORIES=$(link_queue_and_topic $TOPIC_EVENTS_ARN $QUEUE_PLATFORMS_ARN categories)
# echo $SUBSCRIPTION_ARN_CATEGORIES
# set_subscription_prefix_filter $SUBSCRIPTION_ARN_CATEGORIES categories

# echo "Linking platforms events to queue platforms"
# SUBSCRIPTION_ARN_PLATFORMS=$(link_queue_and_topic $TOPIC_EVENTS_ARN $QUEUE_PLATFORMS_ARN platforms)
# echo $SUBSCRIPTION_ARN_PLATFORMS
# set_subscription_prefix_filter $SUBSCRIPTION_ARN_PLATFORMS platforms


# echo "Creating S3 Buckets"
# create_s3_bucket pn-email-templates