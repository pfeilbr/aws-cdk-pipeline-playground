import * as cdk from "@aws-cdk/core";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "../lib/aws-cdk-pipeline-demo-stage";
import { ShellScriptAction } from "@aws-cdk/pipelines";
import * as sns from "@aws-cdk/aws-sns";
import * as subs from "@aws-cdk/aws-sns-subscriptions";
import * as event_targets from "@aws-cdk/aws-events-targets";

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, "Pipeline", {
      // The pipeline name
      pipelineName: "MyServicePipeline",
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager("cdk-pipeline-01-github-token"),
        owner: "pfeilbr",
        repo: "aws-cdk-pipeline-playground",
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // We need a build step to compile the TypeScript Lambda
        buildCommand: "npm run build",
      }),
    });

    const preprod = new CdkpipelinesDemoStage(this, "PreProd", {
      env: { account: "529276214230", region: "us-east-1" },
    });

    cdk.Tags.of(preprod).add("Application", "WebService");
    cdk.Tags.of(preprod).add("Environment", "PreProd");
    cdk.Tags.of(preprod).add("StageName", preprod.stageName);
    cdk.Tags.of(preprod).add("Costcenter", "999999999");

    const preprodStage = pipeline.addApplicationStage(preprod);
    preprodStage.addActions(
      new ShellScriptAction({
        actionName: "TestService",
        useOutputs: {
          // Get the stack Output from the Stage and make it available in
          // the shell script as $ENDPOINT_URL.
          ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
        },
        commands: [
          // Use 'curl' to GET the given URL and fail if it returns an error
          "curl -Ssf $ENDPOINT_URL",
        ],
      })
    );

    const prod = new CdkpipelinesDemoStage(this, "Prod", {
      env: { account: "529276214230", region: "us-east-1" },
    });

    // add production stage
    const prodStage = pipeline.addApplicationStage(prod);

    cdk.Tags.of(preprod).add("Application", "WebService");
    cdk.Tags.of(preprod).add("Environment", "Prod");
    cdk.Tags.of(preprod).add("StageName", prod.stageName);
    cdk.Tags.of(preprod).add("Costcenter", "999999999");

    const topic = new sns.Topic(this, `CodePipelineStateChange`, {
      displayName: `${pipeline.codePipeline.pipelineName} Pipeline State Change`,
    });
    const topicEventTarget = new event_targets.SnsTopic(topic);
    topic.addSubscription(new subs.EmailSubscription("brian.pfeil@gmail.com"));
    const rule = pipeline.codePipeline.onStateChange(`CodePipelineStateChange`);
    rule.addTarget(topicEventTarget);
  }
}
