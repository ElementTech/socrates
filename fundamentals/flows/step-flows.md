# 🛤 Steps Flows

Steps Flow is a pipeline of one or more [Instances](../instances/) arranged in Steps. They share ENV Variables ([parameters](../parameters/)) and Outputs to the next Steps. It has its own execution history and can be drilled down to individual Instances.

## Creating a Steps Flow <a href="#creating-a-block" id="creating-a-block"></a>

Go to `/step/create/`

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 17.59.24.png>)

Drag & Drop (Instances) to your flow in a specific Step. They can be arranged and Dragged back to be removed. You can also add or remove entire steps.

Also Choose an Error behaviour:

* Continue - Ignore Errors
* Stop - Stop next steps

Click <mark style="background-color:green;">Create</mark>.

## Running a DAG Flow

Go to `/step/list/` and choose an Flow to Run.

{% hint style="info" %}
Wait for [Dynamic Parameters](../parameters/dynamic.md) to finish rendering before clicking Play.
{% endhint %}

Expand the parameters tab to override if needed.

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 18.02.34 (1).png>)

The Run Page has the following capabilities:

* Job execution history
* Click on each instance in step to show console log or go to the instance run page of that specific run.
* Overriding specific parameters for your next executions.
* [Scheduling](../scheduler.md) with current chosen parameters.
