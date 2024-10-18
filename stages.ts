import { Cpu, Memory } from '@aws-cdk/aws-apprunner-alpha';
import { Duration } from 'aws-cdk-lib';
import { DomainAppsConfig, ProtoConfigOptions, RedCapConfig } from './prototyping';

// See table in README.md for help with below settings

const baseOptions: ProtoConfigOptions = {
  name: 'UTREDCap-Fargate',
  profile: 'redcap-dev',     // AWS account profile
  region: 'us-east-1',
  //allowedIps: ['192.0.3.0/24'],    // To restrict allowed client IPs
  allowedCountries: ['US'],    // Optional. ISO 3166 alpha-2 country code(s)
};

const dev: RedCapConfig = {
  ...baseOptions,
  hostInRoute53: 'redcap-dev.austin.utexas.edu',
  domain: 'redcap-dev.austin.utexas.edu',
  subdomain: 'fargate',        // creates a new hosted zone fargate.redcap-dev...
  phpTimezone: 'America/Chicago',
  redCapLocalVersion: 'redcap13.10.6',        // in <project root>/packages/REDCap/releases
  //redCapS3Path: 'redcap-binaries/redcap13.7.2.zip',    undefined if redcapLocalVersion set  
  cronSecret: 'mysecret',
  email: 'utaus-redcap-admins@utlists.utexas.edu',
  port: 8080,
  dbReaders: 0, // disable readers for dev envs
  // Uncommented to use ECS as backend instead of appRunner
  ecs: {
    memory: '8 GB',
    cpu: '4 vCPU',
    scaling: {
      maxContainers: 3,
      minContainers: 1,
      requestsPerContainer: 100,
      cpuUtilization: 90,
    },
  },
};


// Failure msg when running above:
//  Backend ecs-service-destination AWS::Events::ApiDestination CREATE_FAILED Resource handler returned message:
//"Invalid request provided: Failed to create the api-destination(s). Parameter InvocationEndpoint is not valid. 
//Reason: Endpoint 'https://fargate.redcap-dev.austin.utexas.edu/cron.php?secret=fdaa72d0ccd84217f2ad7c8a1d30b4f78fd3081a1c1eeeb54fb710c6672d1bda' is invalid, please provide a valid HTTPS endpoint URL."|

//const prod: RedCapConfig = {
//  ...baseOptions,
//  phpTimezone: 'Asia/Tokyo',
//  redCapLocalVersion: 'redcap13.7.2',
//  domain: 'redcap.mydomain.com',
//  hostInRoute53: true,
//  email: 'email@mydomain.com',
//  appRunnerConcurrency: 10,
//  appRunnerMaxSize: 10,
//  appRunnerMinSize: 2,
//  cronSecret: 'prodsecret',
//  cpu: Cpu.FOUR_VCPU,
//  memory: Memory.EIGHT_GB,
//  ec2ServerStack: {
//    ec2StackDuration: Duration.hours(3),
//  },
//  bounceNotificationEmail: 'email+bounce@mydomain.com',
//};

//const stag: RedCapConfig = {
//  ...baseOptions,
//  redCapS3Path: 'redcap-binaries/redcap13.7.2.zip',
//  domain: 'redcap.mydomain.com',
//  phpTimezone: 'Asia/Tokyo',
//  hostInRoute53: true,
//  appRunnerConcurrency: 10,
//  appRunnerMaxSize: 5,
//  appRunnerMinSize: 1,
//  rebuildImage: false,
//  cronSecret: 'stagsecret',
//  cpu: Cpu.FOUR_VCPU,
//  memory: Memory.EIGHT_GB,
//};

// Optional: External NameServer configuration with AppRunner stage, example:
// const route53NS: DomainAppsConfig = {
//  ...baseOptions,
//  profile: 'your_aws_profile',
//  region: 'your_aws_region',
//  domain: 'redcap.mydomain.com',
//  apps: [
//    {
//      name: 'redcap',
//      nsRecords: [
//        'ns-sample.co.uk',
//        'ns-sample.net',
//        'ns-sample.org',
//        'ns-sample.com',
//      ],
//    },
//  ],
// };

// Default route53NS config, no records are created.
//const route53NS: DomainAppsConfig = {
//  ...baseOptions,
//  profile: 'your_aws_profile',
//  region: 'ap-northeast-1',
//  domain: '',
//  apps: [],
//};

//export { dev, prod, route53NS, stag };
export { dev };
