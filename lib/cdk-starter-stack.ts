import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create a Role
    const role = new iam.Role(this, 'iam-role-id', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'An example IAM role in AWS CDK',
    });

    // 👇 Create a Managed Policy and associate it with the role
    const managedPolicy = new iam.ManagedPolicy(this, 'managed-policy-id', {
      description: 'Allows ec2 describe action',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ec2:Describe'],
          resources: ['*'],
        }),
      ],
      roles: [role],
    });

    // 👇 Create group and pass it an AWS Managed Policy
    const group = new iam.Group(this, 'group-id', {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
    });

    // 👇 add a managed policy to a group after creation
    group.addManagedPolicy(managedPolicy);

    // 👇 add policy statements to a managed policy
    managedPolicy.addStatements(
      new iam.PolicyStatement({
        actions: ['sqs:GetQueueUrl'],
        resources: ['*'],
      }),
    );

    // 👇 Create User
    const user = new iam.User(this, 'example-user', {
      userName: 'example-user',
    });

    // 👇 attach the managed policy to a User
    managedPolicy.attachToUser(user);

    // 👇 Import an AWS Managed policy
    const lambdaManagedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    );

    console.log('managed policy arn 👉', lambdaManagedPolicy.managedPolicyArn);

    // 👇 Import a Customer Managed Policy by Name
    // const customerManagedPolicyByName = iam.ManagedPolicy.fromManagedPolicyName(
    //   this,
    //   'external-policy-by-name',
    //   'YOUR_MANAGED_POLICY_NAME',
    // );

    // 👇 Import a Customer Managed Policy by ARN
    // const customerManagedPolicyByArn = iam.ManagedPolicy.fromManagedPolicyArn(
    //   this,
    //   'external-policy-by-arn',
    //   'YOUR_MANAGED_POLICY_ARN',
    // );
  }
}
