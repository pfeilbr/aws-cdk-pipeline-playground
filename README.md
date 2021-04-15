# aws-cdk-pipeline-playground

learn AWS [CDK Pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)

## Running

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



```

## Notes

* had to downgrade npm 7 to 6 to get around types error when running `npm run build` on codebuild. see [self mutating cdk pipeline fails after updating cdk version from 1.85.0 to 1.92.0 · Issue #13541 · aws/aws-cdk](https://github.com/aws/aws-cdk/issues/13541#issuecomment-801606777)
    ```sh
    # steps
    npm install -g npm@6
    rm package-lock.json
    npm i
    ```


## Resources

* [CDK Pipelines: Continuous delivery for AWS CDK applications | Amazon Web Services](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/)
* [cdkworkshop.com | CDK PIPELINES](https://cdkworkshop.com/40-dotnet/70-advanced-topics/100-pipelines.html)
* [@aws-cdk/pipelines module · AWS CDK](https://docs.aws.amazon.com/cdk/api/latest/docs/pipelines-readme.html)

## Scratch

```sh
npm i \
@aws-cdk/aws-events@1.97.0 \
@aws-cdk/aws-cloudformation@1.97.0 \
@aws-cdk/aws-iam@1.97.0 \
@aws-cdk/aws-codedeploy@1.97.0 \
@aws-cdk/aws-ecr@1.97.0 \
@aws-cdk/aws-ecs@1.97.0 \
@aws-cdk/aws-s3@1.97.0 \
@aws-cdk/aws-signer@1.97.0 \
@aws-cdk/aws-ecr-assets@1.97.0 \
@aws-cdk/aws-s3-assets@1.97.0
```
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
