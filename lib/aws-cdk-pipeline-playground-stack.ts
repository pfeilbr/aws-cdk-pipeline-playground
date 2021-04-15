import * as cdk from "@aws-cdk/core";
import { ApiGatewayToLambda } from "@aws-solutions-constructs/aws-apigateway-lambda";
import * as lambda from "@aws-cdk/aws-lambda";
export class AwsCdkPipelinePlaygroundStack extends cdk.Stack {
  public readonly urlOutput: CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGatewayToLambda = new ApiGatewayToLambda(
      this,
      "ApiGatewayToLambdaPattern",
      {
        lambdaFunctionProps: {
          runtime: lambda.Runtime.NODEJS_14_X,
          // This assumes a handler function in lib/lambda/index.js
          code: lambda.Code.fromAsset(`${__dirname}/lambda`),
          handler: "index.handler",
        },
      }
    );

    this.urlOutput = new cdk.CfnOutput(this, "Url", {
      value: apiGatewayToLambda.apiGateway.url,
    });
  }
}
