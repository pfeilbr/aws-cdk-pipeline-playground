import * as cdk from "@aws-cdk/core";
import { ApiGatewayToLambda } from "@aws-solutions-constructs/aws-apigateway-lambda";
import * as defaults from "@aws-solutions-constructs/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as api from "@aws-cdk/aws-apigateway";
//import * as sns from "@aws-cdk/aws-sns";
import { Watchful } from "cdk-watchful";
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

    // const alarmSns = sns.Topic.fromTopicArn(
    //   this,
    //   "AlarmTopic",
    //   "arn:aws:sns:us-east-1:529276214230:NotifyMe"
    // );
    const watchful = new Watchful(this, "watchful", {
      alarmEmail: "brian.pfeil@gmail.com",
    });

    watchful.watchScope(apiGatewayToLambda);

    this.urlOutput = new cdk.CfnOutput(this, "Url", {
      value: apiGatewayToLambda.apiGateway.url,
    });
  }
}
