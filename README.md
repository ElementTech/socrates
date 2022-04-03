# What is Socrates?

## _A Simple Automation Server_

[![@coreui angular](https://img.shields.io/badge/@coreui%20-angular-lightgrey.svg?style=flat-square)](https://github.com/coreui/angular)

[Socrates](./#a-simple-automation-server) is a simple automation server, inspired by Jenkins. It can run tasks in any code language and present them in a friendly dashboard to non-technical users.

![Overview](overview.png)

## Features

* Define Parameterized Blocks of code in any language to be run in Docker.
* Define Static and Dynamic parameters to be used by all Blocks.
* Create Instances of code that can be run individually.
* Create Steps and DAG Flows using Instances of code.
* Save Artifacts and Outputs, managed by Minio S3.
* Schedule any component and view it in a timeline.
* Connect a Github repository with or without a Webhook, automatically update all the code in the server.
* Manage a friendly Developer Portal, give your jobs custom names and folders.
* Can be run on Docker or on Kubernetes

## Components

Socrates's main components are the basic terms that define how to work with the server.

<table><thead><tr><th>Component</th><th>Description</th><th data-hidden></th><th data-hidden></th><th data-type="checkbox" data-hidden>tre</th></tr></thead><tbody><tr><td><a href="fundamentals/projects.md">Block</a></td><td>A Block is a component made of a Code in a specific Language. It might have <a href="fundamentals/parameters/">parameters</a>, defaults, and a Pre-Code in <code>Shell</code> to execute before the main. It may also be directly attached to a file in <a href="configuration/settings/github.md">Github</a>. </td><td></td><td></td><td>false</td></tr><tr><td><a href="fundamentals/instances/">Instance</a></td><td>An Instance is attached to a <a href="fundamentals/projects.md">Block</a>. It is essentially a <a href="fundamentals/parameters/">Parameterized</a> <a href="fundamentals/projects.md">Block</a>, with its own execution History. Multiple Instance can exist for the same <a href="fundamentals/projects.md">Block</a>. It can be run individually, inside a <a href="fundamentals/flows/">Flow</a> or be <a href="fundamentals/scheduler.md">scheduled</a>.</td><td></td><td></td><td>false</td></tr><tr><td><a href="fundamentals/flows/step-flows.md">Steps Flow</a></td><td>Steps Flow is a pipeline of one or more <a href="fundamentals/instances/">Instances</a> arranged in Steps. They share ENV Variables (<a href="fundamentals/parameters/">parameters</a>) and Outputs to the next Steps. It has its own execution history and can be drilled down to individual Instances.</td><td></td><td></td><td>false</td></tr><tr><td><a href="fundamentals/flows/dag-flows.md">DAG Flow</a></td><td>DAG Flow is a pipeline of one or more <a href="fundamentals/instances/">Instances</a> arranged in a Graph. They share ENV Variables (<a href="fundamentals/parameters/">parameters</a>), and pass Outputs to the next Nodes in the Branch. It has its own execution history and can be drilled down to individual <a href="fundamentals/instances/">Instances</a>.</td><td></td><td></td><td>false</td></tr><tr><td><a href="fundamentals/parameters/">Parameters</a></td><td>Parameters can either be private to a Component, or shared between all. Parameters can also be dynamic, by running a small Instance with an Output of an array. This will become a Multi-Choice parameter.</td><td></td><td></td><td>false</td></tr></tbody></table>

## License

MIT
