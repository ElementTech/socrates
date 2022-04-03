# 🚈 Flows

Flows are an aggregation of one or more [Instances](../instances/). They Follow these general guidelines:

* Each Node inside a Flow will pass it's outputs to the next in line.
* All Nodes will share their initial [Parameters](../parameters/) in one long list inside their ENV variables.
* A Flow will stop according it its "Error Behaviour"
* A Flow can be [scheduled](../scheduler.md) like any other Runnable.

As of today, two types of Flows Exist:

* [DAG Flows](dag-flows.md)
* [Step Flows](step-flows.md)
