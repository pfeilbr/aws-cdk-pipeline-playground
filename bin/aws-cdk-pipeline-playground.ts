#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CdkpipelinesDemoPipelineStack } from "../lib/aws-cdk-demo-pipeline-stack";
import { CdkpipelinesDemoStage } from "../lib/aws-cdk-pipeline-demo-stage";

const app = new cdk.App();
const pipelineStack = new CdkpipelinesDemoPipelineStack(
  app,
  "CdkpipelinesDemoPipelineStack",
  {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
    env: {
      account:
        process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    },
  }
);

cdk.Tags.of(pipelineStack).add("Application", "CdkpipelinesDemoPipelineStack");
cdk.Tags.of(pipelineStack).add("Costcenter", "999999999");

// this is for manual deployment of Dev environment (stack) via
// cdk -a cdk.out/assembly-Dev deploy --force --require-approval never
new CdkpipelinesDemoStage(app, "Dev", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
