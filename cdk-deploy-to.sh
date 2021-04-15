#!/usr/bin/env bash

# src: https://docs.aws.amazon.com/cdk/latest/guide/environments.html

# usage

#!/usr/bin/env bash
# ./cdk-deploy-to.sh 135792468 us-west-1 "$@" || exit
# ./cdk-deploy-to.sh 246813579 eu-west-1 "$@"

if [[ $# -ge 2 ]]; then
    export CDK_DEPLOY_ACCOUNT=$1
    export CDK_DEPLOY_REGION=$2
    shift; shift
    npx cdk deploy "$@"
    exit $?
else
    echo 1>&2 "Provide AWS account and region as first two args."
    echo 1>&2 "Additional args are passed through to cdk deploy."
    exit 1
fi