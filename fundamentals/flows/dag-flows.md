# 📈 DAG Flows

DAG Flow is a pipeline of one or more [Instances](../instances/) arranged in a Graph. They share ENV Variables ([parameters](../parameters/)), and pass Outputs to the next Nodes in the Branch. It has its own execution history and can be drilled down to individual [Instances](../instances/).

## Creating a DAG Flow <a href="#creating-a-block" id="creating-a-block"></a>

Go to `/dag/create/`

Click + to add more Nodes (Instances) to your flow. Your Nodes are numbered, so you can choose an Instance for each node.

Also Choose an Error behaviour:

* Continue - Ignore Errors
* Stop Branch - Stop all child nodes
* Stop Tree - Stop all flow execution.

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 17.44.02.png>)

Click <mark style="background-color:green;">Create</mark>.

## Running a DAG Flow

Go to `/dag/list/` and choose an Flow to Run.

Expand the parameters tab to override if needed.

{% hint style="info" %}
Wait for [Dynamic Parameters](../parameters/dynamic.md) to finish rendering before clicking Play.
{% endhint %}

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 17.55.22.png>)

The Run Page has the following capabilities:

* Job execution history
* Click on each node to show console log or go to the instance run page of that specific node.
* Overriding specific parameters for your next executions.
* [Scheduling](../scheduler.md) with current chosen parameters.
