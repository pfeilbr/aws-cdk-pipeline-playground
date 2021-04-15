import * as cdk from "@aws-cdk/core";
import { ApiGatewayToLambda } from "@aws-solutions-constructs/aws-apigateway-lambda";
import * as defaults from "@aws-solutions-constructs/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as api from "@aws-cdk/aws-apigateway";
export class AwsCdkPipelinePlaygroundStack extends cdk.Stack {
  public readonly urlOutput: cdk.CfnOutput;

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
          environment: {
            MESSAGE: "hello from v2",
          },
        },
        apiGatewayProps: {
          defaultMethodOptions: {
            authorizationType: api.AuthorizationType.NONE,
          },
        },
      }
    );

    this.urlOutput = new cdk.CfnOutput(this, "Url", {
      value: apiGatewayToLambda.apiGateway.url,
    });
  }
}
