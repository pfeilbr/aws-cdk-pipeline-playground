# aws-cdk-pipeline-playground

learn AWS [CDK Pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)

Example CI/CD pipeline and solution code exist in single CDK project / repo in all authored in same language (typescript).  Any commits to `main` automatically trigger a [CodePipeline](https://aws.amazon.com/codepipeline/) to run and deploy changes to production.  The changes can be to the solution or the pipeline itself.

## Summary

* Simple API Gateway -> Lambda solution to exercise CDK pipeline capabilities. via [AWS Solutions Constructs | aws-apigateway-lambda](https://docs.aws.amazon.com/solutions/latest/constructs/aws-apigateway-lambda.html)
* Creation of PreProd enviroment (stack) with e2e integration tests.
* Creation of Prod environment (stack)
* Automated creation of metrics, alarms, and notification (sns email) for API Gateway and Lambda resources via [awslabs/cdk-watchful](https://github.com/awslabs/cdk-watchful)
* Automated notification (sns email) of CodePipeline state change events (`STARTED`, `SUCCEEDED`, `FAILED`) via EventBridge -> SNS rule.

## High-level Development Workflow

1. Create solution stack [`lib/aws-cdk-pipeline-playground-stack.ts`](lib/aws-cdk-pipeline-playground-stack.ts) (`API gateway -> Lambda`).
1. Create stage [`lib/aws-cdk-pipeline-demo-stage.ts`](lib/aws-cdk-pipeline-demo-stage.ts)(`CdkpipelinesDemoStage`) that wraps the solution stack (`AwsCdkPipelinePlaygroundStack`) for CodePipeline
1. Create pipeline stack [`lib/aws-cdk-demo-pipeline-stack.ts`](lib/aws-cdk-demo-pipeline-stack.ts) and add `CdkpipelinesDemoStage` stage to it

## Steps

```sh
npx cdk init --language=typescript

CDK_VERSION="1.97.0"

# install pipeline deps
npm install \
    @aws-cdk/aws-codepipeline@$CDK_VERSION \
    @aws-cdk/aws-codepipeline-actions@$CDK_VERSION \
    @aws-cdk/pipelines@$CDK_VERSION

# leverages `@aws-solutions-constructs/aws-apigateway-lambda`
# see https://docs.aws.amazon.com/solutions/latest/constructs/aws-apigateway-lambda.html
# note CDK version must match `aws-solutions-constructs` version (e.g. $CDK_VERSION)
npm i \
    @aws-cdk/aws-apigateway@$CDK_VERSION \
    @aws-cdk/aws-lambda@$CDK_VERSION \
    @aws-solutions-constructs/aws-apigateway-lambda@$CDK_VERSION

# build locally
npm run build

# test
npm run test

# create *this* repo in github and do initial push to ensure it exists for
# CodePipeline to find

# provision pipeline

# [optional] if not already ran.  bootstrap for each target account+region combination
cdk bootstrap aws://AWS_ACCOUNT_NUMBER/us-east-1
cdk bootstrap aws://AWS_ACCOUNT_NUMBER/us-west-1

# ensure `cdk-pipeline-01-github-token` exists in Secrets Manager

# one-time operation, deploy the pipeline stack from local machine
cdk deploy  --force --require-approval never

# add stage to pipeline.  this is the api gateway -> lambda stack
code lib/aws-cdk-demo-pipeline-stack.ts # edit

# push changes and pipeline will run and deploy PreProd stage
npm run build
git commit -am 'Add PreProd stage'
git push

# the pipeline automatically reconfigures itself to add the new stage and
# deploy to it

# modify solution and/or pipeline, commit, and iterate

```

## Notes

Each pipeline stage is compiled into it's own cloud assembly as follows:

* `cdk.out/assembly-Dev`
* `cdk.out/assembly-CdkpipelinesDemoPipelineStack-PreProd`
* `cdk.out/assembly-CdkpipelinesDemoPipelineStack-Prod`

You can deploy and individual stage (cfn stack) by itself.  For example, for dev.

```sh
npm run build # If necessary, to recompile the Lambda sources
cdk synth
cdk -a cdk.out/assembly-Dev deploy --force --require-approval never

# ensure dev account is bootstrapped first
npx cdk bootstrap \
  --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
  aws://DEVELOPER_ACCOUNT/us-east-1
```

---

* see [`cdk-deploy-to.sh`](cdk-deploy-to.sh) for handy deployment script for different account+region combinations.  Remember to bootstrap target account+region with `cdk bootstrap aws://account/region`
* had to downgrade npm 7 to 6 to get around types error when running `npm run build` on codebuild. see [self mutating cdk pipeline fails after updating cdk version from 1.85.0 to 1.92.0 · Issue #13541 · aws/aws-cdk](https://github.com/aws/aws-cdk/issues/13541#issuecomment-801606777)
    ```sh
    # steps
    npm install -g npm@6
    rm package-lock.json
    npm i
    ```

## Screenshots

### AWS Console | CodePipeline

<img src="https://www.evernote.com/l/AAE6NqeDir5OzJ03mkeMXRIxup_JygJDKG8B/image.png" alt="" width="75%" />

<img src="https://www.evernote.com/l/AAEubcb4P69PmJ1Av4SHOYfWhgyaQWmLBBsB/image.png" alt="" width="75%" />

<img src="https://www.evernote.com/l/AAHfP1motBxP3KPCmTNkFV2hatoUecHL5DgB/image.png" alt="" width="75%" />

<img src="https://www.evernote.com/l/AAHSk5xUmvdPm477hfHkLxRVPqGMUROrFLwB/image.png" alt="" width="75%" />

### SNS Email Notifications

CodePipeline State Change COMPLETED
<img src="https://www.evernote.com/l/AAEEPW3ju7dGVZQz93zo4d4UEC0_CAg8wiIB/image.png" alt="" width="75%" />

API Gateway 5XX Count Threshold Hit
<img src="https://www.evernote.com/l/AAF_uNyvwUxB25RNyVJS-LF5bpg25ddWK_8B/image.png" alt="" width="75%" />

Lambda Error Count Threshold Hit
<img src="https://www.evernote.com/l/AAHGMhNbuAFBlLHq1jAK85_c9l4CUwDnZVsB/image.png" alt="" width="75%" />



## Resources

* [CDK Pipelines: Continuous delivery for AWS CDK applications | Amazon Web Services](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)
* [cdkworkshop.com | CDK PIPELINES](https://cdkworkshop.com/40-dotnet/70-advanced-topics/100-pipelines.html)
* [@aws-cdk/pipelines module · AWS CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html)

---

*original cdk generated `README.md` below*

---

# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
