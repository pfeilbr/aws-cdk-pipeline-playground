import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from "../lib/aws-cdk-pipeline-demo-stage";
import { ShellScriptAction } from "@aws-cdk/pipelines";

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

    const preprod = new CdkpipelinesDemoStage(
      this,
      "PreProd" /*, {
      env: { account: "529276214230", region: "us-east-1" },
    } */
    );

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

    // This is where we add the application stages
    pipeline.addApplicationStage(preprod);
  }
}
