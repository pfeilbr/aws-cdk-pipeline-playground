import { CfnOutput, Construct, Stage, StageProps } from "@aws-cdk/core";
import { AwsCdkPipelinePlaygroundStack } from "./aws-cdk-pipeline-playground-stack";

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new AwsCdkPipelinePlaygroundStack(this, "WebService");

    this.urlOutput = service.urlOutput;
  }
}
