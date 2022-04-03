# 🎲 Instances

An Instance is attached to a [Block](../projects.md). It is essentially a [Parameterized](../parameters/) [Block](../projects.md), with its own execution History. Multiple Instance can exist for the same [Block](../projects.md). It can be run individually, inside a [Flow](../flows/) or be [scheduled](../scheduler.md).

## Creating an Instance <a href="#creating-a-block" id="creating-a-block"></a>

Go to `/instance/create/`

Wait for [Dynamic Parameters](../parameters/dynamic.md) to finish rendering. Choose any [Multi-Choice](../parameters/) and [Dynamic Parameters](../parameters/dynamic.md) as Defaults for your Instance.

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 16.40.40.png>)

Click <mark style="background-color:green;">Create</mark>.

## Running an Instance

Go to `/instance/list/` and choose an Instance to Run.

{% hint style="info" %}
Wait for [Dynamic Parameters](../parameters/dynamic.md) to finish rendering before clicking Play.
{% endhint %}

![](<../../.gitbook/assets/Screen Shot 2022-04-03 at 16.48.08 (1).png>)

The Run Page has the following capabilities:

* Job execution history
* Links to artifacts and viewing console log of different runs.
* Overriding specific parameters for your next executions.
* Console full screen.
* [Scheduling](../scheduler.md) with current chosen parameters.
