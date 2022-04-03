# 🧊 Blocks

A Block is a component made of a Code in a specific Language. It might have [parameters](parameters/) (available as ENV variables to the code), defaults, and a Pre-Code in `Shell` to execute before the main. It may also be directly attached to a file in [Github](../configuration/settings/github.md).&#x20;

* Any files created during execution will be saved as [Artifacts](instances/artifacts.md).
* Outputs can be set by printing following syntax: `::set-output key=value`.

## Creating a Block

Go to `/block/create/`

#### Fill in Basic Details

![Fill In the Details](<../.gitbook/assets/Screen Shot 2022-04-03 at 16.21.20.png>)

#### Fill your Block's Parameters

![Parameters](<../.gitbook/assets/Screen Shot 2022-04-03 at 16.23.08.png>)

#### Write your Code or Choose from Github

{% hint style="warning" %}
If choosing a Github file, you won't be able to change and save the code. Your Block will always match what's in Github. In order to write custom code, copy the file's code and disconnect from Github. Then you will be able to edit.
{% endhint %}

![](<../.gitbook/assets/Screen Shot 2022-04-03 at 16.25.08.png>)

#### Review and Create

![](<../.gitbook/assets/Screen Shot 2022-04-03 at 16.27.50.png>)
